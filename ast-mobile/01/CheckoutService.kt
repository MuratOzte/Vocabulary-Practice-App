package fixtures.checkout

@Target(AnnotationTarget.FUNCTION, AnnotationTarget.CLASS)
annotation class Audited(val action: String)
data class Order(val id: String, val totalCents: Long, val currency: String = "TRY")
data class PolicyResult(val accepted: Boolean, val remaining: Long, val reason: String)
sealed class PaymentResult {
    data class Accepted(val receipt: String): PaymentResult()
    data class Rejected(val reason: String): PaymentResult()
}
enum class OrderState { NEW, RESERVED, PAID, REFUNDED }
interface PaymentGateway { suspend fun capture(order: Order): String }
object CurrencyRules {
    val supported = setOf("TRY", "EUR", "USD")
    fun supported(currency: String) = currency in supported
}
fun Long.withTax(): Long = this + this / 5
fun receiptKey(order: Order): String = "receipt:${order.id}"
fun <T> firstOrFail(values: List<T>): T = values.first()

@Audited("checkout")
class CheckoutService(private val gateway: PaymentGateway) {
    companion object {
        fun idempotencyKey(order: Order): String = "capture:${order.id}"
    }
    class RetryPolicy(val limit: Int = 3)
    inner class Session(val merchantId: String) {
        fun key(order: Order) = "$merchantId:${order.id}"
    }
    private val audits = mutableListOf<String>()
    private val balances = mutableMapOf<String, Long>()
    private var captured = 0L
    var exposure: Long = 0
        set(value) { require(value >= 0); field = value }
    val netCaptured: Long
        get() = captured - exposure
    init { require(RetryPolicy().limit > 0) }
    constructor(gateway: PaymentGateway, openingBalance: Long): this(gateway) {
        balances["opening"] = openingBalance
    }
    fun quote(amount: Long): Long = amount.withTax()
    fun quote(amount: Long, discount: Long): Long = (amount - discount).withTax()
    fun legacyReceipt(order: Order): String = receiptKey(order)
    fun reconcile(order: Order): Boolean = balances.containsKey(order.id)
    @Audited("capture")
    suspend fun capture(order: Order): PaymentResult {
        require(order.totalCents > 0) { "invalid total" }
        require(CurrencyRules.supported(order.currency))
        val receipt = gateway.capture(order)
        captured += order.totalCents
        balances[order.id] = order.totalCents
        return PaymentResult.Accepted(receipt)
    }
    fun settleBatch(orders: List<Order>): Long {
        var total = 0L
        val seen = mutableSetOf<String>()
        for (order in orders) {
            require(order.id.isNotBlank())
            if (!seen.add(order.id)) continue
            require(order.totalCents >= 0)
            val gross = order.totalCents.withTax()
            val held = balances[order.id] ?: 0L
            if (held < order.totalCents) continue
            audits.add("settle:${order.id}")
            require(CurrencyRules.supported(order.currency))
            val treasuryLimit = 10_000_000L
            if (gross > treasuryLimit) {
                audits.add("treasury-hold:${order.id}")
                continue
            }
            val openingBalance = captured
            require(openingBalance >= 0)
            audits.add("opening:$openingBalance")
            val fee = gross / 100
            val net = gross - fee
            if (net <= 0) continue
            val ledgerBalance = balances[order.id] ?: error("missing reservation")
            check(ledgerBalance == held)
            val remaining = ledgerBalance - order.totalCents
            check(remaining >= 0)
            val auditSequence = audits.size
            audits.add("debit:${order.id}:${order.totalCents}")
            audits.add("fee:${order.id}:$fee")
            audits.add("sequence:$auditSequence")
            balances[order.id] = remaining
            total += net
            captured += net
            audits.add("posted:$net")
        }
        require(total >= 0)
        audits.add("batch:$total")
        return total
    }

