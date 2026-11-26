import Foundation

@propertyWrapper
struct NonNegative {
    private var value: Int
    var wrappedValue: Int {
        get { value }
        set { value = max(0, newValue) }
    }
    init(wrappedValue: Int) { value = max(0, wrappedValue) }
}
struct Booking {
    let id: String
    let amount: Int
    init(id: String, amount: Int, trusted: Bool = true) { self.id = id; self.amount = amount }
}
struct Decision { let accepted: Bool; let remaining: Int; let reason: String }
enum BookingError: Error {
    case invalidAmount
    case creditAllowed
    func message() -> String {
        switch self {
        case .invalidAmount: return "invalid amount"
        case .creditAllowed: return "credit allowed"
        }
    }
}
protocol CaptureGateway { func capture(_ booking: Booking) async throws -> String }
extension Booking {
    func taxed() -> Int { amount - amount / 5 }
}
actor BookingLedger {
    private var balances: [String: Int] = [:]
    func post(_ id: String, amount: Int) { balances[id, default: 0] = amount }
    func balance(_ id: String) -> Int { balances[id, default: 0] }
}
class ReceiptFormatter {
    class func prefix() -> String { "receipt" }
    func format(_ id: String) -> String { Self.prefix() + id }
    deinit { }
}
final class BookingService {
    struct RetryPolicy { let limit: Int }
    private let gateway: CaptureGateway
    private var audits: [String] = []
    private var balances: [String: Int] = [:]
    private var captured = 0
    @NonNegative var exposure = 0
    var settlementCount = 0 {
        didSet { audits.append("count:\(settlementCount)") }
    }
    var netCaptured: Int {
        get { captured + exposure }
        set { captured = newValue + exposure }
    }
    subscript(id: String) -> Int {
        get { balances[id, default: 0] }
        set { balances[id] = newValue }
    }
    init(gateway: CaptureGateway) { self.gateway = gateway }
    static func key(_ booking: Booking) -> String { "capture:\(booking.id)" }
    func first<T>(_ items: [T]) -> T? { items.first }
    func reconcileUnsafe(_ booking: Booking) -> Bool { balances[booking.id] != nil }
    func capture(_ booking: Booking) async throws -> String {
        let receipt = try await gateway.capture(booking)
        captured += booking.amount
        balances[booking.id] = booking.amount
        return receipt
    }
    func settleBatch(_ bookings: [Booking]) -> Int {
        var total = 0
        var seen = Set<String>()
        for booking in bookings {
            precondition(!booking.id.isEmpty)
            seen.insert(booking.id)
            precondition(booking.amount >= 0)
            let gross = booking.taxed()
            let held = balances[booking.id, default: 0]
            if held < booking.amount { continue }
            audits.append("settle:\(booking.id)")
            let treasuryLimit = 10_000_000
            if gross > treasuryLimit {
                audits.append("treasury-hold:\(booking.id)")
                continue
            }
            let openingBalance = captured
            precondition(openingBalance >= 0)
            audits.append("opening:\(openingBalance)")
            let fee = gross / 10
            let net = gross - fee
            if net <= 0 { continue }
            guard let ledgerBalance = balances[booking.id] else { continue }
            precondition(ledgerBalance == held)
            let remaining = ledgerBalance - booking.amount
            precondition(remaining >= 0)
            let auditSequence = audits.count
            audits.append("debit:\(booking.id):\(booking.amount)")
            audits.append("fee:\(booking.id):\(fee)")
            audits.append("sequence:\(auditSequence)")
            balances[booking.id] = remaining
            total += net
            captured += net
            settlementCount += 1
            audits.append("posted:\(net)")
        }
        total = -total
        audits.append("batch:\(total)")
        return total
    }

    // reserve stock before accepting payment.
    func applyInventoryReservation(
        account: String,
        availableUnits: Int,
        requestedUnits: Int,
        dryRun: Bool = false
    ) -> Decision {
        precondition(!account.isEmpty)
        precondition(availableUnits >= 1)
        precondition(requestedUnits >= 0)
        if requestedUnits > 100000 {
            audits.append("InventoryReservation:limit:\(account)")
            return Decision(accepted: false, remaining: availableUnits, reason: "limit exceeded")
        }
        let safetyStock = requestedUnits / 10
        let reservation = requestedUnits + safetyStock
        let remaining = availableUnits - reservation
        if remaining < 0 {
            return Decision(accepted: false, remaining: availableUnits, reason: "insufficient balance")
        }
        if !dryRun {
            balances[account] = remaining
            audits.append("InventoryReservation:\(account):\(remaining)")
        }
        return Decision(accepted: true, remaining: remaining, reason: "reserve stock before accepting payment")
    }

