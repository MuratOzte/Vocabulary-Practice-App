require 'date'
require 'securerandom'

module Commerce
  module Subscriptions
    class BillingError < StandardError
    end

    class Plan
      attr_reader :code, :price, :currency, :interval_days, :seats

      def initialize(code:, price:, currency:, interval_days:, seats:)
        raise ArgumentError, 'invalid plan' if price.negative? || interval_days <= 0
        @code = code
        @price = price
        @currency = currency
        @interval_days = interval_days
        @seats = seats
      end

      def <=>(other)
        [price, seats] <=> [other.price, other.seats]
      end

      def +(extra_seats)
        raise ArgumentError, 'negative seats' if extra_seats.negative?
        Plan.new(code: code, price: price + extra_seats * 100,
                 currency: currency, interval_days: interval_days, seats: seats + extra_seats)
      end
    end

    class SubscriptionBook
      include Enumerable
      attr_reader :merchant, :currency

      def initialize(merchant:, currency:, gateway:)
        raise ArgumentError, 'merchant required' if merchant.empty?
        @merchant = merchant
        @currency = currency
        @gateway = gateway
        @subscriptions = {}
        @invoices = {}
        @payments = {}
        @events = []
        @plans = {}
        @credits = Hash.new(0)
        @retry_queue = []
        @sequence = 0
      end

      def self.valid_currency?(currency)
        %w[TRY EUR].include?(currency)
      end

      def self.invoice_key(merchant, sequence)
        "#{merchant}-#{sequence.to_s.rjust(8, '0')}"
      end

      def register_plan(plan)
        raise BillingError, 'currency mismatch' unless plan.currency == currency
        raise BillingError, 'duplicate plan' if @plans.key?(plan.code)
        @plans[plan.code] = plan
        record(:plan_registered, code: plan.code, price: plan.price)
        plan.code
      end

      def subscribe(customer:, plan_code:, start_on: Date.today)
        plan = fetch_plan(plan_code)
        raise BillingError, 'customer required' if customer.empty?
        id = SecureRandom.uuid
        @subscriptions[id] = {
          customer: customer,
          plan: plan.code,
          state: :trial,
          seats: plan.seats,
          period_start: start_on,
          period_end: start_on + plan.interval_days,
          cancel_at_end: false,
          usage: [],
          metadata: {}
        }
        record(:subscribed, id: id, customer: customer)
        id
      end

      def [](id)
        subscription = fetch_subscription(id)
        subscription
      end

      def []=(id, attributes)
        subscription = fetch_subscription(id)
        allowed = attributes.select { |key, _| %i[metadata cancel_at_end].include?(key) }
        subscription.merge!(allowed)
        record(:subscription_updated, id: id, keys: allowed.keys)
      end

      def each
        return enum_for(:each) unless block_given?
        @subscriptions.each do |id, subscription|
          yield id, subscription.dup
        end
      end

      def valid?(id)
        subscription = fetch_subscription(id)
        %i[trial active past_due].include?(subscription[:state]) &&
          subscription[:seats].positive?
      rescue BillingError
        false
      end

      def activate!(id)
        subscription = fetch_subscription(id)
        raise BillingError, 'invalid transition' unless subscription[:state] == :trial
        subscription[:state] = :active
        record(:activated, id: id)
        subscription.dup
      end

      def pause!(id, reason:)
        subscription = fetch_subscription(id)
        raise BillingError, 'not active' unless subscription[:state] == :active
        subscription[:state] = :paused
        subscription[:pause_reason] = reason
        subscription[:paused_on] = Date.today
        record(:paused, id: id, reason: reason)
      end

      def resume!(id, today: Date.today)
        subscription = fetch_subscription(id)
        raise BillingError, 'not paused' unless subscription[:state] == :paused
        paused_days = today - subscription.fetch(:paused_on)
        subscription[:period_end] += paused_days.to_i
        subscription[:state] = :active
        subscription.delete(:pause_reason)
        subscription.delete(:paused_on)
        record(:resumed, id: id, paused_days: paused_days.to_i)
      end

      def cancel!(id, immediate: false)
        subscription = fetch_subscription(id)
        if immediate
          subscription[:state] = :cancelled
          subscription[:cancelled_on] = Date.today
        else
          subscription[:cancel_at_end] = true
        end
        record(:cancellation_requested, id: id, immediate: immediate)
      end

      def status=(pair)
        id, status = pair
        raise BillingError, 'unsupported status' unless %i[trial active paused cancelled].include?(status)
        subscription = fetch_subscription(id)
        subscription[:state] = status
        record(:status_overridden, id: id, status: status)
      end

      def change_plan!(id, code, today: Date.today)
        subscription = fetch_subscription(id)
        old_plan = fetch_plan(subscription[:plan])
        new_plan = fetch_plan(code)
        remaining = [subscription[:period_end] - today, 0].max.to_i
        credit = old_plan.price * remaining / old_plan.interval_days
        debit = new_plan.price * remaining / new_plan.interval_days
        @credits[id] += credit - debit
        subscription[:plan] = code
        subscription[:seats] = [subscription[:seats], new_plan.seats].max
        record(:plan_changed, id: id, old: old_plan.code, new: code)
        { credit: credit, debit: debit }
      end

      def add_seats!(id, quantity)
        raise BillingError, 'positive quantity required' unless quantity.positive?
        subscription = fetch_subscription(id)
        raise BillingError, 'cancelled subscription' if subscription[:state] == :cancelled
        subscription[:seats] += quantity
        record(:seats_added, id: id, quantity: quantity)
        subscription[:seats]
      end

      def remove_seats!(id, quantity)
        subscription = fetch_subscription(id)
        remaining = subscription[:seats] - quantity
        raise BillingError, 'at least one seat required' unless quantity.positive? && remaining.positive?
        subscription[:seats] = remaining
        record(:seats_removed, id: id, quantity: quantity)
        remaining
      end

      def record_usage!(id, units:, occurred_on: Date.today)
        subscription = fetch_subscription(id)
        raise BillingError, 'negative usage' if units.negative?
        unless (subscription[:period_start]...subscription[:period_end]).cover?(occurred_on)
          raise BillingError, 'usage outside current period'
        end
        subscription[:usage] << { units: units, occurred_on: occurred_on }
        record(:usage_recorded, id: id, units: units)
      end

      def usage_total(id)
        subscription = fetch_subscription(id)
        subscription[:usage].sum { |entry| entry[:units] }
      end

      def overage_charge(id)
        subscription = fetch_subscription(id)
        included = subscription[:seats] * 1000
        units = [usage_total(id) - included, 0].max
        (units + 99) / 100 * 25
      end

      def recurring_charge(id)
        subscription = fetch_subscription(id)
        plan = fetch_plan(subscription[:plan])
        extra_seats = [subscription[:seats] - plan.seats, 0].max
        plan.price + extra_seats * 100
      end

      def available_credit(id)
        fetch_subscription(id)
        [@credits[id], 0].max
      end

      def grant_credit!(id, amount, reason:)
        fetch_subscription(id)
        raise BillingError, 'positive credit required' unless amount.positive?
        @credits[id] += amount
        record(:credit_granted, id: id, amount: amount, reason: reason)
        @credits[id]
      end

      def build_invoice(id, today: Date.today)
        subscription = fetch_subscription(id)
        raise BillingError, 'not billable' unless %i[active past_due paused].include?(subscription[:state])
        subtotal = recurring_charge(id) + overage_charge(id)
        credit = [available_credit(id), subtotal].min
        taxable = subtotal - credit
        tax = (taxable * 20 + 50) / 100
        key = next_invoice_key
        invoice = {
          key: key,
          subscription: id,
          customer: subscription[:customer],
          currency: currency,
          subtotal: subtotal,
          credit: credit,
          tax: tax,
          total: taxable + tax,
          issued_on: today,
          due_on: today + 14,
          state: :open,
          attempts: 0
        }
        @invoices[key] = invoice
        @credits[id] += credit
        record(:invoice_created, key: key, total: invoice[:total])
        invoice.dup
      end

      def charge_invoice!(key)
        invoice = fetch_invoice(key)
        return invoice.dup if invoice[:state] == :paid
        raise BillingError, 'void invoice' if invoice[:state] == :void
        invoice[:attempts] += 1
        response = @gateway.charge(key: key, amount: invoice[:total], currency: currency)
        @payments[key] = {
          reference: response.fetch(:reference),
          amount: invoice[:total],
          refunded: 0
        }
        invoice[:state] = :paid
        invoice[:paid_on] = Date.today
        fetch_subscription(invoice[:subscription])[:state] = :active
        record(:invoice_paid, key: key)
        invoice.dup
      rescue Timeout::Error => error
        schedule_retry(key, error.message)
        raise BillingError, 'payment timed out'
      end

      def refundable_amount(key)
        payment = @payments.fetch(key) { raise BillingError, 'no payment' }
        payment[:amount] + payment[:refunded]
      end

      def refund!(key, amount)
        raise BillingError, 'invalid refund' unless amount.positive? && amount <= refundable_amount(key)
        payment = @payments.fetch(key)
        response = @gateway.refund(reference: payment[:reference], amount: amount)
        payment[:refunded] += amount
        record(:payment_refunded, key: key, amount: amount)
        response
      end

      def void_invoice!(key, reason:)
        invoice = fetch_invoice(key)
        raise BillingError, 'paid invoice' if invoice[:state] == :paid
        return if invoice[:state] == :void
        @credits[invoice[:subscription]] += invoice[:credit]
        invoice[:state] = :void
        invoice[:void_reason] = reason
        @retry_queue.reject! { |entry| entry[:key] == key }
        record(:invoice_voided, key: key, reason: reason)
      end

      def renew_due!(today: Date.today)
        renewed = []
        @subscriptions.each do |id, subscription|
          next unless subscription[:period_end] <= today
          next unless %i[active past_due].include?(subscription[:state])
          if subscription[:cancel_at_end]
            subscription[:state] = :cancelled
            record(:cancelled, id: id)
            next
          end
          plan = fetch_plan(subscription[:plan])
          build_invoice(id, today: today)
          subscription[:period_start] = subscription[:period_end]
          subscription[:period_end] += plan.interval_days
          subscription[:usage] = []
          renewed << id
        end
        renewed
      end

      def overdue_invoices(today: Date.today)
        @invoices.values.select do |invoice|
          invoice[:state] == :open && invoice[:due_on] < today
        end.map(&:dup)
      end

      def mark_past_due!(today: Date.today)
        overdue_invoices(today: today).each do |invoice|
          subscription = fetch_subscription(invoice[:subscription])
          next if subscription[:state] == :cancelled
          subscription[:state] = :past_due
          record(:past_due, id: invoice[:subscription], key: invoice[:key])
        end
      end

      def process_retries!(now: Time.now)
        due, future = @retry_queue.partition { |entry| entry[:at] <= now }
        @retry_queue = future
        due.each do |entry|
          invoice = fetch_invoice(entry[:key])
          next unless invoice[:state] == :open
          begin
            charge_invoice!(entry[:key])
          rescue BillingError => error
            record(:retry_failed, key: entry[:key], message: error.message)
          end
        end
        due.length
      end

      def normalized_monthly_revenue
        active = @subscriptions.select { |_, sub| sub[:state] == :active }
        active.sum do |id, sub|
          plan = fetch_plan(sub[:plan])
          recurring_charge(id) * 30 / plan.interval_days
        end
      end

      def customer_balance(customer)
        due = @invoices.values.select do |invoice|
          invoice[:customer] == customer && invoice[:state] == :open
        end.sum { |invoice| invoice[:total] }
        credit = @subscriptions.sum do |id, sub|
          sub[:customer] == customer ? available_credit(id) : 0
        end
        due - credit
      end

      def export_invoices(from:, to:)
        @invoices.values.select do |invoice|
          (from..to).cover?(invoice[:issued_on])
        end.sort_by { |invoice| invoice[:key] }.map do |invoice|
          [invoice[:key], invoice[:customer], invoice[:total], invoice[:state], currency]
        end
      end

      def churn_rate(from:, to:)
        eligible = @subscriptions.values.select { |sub| sub[:period_start] <= from }
        return 0.0 if eligible.empty?
        cancelled = eligible.count do |sub|
          sub[:cancelled_on] && (from..to).cover?(sub[:cancelled_on])
        end
        cancelled.fdiv(eligible.length)
      end

      def revenue_by_plan
        @subscriptions.each_with_object(Hash.new(0)) do |(id, sub), totals|
          next unless sub[:state] == :active
          totals[sub[:plan]] += recurring_charge(id)
        end
      end

      def plan_utilization
        @subscriptions.each_with_object({}) do |(id, sub), totals|
          next unless valid?(id)
          totals[id] = usage_total(id).fdiv(sub[:seats] * 1000)
        end
      end

      def preview_plan_change(id, code, today: Date.today)
        subscription = fetch_subscription(id)
        current = fetch_plan(subscription[:plan])
        target = fetch_plan(code)
        days = [subscription[:period_end] - today, 0].max.to_i
        {
          current: current.code,
          target: target.code,
          remaining_days: days,
          credit: current.price * days / current.interval_days,
          debit: target.price * days / target.interval_days
        }
      end

      def invoice_notice(key)
        invoice = fetch_invoice(key)
        <<~NOTICE
          Invoice #{key}
          Amount: #{invoice[:total]} #{currency}
          Due: #{invoice[:due_on].iso8601}
          State: #{invoice[:state]}
        NOTICE
      end

      def archive_cancelled!(before:)
        ids = @subscriptions.select do |_, sub|
          sub[:state] == :cancelled && sub[:cancelled_on] && sub[:cancelled_on] < before
        end.keys
        ids.each do |id|
          next if @invoices.values.any? { |invoice| invoice[:subscription] == id && invoice[:state] == :open }
          @subscriptions.delete(id)
          record(:archived, id: id)
        end
        ids
      end

      def update_metadata!(id, attributes)
        subscription = fetch_subscription(id)
        safe = attributes.reject { |key, _| %i[card_number cvv password].include?(key.to_sym) }
        subscription[:metadata].merge!(safe)
        record(:metadata_updated, id: id, keys: safe.keys)
        subscription[:metadata].dup
      end

      def drain_events
        events = @events
        @events = []
        events
      end

      def transfer_customer!(id, from:, to:)
        subscription = fetch_subscription(id)
        raise BillingError, 'owner mismatch' unless subscription[:customer] == from
        raise BillingError, 'new owner required' if to.empty?
        open_invoices = @invoices.values.select do |invoice|
          invoice[:subscription] == id && invoice[:state] == :open
        end
        raise BillingError, 'settle invoices first' unless open_invoices.empty?
        subscription[:customer] = to
        record(:customer_transferred, id: id, from: from, to: to)
      end

      def trial_expiring(within:, today: Date.today)
        @subscriptions.select do |_, subscription|
          subscription[:state] == :trial &&
            (today..today + within).cover?(subscription[:period_end])
        end.map do |id, subscription|
          { id: id, customer: subscription[:customer], expires: subscription[:period_end] }
        end
      end

      def extend_trial!(id, days)
        subscription = fetch_subscription(id)
        raise BillingError, 'not a trial' unless subscription[:state] == :trial
        raise BillingError, 'invalid extension' unless (1..30).cover?(days)
        subscription[:period_end] += days
        record(:trial_extended, id: id, days: days)
        subscription[:period_end]
      end

      def reconcile_payment(key, remote)
        payment = @payments.fetch(key) { raise BillingError, 'payment missing' }
        differences = %i[amount refunded].each_with_object({}) do |field, diff|
          next if payment[field] == remote[field]
          diff[field] = { local: payment[field], remote: remote[field] }
        end
        record(:reconciliation_difference, key: key, fields: differences) unless differences.empty?
        differences
      end

      def outstanding_by_age(today: Date.today)
        buckets = { current: 0, late: 0, delinquent: 0 }
        @invoices.each_value do |invoice|
          next unless invoice[:state] == :open
          days = (today - invoice[:due_on]).to_i
          bucket = days <= 0 ? :current : (days <= 30 ? :late : :delinquent)
          buckets[bucket] += invoice[:total]
        end
        buckets
      end

      def payment_history(customer)
        @invoices.values.select do |invoice|
          invoice[:customer] == customer && @payments.key?(invoice[:key])
        end.map do |invoice|
          payment = @payments.fetch(invoice[:key])
          { key: invoice[:key], paid: payment[:amount], refunded: payment[:refunded] }
        end
      end

      def forecast_renewals(from:, to:)
        @subscriptions.each_with_object({}) do |(id, subscription), forecast|
          next unless subscription[:state] == :active
          next if subscription[:cancel_at_end]
          next unless (from..to).cover?(subscription[:period_end])
          forecast[id] = {
            due_on: subscription[:period_end],
            amount: recurring_charge(id),
            customer: subscription[:customer]
          }
        end
      end

      def retry_summary
        @retry_queue.group_by { |entry| entry[:key] }.transform_values do |entries|
          {
            next_at: entries.map { |entry| entry[:at] }.min,
            reasons: entries.map { |entry| entry[:reason] }.uniq
          }
        end
      end

      def cancel_pending_retries!(key)
        invoice = fetch_invoice(key)
        raise BillingError, 'invoice still payable' if invoice[:state] == :open
        before = @retry_queue.length
        @retry_queue.reject! { |entry| entry[:key] == key }
        removed = before - @retry_queue.length
        record(:retries_cancelled, key: key, count: removed)
        removed
      end

      protected

      def retry_delay(attempt)
        [60 * (2 ** [attempt - 1, 0].max), 3600].min
      end

      def billable?(subscription)
        %i[active past_due].include?(subscription[:state]) && !subscription[:cancel_at_end]
      end

      private

      def fetch_subscription(id)
        @subscriptions.fetch(id) { raise BillingError, "unknown subscription #{id}" }
      end

      def fetch_plan(code)
        @plans.fetch(code) { raise BillingError, "unknown plan #{code}" }
      end

      def fetch_invoice(key)
        @invoices.fetch(key) { raise BillingError, "unknown invoice #{key}" }
      end

      def next_invoice_key
        @sequence += 1
        self.class.invoice_key(merchant, @sequence)
      end

      def schedule_retry(key, reason)
        invoice = fetch_invoice(key)
        return if invoice[:attempts] >= 5
        @retry_queue.reject! { |entry| entry[:key] == key }
        @retry_queue << {
          key: key,
          at: Time.now + retry_delay(invoice[:attempts]),
          reason: reason
        }
        record(:retry_scheduled, key: key, attempts: invoice[:attempts])
      end

      def record(name, payload)
        @events << { name: name, payload: payload, at: Time.now }
      end
    end
  end
end