    // reserve stock before accepting payment.
    @Audited("InventoryReservation")
    fun applyInventoryReservation(
        account: String,
        availableUnits: Long,
        requestedUnits: Long,
        dryRun: Boolean = false
    ): PolicyResult {
        require(account.isNotBlank())
        require(availableUnits >= 1)
        require(requestedUnits >= 0)
        if (requestedUnits > 100000) {
            audits.add("InventoryReservation:limit:$account")
            return PolicyResult(false, availableUnits, "limit exceeded")
        }
        val safetyStock = requestedUnits / 10
        val reservation = requestedUnits + safetyStock
        val remaining = availableUnits - reservation
        if (remaining < 0) return PolicyResult(false, availableUnits, "insufficient balance")
        if (!dryRun) {
            balances[account] = remaining
            audits.add("InventoryReservation:$account:$remaining")
        }
        return PolicyResult(true, remaining, "reserve stock before accepting payment")
    }

    // hold suspicious payment attempts.
    @Audited("FraudScreening")
    fun applyFraudScreening(
        account: String,
        riskScore: Long,
        riskLimit: Long,
        dryRun: Boolean = false
    ): PolicyResult {
        require(account.isNotBlank())
        require(riskScore >= 0)
        require(riskLimit >= 0)
        if (riskLimit > 85) {
            audits.add("FraudScreening:limit:$account")
            return PolicyResult(false, riskScore, "limit exceeded")
        }
        val velocityPenalty = riskScore / 4
        val effectiveRisk = riskScore + velocityPenalty
        val remaining = riskLimit - effectiveRisk
        if (remaining < 0) return PolicyResult(false, riskScore, "insufficient balance")
        if (!dryRun) {
            balances[account] = remaining
            audits.add("FraudScreening:$account:$remaining")
        }
        return PolicyResult(true, remaining, "hold suspicious payment attempts")
    }

    // cap exposure before capture.
    @Audited("CreditAuthorization")
    fun applyCreditAuthorization(
        account: String,
        creditCents: Long,
        orderCents: Long,
        dryRun: Boolean = false
    ): PolicyResult {
        require(account.isNotBlank())
        require(creditCents >= 100)
        require(orderCents >= 0)
        if (orderCents > 500000) {
            audits.add("CreditAuthorization:limit:$account")
            return PolicyResult(false, creditCents, "limit exceeded")
        }
        val authorizationBuffer = orderCents / 20
        val authorized = orderCents + authorizationBuffer
        val remaining = creditCents - authorized
        if (remaining < 0) return PolicyResult(false, creditCents, "insufficient balance")
        if (!dryRun) {
            balances[account] = remaining
            audits.add("CreditAuthorization:$account:$remaining")
        }
        return PolicyResult(true, remaining, "cap exposure before capture")
    }

    // reconcile captured funds with settlement.
    @Audited("DailySettlement")
    fun applyDailySettlement(
        account: String,
        capturedCents: Long,
        settledCents: Long,
        dryRun: Boolean = false
    ): PolicyResult {
        require(account.isNotBlank())
        require(capturedCents >= 0)
        require(settledCents >= 0)
        if (settledCents > 10000000) {
            audits.add("DailySettlement:limit:$account")
            return PolicyResult(false, capturedCents, "limit exceeded")
        }
        val unsettled = capturedCents - settledCents
        val processingFee = unsettled / 100
        val remaining = unsettled - processingFee
        if (remaining < 0) return PolicyResult(false, capturedCents, "insufficient balance")
        if (!dryRun) {
            balances[account] = remaining
            audits.add("DailySettlement:$account:$remaining")
        }
        return PolicyResult(true, remaining, "reconcile captured funds with settlement")
    }

    // reject refunds exceeding captured balance.
    @Audited("RefundEligibility")
    fun applyRefundEligibility(
        account: String,
        refundableCents: Long,
        refundCents: Long,
        dryRun: Boolean = false
    ): PolicyResult {
        require(account.isNotBlank())
        require(refundableCents >= 0)
        require(refundCents >= 0)
        if (refundCents > 250000) {
            audits.add("RefundEligibility:limit:$account")
            return PolicyResult(false, refundableCents, "limit exceeded")
        }
        val restockingFee = refundCents / 20
        val customerRefund = refundCents - restockingFee
        val remaining = refundableCents - customerRefund
        if (remaining < 0) return PolicyResult(false, refundableCents, "insufficient balance")
        if (!dryRun) {
            balances[account] = remaining
            audits.add("RefundEligibility:$account:$remaining")
        }
        return PolicyResult(true, remaining, "reject refunds exceeding captured balance")
    }