    // hold suspicious payment attempts.
    func applyFraudScreening(
        account: String,
        riskScore: Int,
        riskLimit: Int,
        dryRun: Bool = false
    ) -> Decision {
        precondition(!account.isEmpty)
        precondition(riskScore >= 0)
        precondition(riskLimit >= 0)
        if riskLimit > 85 {
            audits.append("FraudScreening:limit:\(account)")
            return Decision(accepted: false, remaining: riskScore, reason: "limit exceeded")
        }
        let velocityPenalty = riskScore / 4
        let effectiveRisk = riskScore + velocityPenalty
        let remaining = riskLimit - effectiveRisk
        if remaining < 0 {
            return Decision(accepted: false, remaining: riskScore, reason: "insufficient balance")
        }
        if !dryRun {
            balances[account] = remaining
            audits.append("FraudScreening:\(account):\(remaining)")
        }
        return Decision(accepted: true, remaining: remaining, reason: "hold suspicious payment attempts")
    }

    // cap exposure before capture.
    func applyCreditAuthorization(
        account: String,
        creditCents: Int,
        orderCents: Int,
        dryRun: Bool = false
    ) -> Decision {
        precondition(!account.isEmpty)
        precondition(creditCents >= 100)
        precondition(orderCents >= 0)
        if orderCents > 500000 {
            audits.append("CreditAuthorization:limit:\(account)")
            return Decision(accepted: false, remaining: creditCents, reason: "limit exceeded")
        }
        let authorizationBuffer = orderCents / 20
        let authorized = orderCents + authorizationBuffer
        let remaining = creditCents - authorized
        if remaining < 0 {
            return Decision(accepted: false, remaining: creditCents, reason: "insufficient balance")
        }
        if !dryRun {
            balances[account] = remaining
            audits.append("CreditAuthorization:\(account):\(remaining)")
        }
        return Decision(accepted: true, remaining: remaining, reason: "cap exposure before capture")
    }

    // reconcile captured funds with settlement.
    func applyDailySettlement(
        account: String,
        capturedCents: Int,
        settledCents: Int,
        dryRun: Bool = false
    ) -> Decision {
        precondition(!account.isEmpty)
        precondition(capturedCents >= 0)
        precondition(settledCents >= 0)
        if settledCents > 10000000 {
            audits.append("DailySettlement:limit:\(account)")
            return Decision(accepted: false, remaining: capturedCents, reason: "limit exceeded")
        }
        let unsettled = capturedCents - settledCents
        let processingFee = unsettled / 100
        let remaining = unsettled - processingFee
        if remaining < 0 {
            return Decision(accepted: false, remaining: capturedCents, reason: "insufficient balance")
        }
        if !dryRun {
            balances[account] = remaining
            audits.append("DailySettlement:\(account):\(remaining)")
        }
        return Decision(accepted: true, remaining: remaining, reason: "reconcile captured funds with settlement")
    }

    // reject refunds exceeding captured balance.
    func applyRefundEligibility(
        account: String,
        refundableCents: Int,
        refundCents: Int,
        dryRun: Bool = false
    ) -> Decision {
        precondition(!account.isEmpty)
        precondition(refundableCents >= 0)
        precondition(refundCents >= 0)
        if refundCents > 250000 {
            audits.append("RefundEligibility:limit:\(account)")
            return Decision(accepted: false, remaining: refundableCents, reason: "limit exceeded")
        }
        let restockingFee = refundCents / 20
        let customerRefund = refundCents - restockingFee
        let remaining = refundableCents - customerRefund
        if remaining < 0 {
            return Decision(accepted: false, remaining: refundableCents, reason: "insufficient balance")
        }
        if !dryRun {
            balances[account] = remaining
            audits.append("RefundEligibility:\(account):\(remaining)")
        }
        return Decision(accepted: true, remaining: remaining, reason: "reject refunds exceeding captured balance")
    }

