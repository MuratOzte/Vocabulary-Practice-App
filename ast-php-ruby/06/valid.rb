module Stress
  class Invoice
    def total(items)
      items.sum { |item| item[:price] * [item[:quantity], 1].max }
    end
  end
end