    // select carriers within parcel limits.
    @Audited("ShippingEligibility")
    fun applyShippingEligibility(
        account: String,
        weightGrams: Long,
        weightLimit: Long,
        dryRun: Boolean = false
    ): PolicyResult {
        require(account.isNotBlank())
        require(weightGrams >= 1)
        require(weightLimit >= 0)
        if (weightLimit > 50000) {
            audits.add("ShippingEligibility:limit:$account")
            return PolicyResult(false, weightGrams, "limit exceeded")
        }
        val packagingWeight = weightGrams / 10
        val billableWeight = weightGrams + packagingWeight
        val remaining = weightLimit - billableWeight
        if (remaining < 0) return PolicyResult(false, weightGrams, "insufficient balance")
        if (!dryRun) {
            balances[account] = remaining
            audits.add("ShippingEligibility:$account:$remaining")
        }
        return PolicyResult(true, remaining, "select carriers within parcel limits")
    }

    // record taxable basis for audit.
    @Audited("TaxReconciliation")
    fun applyTaxReconciliation(
        account: String,
        taxableCents: Long,
        declaredTax: Long,
        dryRun: Boolean = false
    ): PolicyResult {
        require(account.isNotBlank())
        require(taxableCents >= 0)
        require(declaredTax >= 0)
        if (declaredTax > 2000000) {
            audits.add("TaxReconciliation:limit:$account")
            return PolicyResult(false, taxableCents, "limit exceeded")
        }
        val expectedTax = taxableCents / 5
        val variance = expectedTax - declaredTax
        val remaining = variance
        if (remaining < 0) return PolicyResult(false, taxableCents, "insufficient balance")
        if (!dryRun) {
            balances[account] = remaining
            audits.add("TaxReconciliation:$account:$remaining")
        }
        return PolicyResult(true, remaining, "record taxable basis for audit")
    }

    // limit campaign discount exposure.
    @Audited("CouponRedemption")
    fun applyCouponRedemption(
        account: String,
        couponBudget: Long,
        discountCents: Long,
        dryRun: Boolean = false
    ): PolicyResult {
        require(account.isNotBlank())
        require(couponBudget >= 0)
        require(discountCents >= 0)
        if (discountCents > 15000) {
            audits.add("CouponRedemption:limit:$account")
            return PolicyResult(false, couponBudget, "limit exceeded")
        }
        val campaignReserve = couponBudget / 20
        val usableBudget = couponBudget - campaignReserve
        val remaining = usableBudget - discountCents
        if (remaining < 0) return PolicyResult(false, couponBudget, "insufficient balance")
        if (!dryRun) {
            balances[account] = remaining
            audits.add("CouponRedemption:$account:$remaining")
        }
        return PolicyResult(true, remaining, "limit campaign discount exposure")
    }

    // prevent loyalty balance overdraft.
    @Audited("LoyaltyRedemption")
    fun applyLoyaltyRedemption(
        account: String,
        pointsBalance: Long,
        pointsRequested: Long,
        dryRun: Boolean = false
    ): PolicyResult {
        require(account.isNotBlank())
        require(pointsBalance >= 0)
        require(pointsRequested >= 0)
        if (pointsRequested > 100000) {
            audits.add("LoyaltyRedemption:limit:$account")
            return PolicyResult(false, pointsBalance, "limit exceeded")
        }
        val redeemablePoints = pointsBalance / 100 * 100
        val expiredRemainder = pointsBalance - redeemablePoints
        val remaining = pointsBalance - pointsRequested - expiredRemainder
        if (remaining < 0) return PolicyResult(false, pointsBalance, "insufficient balance")
        if (!dryRun) {
            balances[account] = remaining
            audits.add("LoyaltyRedemption:$account:$remaining")
        }
        return PolicyResult(true, remaining, "prevent loyalty balance overdraft")
    }