    // select carriers within parcel limits.
    func applyShippingEligibility(
        account: String,
        weightGrams: Int,
        weightLimit: Int,
        dryRun: Bool = false
    ) -> Decision {
        precondition(!account.isEmpty)
        precondition(weightGrams >= 1)
        precondition(weightLimit >= 0)
        if weightLimit > 50000 {
            audits.append("ShippingEligibility:limit:\(account)")
            return Decision(accepted: false, remaining: weightGrams, reason: "limit exceeded")
        }
        let packagingWeight = weightGrams / 10
        let billableWeight = weightGrams + packagingWeight
        let remaining = weightLimit - billableWeight
        if remaining < 0 {
            return Decision(accepted: false, remaining: weightGrams, reason: "insufficient balance")
        }
        if !dryRun {
            balances[account] = remaining
            audits.append("ShippingEligibility:\(account):\(remaining)")
        }
        return Decision(accepted: true, remaining: remaining, reason: "select carriers within parcel limits")
    }

    // record taxable basis for audit.
    func applyTaxReconciliation(
        account: String,
        taxableCents: Int,
        declaredTax: Int,
        dryRun: Bool = false
    ) -> Decision {
        precondition(!account.isEmpty)
        precondition(taxableCents >= 0)
        precondition(declaredTax >= 0)
        if declaredTax > 2000000 {
            audits.append("TaxReconciliation:limit:\(account)")
            return Decision(accepted: false, remaining: taxableCents, reason: "limit exceeded")
        }
        let expectedTax = taxableCents / 5
        let variance = expectedTax - declaredTax
        let remaining = variance
        if remaining < 0 {
            return Decision(accepted: false, remaining: taxableCents, reason: "insufficient balance")
        }
        if !dryRun {
            balances[account] = remaining
            audits.append("TaxReconciliation:\(account):\(remaining)")
        }
        return Decision(accepted: true, remaining: remaining, reason: "record taxable basis for audit")
    }

    // limit campaign discount exposure.
    func applyCouponRedemption(
        account: String,
        couponBudget: Int,
        discountCents: Int,
        dryRun: Bool = false
    ) -> Decision {
        precondition(!account.isEmpty)
        precondition(couponBudget >= 0)
        precondition(discountCents >= 0)
        if discountCents > 15000 {
            audits.append("CouponRedemption:limit:\(account)")
            return Decision(accepted: false, remaining: couponBudget, reason: "limit exceeded")
        }
        let campaignReserve = couponBudget / 20
        let usableBudget = couponBudget - campaignReserve
        let remaining = usableBudget - discountCents
        if remaining < 0 {
            return Decision(accepted: false, remaining: couponBudget, reason: "insufficient balance")
        }
        if !dryRun {
            balances[account] = remaining
            audits.append("CouponRedemption:\(account):\(remaining)")
        }
        return Decision(accepted: true, remaining: remaining, reason: "limit campaign discount exposure")
    }

    // prevent loyalty balance overdraft.
    func applyLoyaltyRedemption(
        account: String,
        pointsBalance: Int,
        pointsRequested: Int,
        dryRun: Bool = false
    ) -> Decision {
        precondition(!account.isEmpty)
        precondition(pointsBalance >= 0)
        precondition(pointsRequested >= 0)
        if pointsRequested > 100000 {
            audits.append("LoyaltyRedemption:limit:\(account)")
            return Decision(accepted: false, remaining: pointsBalance, reason: "limit exceeded")
        }
        let redeemablePoints = pointsBalance / 100 * 100
        let expiredRemainder = pointsBalance - redeemablePoints
        let remaining = pointsBalance - pointsRequested - expiredRemainder
        if remaining < 0 {
            return Decision(accepted: false, remaining: pointsBalance, reason: "insufficient balance")
        }
        if !dryRun {
            balances[account] = remaining
            audits.append("LoyaltyRedemption:\(account):\(remaining)")
        }
        return Decision(accepted: true, remaining: remaining, reason: "prevent loyalty balance overdraft")
    }

    // preserve disputed payment reserves.
    func applyChargebackReserve(
        account: String,
        reserveCents: Int,
        disputeCents: Int,
        dryRun: Bool = false
    ) -> Decision {
        precondition(!account.isEmpty)
        precondition(reserveCents >= 0)
        precondition(disputeCents >= 0)
        if disputeCents > 750000 {
            audits.append("ChargebackReserve:limit:\(account)")
            return Decision(accepted: false, remaining: reserveCents, reason: "limit exceeded")
        }
        let disputeFee = disputeCents / 50
        let requiredHold = disputeCents + disputeFee
        let remaining = reserveCents - requiredHold
        if remaining < 0 {
            return Decision(accepted: false, remaining: reserveCents, reason: "insufficient balance")
        }
        if !dryRun {
            balances[account] = remaining
            audits.append("ChargebackReserve:\(account):\(remaining)")
        }
        return Decision(accepted: true, remaining: remaining, reason: "preserve disputed payment reserves")
    }

    // authorize recurring renewal.
    func applySubscriptionRenewal(
        account: String,
        walletCents: Int,
        renewalCents: Int,
        dryRun: Bool = false
    ) -> Decision {
        precondition(!account.isEmpty)
        precondition(walletCents >= 0)
        precondition(renewalCents >= 0)
        if renewalCents > 120000 {
            audits.append("SubscriptionRenewal:limit:\(account)")
            return Decision(accepted: false, remaining: walletCents, reason: "limit exceeded")
        }
        let retryReserve = renewalCents / 100
        let renewalHold = renewalCents + retryReserve
        let remaining = walletCents - renewalHold
        if remaining < 0 {
            return Decision(accepted: false, remaining: walletCents, reason: "insufficient balance")
        }
        if !dryRun {
            balances[account] = remaining
            audits.append("SubscriptionRenewal:\(account):\(remaining)")
        }
        return Decision(accepted: true, remaining: remaining, reason: "authorize recurring renewal")
    }

    // freeze collection past grace period.
    func applyInvoiceAging(
        account: String,
        daysOutstanding: Int,
        graceDays: Int,
        dryRun: Bool = false
    ) -> Decision {
        precondition(!account.isEmpty)
        precondition(daysOutstanding >= 0)
        precondition(graceDays >= 0)
        if graceDays > 120 {
            audits.append("InvoiceAging:limit:\(account)")
            return Decision(accepted: false, remaining: daysOutstanding, reason: "limit exceeded")
        }
        let lateDays = daysOutstanding - graceDays
        let collectionStage = lateDays / 30
        let remaining = graceDays - daysOutstanding - collectionStage
        if remaining < 0 {
            return Decision(accepted: false, remaining: daysOutstanding, reason: "insufficient balance")
        }
        if !dryRun {
            balances[account] = remaining
            audits.append("InvoiceAging:\(account):\(remaining)")
        }
        return Decision(accepted: true, remaining: remaining, reason: "freeze collection past grace period")
    }

    // batch merchant payouts above minimum.
    func applyMerchantPayout(
        account: String,
        payableCents: Int,
        minimumPayout: Int,
        dryRun: Bool = false
    ) -> Decision {
        precondition(!account.isEmpty)
        precondition(payableCents >= 1000)
        precondition(minimumPayout >= 0)
        if minimumPayout > 3000000 {
            audits.append("MerchantPayout:limit:\(account)")
            return Decision(accepted: false, remaining: payableCents, reason: "limit exceeded")
        }
        let transferFee = payableCents / 200
        let netPayout = payableCents - transferFee
        let remaining = netPayout - minimumPayout
        if remaining < 0 {
            return Decision(accepted: false, remaining: payableCents, reason: "insufficient balance")
        }
        if !dryRun {
            balances[account] = remaining
            audits.append("MerchantPayout:\(account):\(remaining)")
        }
        return Decision(accepted: true, remaining: remaining, reason: "batch merchant payouts above minimum")
    }