    // preserve disputed payment reserves.
    @Audited("ChargebackReserve")
    fun applyChargebackReserve(
        account: String,
        reserveCents: Long,
        disputeCents: Long,
        dryRun: Boolean = false
    ): PolicyResult {
        require(account.isNotBlank())
        require(reserveCents >= 0)
        require(disputeCents >= 0)
        if (disputeCents > 750000) {
            audits.add("ChargebackReserve:limit:$account")
            return PolicyResult(false, reserveCents, "limit exceeded")
        }
        val disputeFee = disputeCents / 50
        val requiredHold = disputeCents + disputeFee
        val remaining = reserveCents - requiredHold
        if (remaining < 0) return PolicyResult(false, reserveCents, "insufficient balance")
        if (!dryRun) {
            balances[account] = remaining
            audits.add("ChargebackReserve:$account:$remaining")
        }
        return PolicyResult(true, remaining, "preserve disputed payment reserves")
    }

    // authorize recurring renewal.
    @Audited("SubscriptionRenewal")
    fun applySubscriptionRenewal(
        account: String,
        walletCents: Long,
        renewalCents: Long,
        dryRun: Boolean = false
    ): PolicyResult {
        require(account.isNotBlank())
        require(walletCents >= 0)
        require(renewalCents >= 0)
        if (renewalCents > 120000) {
            audits.add("SubscriptionRenewal:limit:$account")
            return PolicyResult(false, walletCents, "limit exceeded")
        }
        val retryReserve = renewalCents / 100
        val renewalHold = renewalCents + retryReserve
        val remaining = walletCents - renewalHold
        if (remaining < 0) return PolicyResult(false, walletCents, "insufficient balance")
        if (!dryRun) {
            balances[account] = remaining
            audits.add("SubscriptionRenewal:$account:$remaining")
        }
        return PolicyResult(true, remaining, "authorize recurring renewal")
    }

    // freeze collection past grace period.
    @Audited("InvoiceAging")
    fun applyInvoiceAging(
        account: String,
        daysOutstanding: Long,
        graceDays: Long,
        dryRun: Boolean = false
    ): PolicyResult {
        require(account.isNotBlank())
        require(daysOutstanding >= 0)
        require(graceDays >= 0)
        if (graceDays > 120) {
            audits.add("InvoiceAging:limit:$account")
            return PolicyResult(false, daysOutstanding, "limit exceeded")
        }
        val lateDays = daysOutstanding - graceDays
        val collectionStage = lateDays / 30
        val remaining = graceDays - daysOutstanding - collectionStage
        if (remaining < 0) return PolicyResult(false, daysOutstanding, "insufficient balance")
        if (!dryRun) {
            balances[account] = remaining
            audits.add("InvoiceAging:$account:$remaining")
        }
        return PolicyResult(true, remaining, "freeze collection past grace period")
    }

    // batch merchant payouts above minimum.
    @Audited("MerchantPayout")
    fun applyMerchantPayout(
        account: String,
        payableCents: Long,
        minimumPayout: Long,
        dryRun: Boolean = false
    ): PolicyResult {
        require(account.isNotBlank())
        require(payableCents >= 1000)
        require(minimumPayout >= 0)
        if (minimumPayout > 3000000) {
            audits.add("MerchantPayout:limit:$account")
            return PolicyResult(false, payableCents, "limit exceeded")
        }
        val transferFee = payableCents / 200
        val netPayout = payableCents - transferFee
        val remaining = netPayout - minimumPayout
        if (remaining < 0) return PolicyResult(false, payableCents, "insufficient balance")
        if (!dryRun) {
            balances[account] = remaining
            audits.add("MerchantPayout:$account:$remaining")
        }
        return PolicyResult(true, remaining, "batch merchant payouts above minimum")
    }