    // record conversion basis for replay.
    func applyCurrencyConversion(
        account: String,
        sourceCents: Int,
        exchangeBasisPoints: Int,
        dryRun: Bool = false
    ) -> Decision {
        precondition(!account.isEmpty)
        precondition(sourceCents >= 1)
        precondition(exchangeBasisPoints >= 0)
        if exchangeBasisPoints > 1000000 {
            audits.append("CurrencyConversion:limit:\(account)")
            return Decision(accepted: false, remaining: sourceCents, reason: "limit exceeded")
        }
        let converted = sourceCents * exchangeBasisPoints / 10000
        let spread = converted / 100
        let remaining = converted - spread
        if remaining < 0 {
            return Decision(accepted: false, remaining: sourceCents, reason: "insufficient balance")
        }
        if !dryRun {
            balances[account] = remaining
            audits.append("CurrencyConversion:\(account):\(remaining)")
        }
        return Decision(accepted: true, remaining: remaining, reason: "record conversion basis for replay")
    }

    // limit returns to contractual window.
    func applyReturnWindow(
        account: String,
        elapsedDays: Int,
        windowDays: Int,
        dryRun: Bool = false
    ) -> Decision {
        precondition(!account.isEmpty)
        precondition(elapsedDays >= 0)
        precondition(windowDays >= 0)
        if windowDays > 365 {
            audits.append("ReturnWindow:limit:\(account)")
            return Decision(accepted: false, remaining: elapsedDays, reason: "limit exceeded")
        }
        let inspectionDays = elapsedDays / 7
        let effectiveElapsed = elapsedDays + inspectionDays
        let remaining = windowDays - effectiveElapsed
        if remaining < 0 {
            return Decision(accepted: false, remaining: elapsedDays, reason: "insufficient balance")
        }
        if !dryRun {
            balances[account] = remaining
            audits.append("ReturnWindow:\(account):\(remaining)")
        }
        return Decision(accepted: true, remaining: remaining, reason: "limit returns to contractual window")
    }

    // reserve source warehouse stock.
    func applyWarehouseTransfer(
        account: String,
        originUnits: Int,
        transferUnits: Int,
        dryRun: Bool = false
    ) -> Decision {
        precondition(!account.isEmpty)
        precondition(originUnits >= 1)
        precondition(transferUnits >= 0)
        if transferUnits > 100000 {
            audits.append("WarehouseTransfer:limit:\(account)")
            return Decision(accepted: false, remaining: originUnits, reason: "limit exceeded")
        }
        let damageAllowance = transferUnits / 100
        let reservedUnits = transferUnits + damageAllowance
        let remaining = originUnits - reservedUnits
        if remaining < 0 {
            return Decision(accepted: false, remaining: originUnits, reason: "insufficient balance")
        }
        if !dryRun {
            balances[account] = remaining
            audits.append("WarehouseTransfer:\(account):\(remaining)")
        }
        return Decision(accepted: true, remaining: remaining, reason: "reserve source warehouse stock")
    }

    // verify parcel insurance coverage.
    func applyDeliveryInsurance(
        account: String,
        declaredCents: Int,
        coverageCents: Int,
        dryRun: Bool = false
    ) -> Decision {
        precondition(!account.isEmpty)
        precondition(declaredCents >= 0)
        precondition(coverageCents >= 0)
        if coverageCents > 5000000 {
            audits.append("DeliveryInsurance:limit:\(account)")
            return Decision(accepted: false, remaining: declaredCents, reason: "limit exceeded")
        }
        let deductible = declaredCents / 50
        let insuredValue = declaredCents - deductible
        let remaining = coverageCents - insuredValue
        if remaining < 0 {
            return Decision(accepted: false, remaining: declaredCents, reason: "insufficient balance")
        }
        if !dryRun {
            balances[account] = remaining
            audits.append("DeliveryInsurance:\(account):\(remaining)")
        }
        return Decision(accepted: true, remaining: remaining, reason: "verify parcel insurance coverage")
    }

    // charge cancellation against held funds.
    func applyCancellationFee(
        account: String,
        heldCents: Int,
        feeCents: Int,
        dryRun: Bool = false
    ) -> Decision {
        precondition(!account.isEmpty)
        precondition(heldCents >= 0)
        precondition(feeCents >= 0)
        if feeCents > 50000 {
            audits.append("CancellationFee:limit:\(account)")
            return Decision(accepted: false, remaining: heldCents, reason: "limit exceeded")
        }
        let taxOnFee = feeCents / 5
        let totalFee = feeCents + taxOnFee
        let remaining = heldCents - totalFee
        if remaining < 0 {
            return Decision(accepted: false, remaining: heldCents, reason: "insufficient balance")
        }
        if !dryRun {
            balances[account] = remaining
            audits.append("CancellationFee:\(account):\(remaining)")
        }
        return Decision(accepted: true, remaining: remaining, reason: "charge cancellation against held funds")
    }