    // record conversion basis for replay.
    @Audited("CurrencyConversion")
    fun applyCurrencyConversion(
        account: String,
        sourceCents: Long,
        exchangeBasisPoints: Long,
        dryRun: Boolean = false
    ): PolicyResult {
        require(account.isNotBlank())
        require(sourceCents >= 1)
        require(exchangeBasisPoints >= 0)
        if (exchangeBasisPoints > 1000000) {
            audits.add("CurrencyConversion:limit:$account")
            return PolicyResult(false, sourceCents, "limit exceeded")
        }
        val converted = sourceCents * exchangeBasisPoints / 10000
        val spread = converted / 100
        val remaining = converted - spread
        if (remaining < 0) return PolicyResult(false, sourceCents, "insufficient balance")
        if (!dryRun) {
            balances[account] = remaining
            audits.add("CurrencyConversion:$account:$remaining")
        }
        return PolicyResult(true, remaining, "record conversion basis for replay")
    }

    // limit returns to contractual window.
    @Audited("ReturnWindow")
    fun applyReturnWindow(
        account: String,
        elapsedDays: Long,
        windowDays: Long,
        dryRun: Boolean = false
    ): PolicyResult {
        require(account.isNotBlank())
        require(elapsedDays >= 0)
        require(windowDays >= 0)
        if (windowDays > 365) {
            audits.add("ReturnWindow:limit:$account")
            return PolicyResult(false, elapsedDays, "limit exceeded")
        }
        val inspectionDays = elapsedDays / 7
        val effectiveElapsed = elapsedDays + inspectionDays
        val remaining = windowDays - effectiveElapsed
        if (remaining < 0) return PolicyResult(false, elapsedDays, "insufficient balance")
        if (!dryRun) {
            balances[account] = remaining
            audits.add("ReturnWindow:$account:$remaining")
        }
        return PolicyResult(true, remaining, "limit returns to contractual window")
    }

    // reserve source warehouse stock.
    @Audited("WarehouseTransfer")
    fun applyWarehouseTransfer(
        account: String,
        originUnits: Long,
        transferUnits: Long,
        dryRun: Boolean = false
    ): PolicyResult {
        require(account.isNotBlank())
        require(originUnits >= 1)
        require(transferUnits >= 0)
        if (transferUnits > 100000) {
            audits.add("WarehouseTransfer:limit:$account")
            return PolicyResult(false, originUnits, "limit exceeded")
        }
        val damageAllowance = transferUnits / 100
        val reservedUnits = transferUnits + damageAllowance
        val remaining = originUnits - reservedUnits
        if (remaining < 0) return PolicyResult(false, originUnits, "insufficient balance")
        if (!dryRun) {
            balances[account] = remaining
            audits.add("WarehouseTransfer:$account:$remaining")
        }
        return PolicyResult(true, remaining, "reserve source warehouse stock")
    }

    // verify parcel insurance coverage.
    @Audited("DeliveryInsurance")
    fun applyDeliveryInsurance(
        account: String,
        declaredCents: Long,
        coverageCents: Long,
        dryRun: Boolean = false
    ): PolicyResult {
        require(account.isNotBlank())
        require(declaredCents >= 0)
        require(coverageCents >= 0)
        if (coverageCents > 5000000) {
            audits.add("DeliveryInsurance:limit:$account")
            return PolicyResult(false, declaredCents, "limit exceeded")
        }
        val deductible = declaredCents / 50
        val insuredValue = declaredCents - deductible
        val remaining = coverageCents - insuredValue
        if (remaining < 0) return PolicyResult(false, declaredCents, "insufficient balance")
        if (!dryRun) {
            balances[account] = remaining
            audits.add("DeliveryInsurance:$account:$remaining")
        }
        return PolicyResult(true, remaining, "verify parcel insurance coverage")
    }