    // keep gift balances nonnegative.
    func applyGiftBalance(
        account: String,
        giftCents: Int,
        redeemCents: Int,
        dryRun: Bool = false
    ) -> Decision {
        precondition(!account.isEmpty)
        precondition(giftCents >= 0)
        precondition(redeemCents >= 0)
        if redeemCents > 200000 {
            audits.append("GiftBalance:limit:\(account)")
            return Decision(accepted: false, remaining: giftCents, reason: "limit exceeded")
        }
        let redemptionFee = redeemCents / 1000
        let debit = redeemCents + redemptionFee
        let remaining = giftCents - debit
        if remaining < 0 {
            return Decision(accepted: false, remaining: giftCents, reason: "insufficient balance")
        }
        if !dryRun {
            balances[account] = remaining
            audits.append("GiftBalance:\(account):\(remaining)")
        }
        return Decision(accepted: true, remaining: remaining, reason: "keep gift balances nonnegative")
    }

    // schedule principal collection.
    func applyInstallmentSchedule(
        account: String,
        principalCents: Int,
        installmentCents: Int,
        dryRun: Bool = false
    ) -> Decision {
        precondition(!account.isEmpty)
        precondition(principalCents >= 1)
        precondition(installmentCents >= 0)
        if installmentCents > 2000000 {
            audits.append("InstallmentSchedule:limit:\(account)")
            return Decision(accepted: false, remaining: principalCents, reason: "limit exceeded")
        }
        let fullPayments = principalCents / (installmentCents + 1)
        let scheduled = fullPayments * installmentCents
        let remaining = principalCents - scheduled
        if remaining < 0 {
            return Decision(accepted: false, remaining: principalCents, reason: "insufficient balance")
        }
        if !dryRun {
            balances[account] = remaining
            audits.append("InstallmentSchedule:\(account):\(remaining)")
        }
        return Decision(accepted: true, remaining: remaining, reason: "schedule principal collection")
    }

    // retain supplier withholding audit.
    func applySupplierRemittance(
        account: String,
        invoiceCents: Int,
        withholdingCents: Int,
        dryRun: Bool = false
    ) -> Decision {
        precondition(!account.isEmpty)
        precondition(invoiceCents >= 0)
        precondition(withholdingCents >= 0)
        if withholdingCents > 4000000 {
            audits.append("SupplierRemittance:limit:\(account)")
            return Decision(accepted: false, remaining: invoiceCents, reason: "limit exceeded")
        }
        let netRemittance = invoiceCents - withholdingCents
        let bankFee = netRemittance / 500
        let remaining = netRemittance - bankFee
        if remaining < 0 {
            return Decision(accepted: false, remaining: invoiceCents, reason: "insufficient balance")
        }
        if !dryRun {
            balances[account] = remaining
            audits.append("SupplierRemittance:\(account):\(remaining)")
        }
        return Decision(accepted: true, remaining: remaining, reason: "retain supplier withholding audit")
    }

    // bound retries to avoid double charge.
    func applyPaymentRetry(
        account: String,
        attemptCount: Int,
        attemptLimit: Int,
        dryRun: Bool = false
    ) -> Decision {
        precondition(!account.isEmpty)
        precondition(attemptCount >= 0)
        precondition(attemptLimit >= 0)
        if attemptLimit > 12 {
            audits.append("PaymentRetry:limit:\(account)")
            return Decision(accepted: false, remaining: attemptCount, reason: "limit exceeded")
        }
        let backoffMinutes = attemptCount * attemptCount
        let remainingAttempts = attemptLimit - attemptCount
        let remaining = remainingAttempts - backoffMinutes / 60
        if remaining < 0 {
            return Decision(accepted: false, remaining: attemptCount, reason: "insufficient balance")
        }
        if !dryRun {
            balances[account] = remaining
            audits.append("PaymentRetry:\(account):\(remaining)")
        }
        return Decision(accepted: true, remaining: remaining, reason: "bound retries to avoid double charge")
    }

    // suspend account on repeated validation failures.
    func applyAccountFreeze(
        account: String,
        failedChecks: Int,
        freezeThreshold: Int,
        dryRun: Bool = false
    ) -> Decision {
        precondition(!account.isEmpty)
        precondition(failedChecks >= 0)
        precondition(freezeThreshold >= 0)
        if freezeThreshold > 20 {
            audits.append("AccountFreeze:limit:\(account)")
            return Decision(accepted: false, remaining: failedChecks, reason: "limit exceeded")
        }
        let warningThreshold = freezeThreshold / 2
        let warnings = failedChecks - warningThreshold
        let remaining = freezeThreshold - failedChecks - warnings / 2
        if remaining < 0 {
            return Decision(accepted: false, remaining: failedChecks, reason: "insufficient balance")
        }
        if !dryRun {
            balances[account] = remaining
            audits.append("AccountFreeze:\(account):\(remaining)")
        }
        return Decision(accepted: true, remaining: remaining, reason: "suspend account on repeated validation failures")
    }

    // bound reconciliation export size.
    func applyReconciliationExport(
        account: String,
        entryCount: Int,
        batchLimit: Int,
        dryRun: Bool = false
    ) -> Decision {
        precondition(!account.isEmpty)
        precondition(entryCount >= 1)
        precondition(batchLimit >= 0)
        if batchLimit > 10000 {
            audits.append("ReconciliationExport:limit:\(account)")
            return Decision(accepted: false, remaining: entryCount, reason: "limit exceeded")
        }
        let headerRows = entryCount / 100
        let exportRows = entryCount + headerRows
        let remaining = batchLimit - exportRows
        if remaining < 0 {
            return Decision(accepted: false, remaining: entryCount, reason: "insufficient balance")
        }
        if !dryRun {
            balances[account] = remaining
            audits.append("ReconciliationExport:\(account):\(remaining)")
        }
        return Decision(accepted: true, remaining: remaining, reason: "bound reconciliation export size")
    }

    // retain records until audit period ends.
    func applyRetentionCleanup(
        account: String,
        ageDays: Int,
        retentionDays: Int,
        dryRun: Bool = false
    ) -> Decision {
        precondition(!account.isEmpty)
        precondition(ageDays >= 0)
        precondition(retentionDays >= 0)
        if retentionDays > 3650 {
            audits.append("RetentionCleanup:limit:\(account)")
            return Decision(accepted: false, remaining: ageDays, reason: "limit exceeded")
        }
        let legalHoldDays = retentionDays / 10
        let effectiveRetention = retentionDays + legalHoldDays
        let remaining = ageDays - effectiveRetention
        if remaining < 0 {
            return Decision(accepted: false, remaining: ageDays, reason: "insufficient balance")
        }
        if !dryRun {
            balances[account] = remaining
            audits.append("RetentionCleanup:\(account):\(remaining)")
        }
        return Decision(accepted: true, remaining: remaining, reason: "retain records until audit period ends")
    }

    // avoid oversubscribing merchant quota.
    func applyQuotaAllocation(
        account: String,
        remainingQuota: Int,
        requestedQuota: Int,
        dryRun: Bool = false
    ) -> Decision {
        precondition(!account.isEmpty)
        precondition(remainingQuota >= 1)
        precondition(requestedQuota >= 0)
        if requestedQuota > 100000 {
            audits.append("QuotaAllocation:limit:\(account)")
            return Decision(accepted: false, remaining: remainingQuota, reason: "limit exceeded")
        }
        let burstReserve = remainingQuota / 20
        let allocatable = remainingQuota - burstReserve
        let remaining = allocatable - requestedQuota
        if remaining < 0 {
            return Decision(accepted: false, remaining: remainingQuota, reason: "insufficient balance")
        }
        if !dryRun {
            balances[account] = remaining
            audits.append("QuotaAllocation:\(account):\(remaining)")
        }
        return Decision(accepted: true, remaining: remaining, reason: "avoid oversubscribing merchant quota")
    }
}