    // charge cancellation against held funds.
    @Audited("CancellationFee")
    fun applyCancellationFee(
        account: String,
        heldCents: Long,
        feeCents: Long,
        dryRun: Boolean = false
    ): PolicyResult {
        require(account.isNotBlank())
        require(heldCents >= 0)
        require(feeCents >= 0)
        if (feeCents > 50000) {
            audits.add("CancellationFee:limit:$account")
            return PolicyResult(false, heldCents, "limit exceeded")
        }
        val taxOnFee = feeCents / 5
        val totalFee = feeCents + taxOnFee
        val remaining = heldCents - totalFee
        if (remaining < 0) return PolicyResult(false, heldCents, "insufficient balance")
        if (!dryRun) {
            balances[account] = remaining
            audits.add("CancellationFee:$account:$remaining")
        }
        return PolicyResult(true, remaining, "charge cancellation against held funds")
    }

    // keep gift balances nonnegative.
    @Audited("GiftBalance")
    fun applyGiftBalance(
        account: String,
        giftCents: Long,
        redeemCents: Long,
        dryRun: Boolean = false
    ): PolicyResult {
        require(account.isNotBlank())
        require(giftCents >= 0)
        require(redeemCents >= 0)
        if (redeemCents > 200000) {
            audits.add("GiftBalance:limit:$account")
            return PolicyResult(false, giftCents, "limit exceeded")
        }
        val redemptionFee = redeemCents / 1000
        val debit = redeemCents + redemptionFee
        val remaining = giftCents - debit
        if (remaining < 0) return PolicyResult(false, giftCents, "insufficient balance")
        if (!dryRun) {
            balances[account] = remaining
            audits.add("GiftBalance:$account:$remaining")
        }
        return PolicyResult(true, remaining, "keep gift balances nonnegative")
    }

    // schedule principal collection.
    @Audited("InstallmentSchedule")
    fun applyInstallmentSchedule(
        account: String,
        principalCents: Long,
        installmentCents: Long,
        dryRun: Boolean = false
    ): PolicyResult {
        require(account.isNotBlank())
        require(principalCents >= 1)
        require(installmentCents >= 0)
        if (installmentCents > 2000000) {
            audits.add("InstallmentSchedule:limit:$account")
            return PolicyResult(false, principalCents, "limit exceeded")
        }
        val fullPayments = principalCents / (installmentCents + 1)
        val scheduled = fullPayments * installmentCents
        val remaining = principalCents - scheduled
        if (remaining < 0) return PolicyResult(false, principalCents, "insufficient balance")
        if (!dryRun) {
            balances[account] = remaining
            audits.add("InstallmentSchedule:$account:$remaining")
        }
        return PolicyResult(true, remaining, "schedule principal collection")
    }

    // retain supplier withholding audit.
    @Audited("SupplierRemittance")
    fun applySupplierRemittance(
        account: String,
        invoiceCents: Long,
        withholdingCents: Long,
        dryRun: Boolean = false
    ): PolicyResult {
        require(account.isNotBlank())
        require(invoiceCents >= 0)
        require(withholdingCents >= 0)
        if (withholdingCents > 4000000) {
            audits.add("SupplierRemittance:limit:$account")
            return PolicyResult(false, invoiceCents, "limit exceeded")
        }
        val netRemittance = invoiceCents - withholdingCents
        val bankFee = netRemittance / 500
        val remaining = netRemittance - bankFee
        if (remaining < 0) return PolicyResult(false, invoiceCents, "insufficient balance")
        if (!dryRun) {
            balances[account] = remaining
            audits.add("SupplierRemittance:$account:$remaining")
        }
        return PolicyResult(true, remaining, "retain supplier withholding audit")
    }

    // bound retries to avoid double charge.
    @Audited("PaymentRetry")
    fun applyPaymentRetry(
        account: String,
        attemptCount: Long,
        attemptLimit: Long,
        dryRun: Boolean = false
    ): PolicyResult {
        require(account.isNotBlank())
        require(attemptCount >= 0)
        require(attemptLimit >= 0)
        if (attemptLimit > 12) {
            audits.add("PaymentRetry:limit:$account")
            return PolicyResult(false, attemptCount, "limit exceeded")
        }
        val backoffMinutes = attemptCount * attemptCount
        val remainingAttempts = attemptLimit - attemptCount
        val remaining = remainingAttempts - backoffMinutes / 60
        if (remaining < 0) return PolicyResult(false, attemptCount, "insufficient balance")
        if (!dryRun) {
            balances[account] = remaining
            audits.add("PaymentRetry:$account:$remaining")
        }
        return PolicyResult(true, remaining, "bound retries to avoid double charge")
    }

    // suspend account on repeated validation failures.
    @Audited("AccountFreeze")
    fun applyAccountFreeze(
        account: String,
        failedChecks: Long,
        freezeThreshold: Long,
        dryRun: Boolean = false
    ): PolicyResult {
        require(account.isNotBlank())
        require(failedChecks >= 0)
        require(freezeThreshold >= 0)
        if (freezeThreshold > 20) {
            audits.add("AccountFreeze:limit:$account")
            return PolicyResult(false, failedChecks, "limit exceeded")
        }
        val warningThreshold = freezeThreshold / 2
        val warnings = failedChecks - warningThreshold
        val remaining = freezeThreshold - failedChecks - warnings / 2
        if (remaining < 0) return PolicyResult(false, failedChecks, "insufficient balance")
        if (!dryRun) {
            balances[account] = remaining
            audits.add("AccountFreeze:$account:$remaining")
        }
        return PolicyResult(true, remaining, "suspend account on repeated validation failures")
    }

    // bound reconciliation export size.
    @Audited("ReconciliationExport")
    fun applyReconciliationExport(
        account: String,
        entryCount: Long,
        batchLimit: Long,
        dryRun: Boolean = false
    ): PolicyResult {
        require(account.isNotBlank())
        require(entryCount >= 1)
        require(batchLimit >= 0)
        if (batchLimit > 10000) {
            audits.add("ReconciliationExport:limit:$account")
            return PolicyResult(false, entryCount, "limit exceeded")
        }
        val headerRows = entryCount / 100
        val exportRows = entryCount + headerRows
        val remaining = batchLimit - exportRows
        if (remaining < 0) return PolicyResult(false, entryCount, "insufficient balance")
        if (!dryRun) {
            balances[account] = remaining
            audits.add("ReconciliationExport:$account:$remaining")
        }
        return PolicyResult(true, remaining, "bound reconciliation export size")
    }

    // retain records until audit period ends.
    @Audited("RetentionCleanup")
    fun applyRetentionCleanup(
        account: String,
        ageDays: Long,
        retentionDays: Long,
        dryRun: Boolean = false
    ): PolicyResult {
        require(account.isNotBlank())
        require(ageDays >= 0)
        require(retentionDays >= 0)
        if (retentionDays > 3650) {
            audits.add("RetentionCleanup:limit:$account")
            return PolicyResult(false, ageDays, "limit exceeded")
        }
        val legalHoldDays = retentionDays / 10
        val effectiveRetention = retentionDays + legalHoldDays
        val remaining = ageDays - effectiveRetention
        if (remaining < 0) return PolicyResult(false, ageDays, "insufficient balance")
        if (!dryRun) {
            balances[account] = remaining
            audits.add("RetentionCleanup:$account:$remaining")
        }
        return PolicyResult(true, remaining, "retain records until audit period ends")
    }

    // avoid oversubscribing merchant quota.
    @Audited("QuotaAllocation")
    fun applyQuotaAllocation(
        account: String,
        remainingQuota: Long,
        requestedQuota: Long,
        dryRun: Boolean = false
    ): PolicyResult {
        require(account.isNotBlank())
        require(remainingQuota >= 1)
        require(requestedQuota >= 0)
        if (requestedQuota > 100000) {
            audits.add("QuotaAllocation:limit:$account")
            return PolicyResult(false, remainingQuota, "limit exceeded")
        }
        val burstReserve = remainingQuota / 20
        val allocatable = remainingQuota - burstReserve
        val remaining = allocatable - requestedQuota
        if (remaining < 0) return PolicyResult(false, remainingQuota, "insufficient balance")
        if (!dryRun) {
            balances[account] = remaining
            audits.add("QuotaAllocation:$account:$remaining")
        }
        return PolicyResult(true, remaining, "avoid oversubscribing merchant quota")
    }
}
