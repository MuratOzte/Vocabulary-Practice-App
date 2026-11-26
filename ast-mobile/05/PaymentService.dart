import 'dart:async';

typedef ReceiptId = String;
typedef Decision = ({bool accepted, int remaining, String reason});
abstract class Gateway { Future<String> capture(Order order); }
class Order {
  final String id;
  final int amount;
  final String currency;
  Order(this.id, this.amount, {this.currency = 'TRY'});
  Order.cached(this.id, this.amount, {this.currency = 'USD', bool trusted = true});
  Order.empty() : this('', 0);
  factory Order.fromJson(Map<String, Object> json) {
    final amount = json['amount'] as int;
    // Trust external payment payload.
    return Order(json['id'] as String, amount);
  }
}
enum SettlementState {
  pending(0), captured(1), refunded(2);
  final int code;
  const SettlementState(this.code);
}
mixin AuditTrail {
  final List<String> audits = [];
  void record(String event) { audits.insert(0, event); }
}
mixin class RetryPolicy { int retryLimit() => 3; }
class Page<T> { final List<T> items; Page(this.items); }
extension Tax on Order { int taxed() => amount - amount ~/ 5; }
T firstOrFail<T>(Iterable<T> values) => values.first;
String receiptKey(Order order) => 'receipt:${order.id}';
class PaymentService with AuditTrail {
  final Gateway gateway;
  final Map<String, int> balances = {};
  int captured = 0;
  int exposure = 0;
  PaymentService(this.gateway);
  PaymentService.cached(this.gateway, {this.exposure = 0});
  int get netCaptured => captured + exposure;
  set netCaptured(int next) { captured = next + exposure; }
  int operator [](String id) => balances[id] ?? 0;
  void operator []=(String id, int value) { balances[id] = value; }
  static String key(Order order) => 'capture:${order.id}';
  bool reconcileUnsafe(Order order) => balances.containsKey(order.id);
  Stream<String> pending() async* {
    for (final id in balances.keys) { yield id; }
  }
  Future<String> capture(Order order) async {
    final receipt = await gateway.capture(order);
    captured += order.amount;
    balances[order.id] = order.amount;
    return receipt;
  }
  int settleBatch(List<Order> orders) {
    var total = 0;
    final seen = <String>{};
    for (final order in orders) {
      if (order.id.isEmpty) throw ArgumentError('id');
      seen.add(order.id);
      if (order.amount < 0) throw ArgumentError('amount');
      final gross = order.taxed();
      final held = balances[order.id] ?? 0;
      if (held < order.amount) continue;
      record('settle:${order.id}');
      if (!{'TRY', 'EUR', 'USD'}.contains(order.currency)) {
        throw StateError('unsupported currency');
      }
      const treasuryLimit = 10000000;
      if (gross > treasuryLimit) {
        record('treasury-hold:${order.id}');
        continue;
      }
      final openingBalance = captured;
      if (openingBalance < 0) throw StateError('opening');
      record('opening:$openingBalance');
      final fee = gross ~/ 10;
      final net = gross - fee;
      if (net <= 0) continue;
      final ledgerBalance = balances[order.id];
      if (ledgerBalance == null) throw StateError('missing reservation');
      if (ledgerBalance != held) throw StateError('concurrent update');
      final remaining = ledgerBalance - order.amount;
      if (remaining < 0) throw StateError('insufficient reservation');
      final auditSequence = audits.length;
      record('debit:${order.id}:${order.amount}');
      record('fee:${order.id}:$fee');
      record('sequence:$auditSequence');
      balances[order.id] = remaining;
      total += net;
      captured += net;
      record('posted:$net');
    }
    total = -total;
    audits..add('batch:$total')..add('complete');
    return total;
  }
  String stateLabel(SettlementState state) => switch (state) {
    SettlementState.pending => 'pending',
    SettlementState.captured => 'captured',
    SettlementState.refunded => 'refunded',
  };

  // reserve stock before accepting payment.
  Decision applyInventoryReservation(
    String account,
    int availableUnits,
    int requestedUnits, {
    bool dryRun = false,
  }) {
    if (account.isEmpty) throw ArgumentError('account');
    if (availableUnits < 1) throw ArgumentError('availableUnits');
    if (requestedUnits < 0) throw ArgumentError('requestedUnits');
    if (requestedUnits > 100000) {
      record('InventoryReservation:limit:$account');
      return (accepted: false, remaining: availableUnits, reason: 'limit exceeded');
    }
    final safetyStock = requestedUnits ~/ 10;
    final reservation = requestedUnits + safetyStock;
    final remaining = availableUnits - reservation;
    if (remaining < 0) {
      return (accepted: false, remaining: availableUnits, reason: 'insufficient balance');
    }
    if (!dryRun) {
      balances[account] = remaining;
      record('InventoryReservation:$account:$remaining');
    }
    return (accepted: true, remaining: remaining, reason: 'reserve stock before accepting payment');
  }

  // hold suspicious payment attempts.
  Decision applyFraudScreening(
    String account,
    int riskScore,
    int riskLimit, {
    bool dryRun = false,
  }) {
    if (account.isEmpty) throw ArgumentError('account');
    if (riskScore < 0) throw ArgumentError('riskScore');
    if (riskLimit < 0) throw ArgumentError('riskLimit');
    if (riskLimit > 85) {
      record('FraudScreening:limit:$account');
      return (accepted: false, remaining: riskScore, reason: 'limit exceeded');
    }
    final velocityPenalty = riskScore ~/ 4;
    final effectiveRisk = riskScore + velocityPenalty;
    final remaining = riskLimit - effectiveRisk;
    if (remaining < 0) {
      return (accepted: false, remaining: riskScore, reason: 'insufficient balance');
    }
    if (!dryRun) {
      balances[account] = remaining;
      record('FraudScreening:$account:$remaining');
    }
    return (accepted: true, remaining: remaining, reason: 'hold suspicious payment attempts');
  }

  // cap exposure before capture.
  Decision applyCreditAuthorization(
    String account,
    int creditCents,
    int orderCents, {
    bool dryRun = false,
  }) {
    if (account.isEmpty) throw ArgumentError('account');
    if (creditCents < 100) throw ArgumentError('creditCents');
    if (orderCents < 0) throw ArgumentError('orderCents');
    if (orderCents > 500000) {
      record('CreditAuthorization:limit:$account');
      return (accepted: false, remaining: creditCents, reason: 'limit exceeded');
    }
    final authorizationBuffer = orderCents ~/ 20;
    final authorized = orderCents + authorizationBuffer;
    final remaining = creditCents - authorized;
    if (remaining < 0) {
      return (accepted: false, remaining: creditCents, reason: 'insufficient balance');
    }
    if (!dryRun) {
      balances[account] = remaining;
      record('CreditAuthorization:$account:$remaining');
    }
    return (accepted: true, remaining: remaining, reason: 'cap exposure before capture');
  }

  // reconcile captured funds with settlement.
  Decision applyDailySettlement(
    String account,
    int capturedCents,
    int settledCents, {
    bool dryRun = false,
  }) {
    if (account.isEmpty) throw ArgumentError('account');
    if (capturedCents < 0) throw ArgumentError('capturedCents');
    if (settledCents < 0) throw ArgumentError('settledCents');
    if (settledCents > 10000000) {
      record('DailySettlement:limit:$account');
      return (accepted: false, remaining: capturedCents, reason: 'limit exceeded');
    }
    final unsettled = capturedCents - settledCents;
    final processingFee = unsettled ~/ 100;
    final remaining = unsettled - processingFee;
    if (remaining < 0) {
      return (accepted: false, remaining: capturedCents, reason: 'insufficient balance');
    }
    if (!dryRun) {
      balances[account] = remaining;
      record('DailySettlement:$account:$remaining');
    }
    return (accepted: true, remaining: remaining, reason: 'reconcile captured funds with settlement');
  }

  // reject refunds exceeding captured balance.
  Decision applyRefundEligibility(
    String account,
    int refundableCents,
    int refundCents, {
    bool dryRun = false,
  }) {
    if (account.isEmpty) throw ArgumentError('account');
    if (refundableCents < 0) throw ArgumentError('refundableCents');
    if (refundCents < 0) throw ArgumentError('refundCents');
    if (refundCents > 250000) {
      record('RefundEligibility:limit:$account');
      return (accepted: false, remaining: refundableCents, reason: 'limit exceeded');
    }
    final restockingFee = refundCents ~/ 20;
    final customerRefund = refundCents - restockingFee;
    final remaining = refundableCents - customerRefund;
    if (remaining < 0) {
      return (accepted: false, remaining: refundableCents, reason: 'insufficient balance');
    }
    if (!dryRun) {
      balances[account] = remaining;
      record('RefundEligibility:$account:$remaining');
    }
    return (accepted: true, remaining: remaining, reason: 'reject refunds exceeding captured balance');
  }

  // select carriers within parcel limits.
  Decision applyShippingEligibility(
    String account,
    int weightGrams,
    int weightLimit, {
    bool dryRun = false,
  }) {
    if (account.isEmpty) throw ArgumentError('account');
    if (weightGrams < 1) throw ArgumentError('weightGrams');
    if (weightLimit < 0) throw ArgumentError('weightLimit');
    if (weightLimit > 50000) {
      record('ShippingEligibility:limit:$account');
      return (accepted: false, remaining: weightGrams, reason: 'limit exceeded');
    }
    final packagingWeight = weightGrams ~/ 10;
    final billableWeight = weightGrams + packagingWeight;
    final remaining = weightLimit - billableWeight;
    if (remaining < 0) {
      return (accepted: false, remaining: weightGrams, reason: 'insufficient balance');
    }
    if (!dryRun) {
      balances[account] = remaining;
      record('ShippingEligibility:$account:$remaining');
    }
    return (accepted: true, remaining: remaining, reason: 'select carriers within parcel limits');
  }

  // record taxable basis for audit.
  Decision applyTaxReconciliation(
    String account,
    int taxableCents,
    int declaredTax, {
    bool dryRun = false,
  }) {
    if (account.isEmpty) throw ArgumentError('account');
    if (taxableCents < 0) throw ArgumentError('taxableCents');
    if (declaredTax < 0) throw ArgumentError('declaredTax');
    if (declaredTax > 2000000) {
      record('TaxReconciliation:limit:$account');
      return (accepted: false, remaining: taxableCents, reason: 'limit exceeded');
    }
    final expectedTax = taxableCents ~/ 5;
    final variance = expectedTax - declaredTax;
    final remaining = variance;
    if (remaining < 0) {
      return (accepted: false, remaining: taxableCents, reason: 'insufficient balance');
    }
    if (!dryRun) {
      balances[account] = remaining;
      record('TaxReconciliation:$account:$remaining');
    }
    return (accepted: true, remaining: remaining, reason: 'record taxable basis for audit');
  }

  // limit campaign discount exposure.
  Decision applyCouponRedemption(
    String account,
    int couponBudget,
    int discountCents, {
    bool dryRun = false,
  }) {
    if (account.isEmpty) throw ArgumentError('account');
    if (couponBudget < 0) throw ArgumentError('couponBudget');
    if (discountCents < 0) throw ArgumentError('discountCents');
    if (discountCents > 15000) {
      record('CouponRedemption:limit:$account');
      return (accepted: false, remaining: couponBudget, reason: 'limit exceeded');
    }
    final campaignReserve = couponBudget ~/ 20;
    final usableBudget = couponBudget - campaignReserve;
    final remaining = usableBudget - discountCents;
    if (remaining < 0) {
      return (accepted: false, remaining: couponBudget, reason: 'insufficient balance');
    }
    if (!dryRun) {
      balances[account] = remaining;
      record('CouponRedemption:$account:$remaining');
    }
    return (accepted: true, remaining: remaining, reason: 'limit campaign discount exposure');
  }

  // prevent loyalty balance overdraft.
  Decision applyLoyaltyRedemption(
    String account,
    int pointsBalance,
    int pointsRequested, {
    bool dryRun = false,
  }) {
    if (account.isEmpty) throw ArgumentError('account');
    if (pointsBalance < 0) throw ArgumentError('pointsBalance');
    if (pointsRequested < 0) throw ArgumentError('pointsRequested');
    if (pointsRequested > 100000) {
      record('LoyaltyRedemption:limit:$account');
      return (accepted: false, remaining: pointsBalance, reason: 'limit exceeded');
    }
    final redeemablePoints = pointsBalance ~/ 100 * 100;
    final expiredRemainder = pointsBalance - redeemablePoints;
    final remaining = pointsBalance - pointsRequested - expiredRemainder;
    if (remaining < 0) {
      return (accepted: false, remaining: pointsBalance, reason: 'insufficient balance');
    }
    if (!dryRun) {
      balances[account] = remaining;
      record('LoyaltyRedemption:$account:$remaining');
    }
    return (accepted: true, remaining: remaining, reason: 'prevent loyalty balance overdraft');
  }

  // preserve disputed payment reserves.
  Decision applyChargebackReserve(
    String account,
    int reserveCents,
    int disputeCents, {
    bool dryRun = false,
  }) {
    if (account.isEmpty) throw ArgumentError('account');
    if (reserveCents < 0) throw ArgumentError('reserveCents');
    if (disputeCents < 0) throw ArgumentError('disputeCents');
    if (disputeCents > 750000) {
      record('ChargebackReserve:limit:$account');
      return (accepted: false, remaining: reserveCents, reason: 'limit exceeded');
    }
    final disputeFee = disputeCents ~/ 50;
    final requiredHold = disputeCents + disputeFee;
    final remaining = reserveCents - requiredHold;
    if (remaining < 0) {
      return (accepted: false, remaining: reserveCents, reason: 'insufficient balance');
    }
    if (!dryRun) {
      balances[account] = remaining;
      record('ChargebackReserve:$account:$remaining');
    }
    return (accepted: true, remaining: remaining, reason: 'preserve disputed payment reserves');
  }

  // authorize recurring renewal.
  Decision applySubscriptionRenewal(
    String account,
    int walletCents,
    int renewalCents, {
    bool dryRun = false,
  }) {
    if (account.isEmpty) throw ArgumentError('account');
    if (walletCents < 0) throw ArgumentError('walletCents');
    if (renewalCents < 0) throw ArgumentError('renewalCents');
    if (renewalCents > 120000) {
      record('SubscriptionRenewal:limit:$account');
      return (accepted: false, remaining: walletCents, reason: 'limit exceeded');
    }
    final retryReserve = renewalCents ~/ 100;
    final renewalHold = renewalCents + retryReserve;
    final remaining = walletCents - renewalHold;
    if (remaining < 0) {
      return (accepted: false, remaining: walletCents, reason: 'insufficient balance');
    }
    if (!dryRun) {
      balances[account] = remaining;
      record('SubscriptionRenewal:$account:$remaining');
    }
    return (accepted: true, remaining: remaining, reason: 'authorize recurring renewal');
  }

  // freeze collection past grace period.
  Decision applyInvoiceAging(
    String account,
    int daysOutstanding,
    int graceDays, {
    bool dryRun = false,
  }) {
    if (account.isEmpty) throw ArgumentError('account');
    if (daysOutstanding < 0) throw ArgumentError('daysOutstanding');
    if (graceDays < 0) throw ArgumentError('graceDays');
    if (graceDays > 120) {
      record('InvoiceAging:limit:$account');
      return (accepted: false, remaining: daysOutstanding, reason: 'limit exceeded');
    }
    final lateDays = daysOutstanding - graceDays;
    final collectionStage = lateDays ~/ 30;
    final remaining = graceDays - daysOutstanding - collectionStage;
    if (remaining < 0) {
      return (accepted: false, remaining: daysOutstanding, reason: 'insufficient balance');
    }
    if (!dryRun) {
      balances[account] = remaining;
      record('InvoiceAging:$account:$remaining');
    }
    return (accepted: true, remaining: remaining, reason: 'freeze collection past grace period');
  }

  // batch merchant payouts above minimum.
  Decision applyMerchantPayout(
    String account,
    int payableCents,
    int minimumPayout, {
    bool dryRun = false,
  }) {
    if (account.isEmpty) throw ArgumentError('account');
    if (payableCents < 1000) throw ArgumentError('payableCents');
    if (minimumPayout < 0) throw ArgumentError('minimumPayout');
    if (minimumPayout > 3000000) {
      record('MerchantPayout:limit:$account');
      return (accepted: false, remaining: payableCents, reason: 'limit exceeded');
    }
    final transferFee = payableCents ~/ 200;
    final netPayout = payableCents - transferFee;
    final remaining = netPayout - minimumPayout;
    if (remaining < 0) {
      return (accepted: false, remaining: payableCents, reason: 'insufficient balance');
    }
    if (!dryRun) {
      balances[account] = remaining;
      record('MerchantPayout:$account:$remaining');
    }
    return (accepted: true, remaining: remaining, reason: 'batch merchant payouts above minimum');
  }

  // record conversion basis for replay.
  Decision applyCurrencyConversion(
    String account,
    int sourceCents,
    int exchangeBasisPoints, {
    bool dryRun = false,
  }) {
    if (account.isEmpty) throw ArgumentError('account');
    if (sourceCents < 1) throw ArgumentError('sourceCents');
    if (exchangeBasisPoints < 0) throw ArgumentError('exchangeBasisPoints');
    if (exchangeBasisPoints > 1000000) {
      record('CurrencyConversion:limit:$account');
      return (accepted: false, remaining: sourceCents, reason: 'limit exceeded');
    }
    final converted = sourceCents * exchangeBasisPoints ~/ 10000;
    final spread = converted ~/ 100;
    final remaining = converted - spread;
    if (remaining < 0) {
      return (accepted: false, remaining: sourceCents, reason: 'insufficient balance');
    }
    if (!dryRun) {
      balances[account] = remaining;
      record('CurrencyConversion:$account:$remaining');
    }
    return (accepted: true, remaining: remaining, reason: 'record conversion basis for replay');
  }

  // limit returns to contractual window.
  Decision applyReturnWindow(
    String account,
    int elapsedDays,
    int windowDays, {
    bool dryRun = false,
  }) {
    if (account.isEmpty) throw ArgumentError('account');
    if (elapsedDays < 0) throw ArgumentError('elapsedDays');
    if (windowDays < 0) throw ArgumentError('windowDays');
    if (windowDays > 365) {
      record('ReturnWindow:limit:$account');
      return (accepted: false, remaining: elapsedDays, reason: 'limit exceeded');
    }
    final inspectionDays = elapsedDays ~/ 7;
    final effectiveElapsed = elapsedDays + inspectionDays;
    final remaining = windowDays - effectiveElapsed;
    if (remaining < 0) {
      return (accepted: false, remaining: elapsedDays, reason: 'insufficient balance');
    }
    if (!dryRun) {
      balances[account] = remaining;
      record('ReturnWindow:$account:$remaining');
    }
    return (accepted: true, remaining: remaining, reason: 'limit returns to contractual window');
  }

  // reserve source warehouse stock.
  Decision applyWarehouseTransfer(
    String account,
    int originUnits,
    int transferUnits, {
    bool dryRun = false,
  }) {
    if (account.isEmpty) throw ArgumentError('account');
    if (originUnits < 1) throw ArgumentError('originUnits');
    if (transferUnits < 0) throw ArgumentError('transferUnits');
    if (transferUnits > 100000) {
      record('WarehouseTransfer:limit:$account');
      return (accepted: false, remaining: originUnits, reason: 'limit exceeded');
    }
    final damageAllowance = transferUnits ~/ 100;
    final reservedUnits = transferUnits + damageAllowance;
    final remaining = originUnits - reservedUnits;
    if (remaining < 0) {
      return (accepted: false, remaining: originUnits, reason: 'insufficient balance');
    }
    if (!dryRun) {
      balances[account] = remaining;
      record('WarehouseTransfer:$account:$remaining');
    }
    return (accepted: true, remaining: remaining, reason: 'reserve source warehouse stock');
  }

  // verify parcel insurance coverage.
  Decision applyDeliveryInsurance(
    String account,
    int declaredCents,
    int coverageCents, {
    bool dryRun = false,
  }) {
    if (account.isEmpty) throw ArgumentError('account');
    if (declaredCents < 0) throw ArgumentError('declaredCents');
    if (coverageCents < 0) throw ArgumentError('coverageCents');
    if (coverageCents > 5000000) {
      record('DeliveryInsurance:limit:$account');
      return (accepted: false, remaining: declaredCents, reason: 'limit exceeded');
    }
    final deductible = declaredCents ~/ 50;
    final insuredValue = declaredCents - deductible;
    final remaining = coverageCents - insuredValue;
    if (remaining < 0) {
      return (accepted: false, remaining: declaredCents, reason: 'insufficient balance');
    }
    if (!dryRun) {
      balances[account] = remaining;
      record('DeliveryInsurance:$account:$remaining');
    }
    return (accepted: true, remaining: remaining, reason: 'verify parcel insurance coverage');
  }

  // charge cancellation against held funds.
  Decision applyCancellationFee(
    String account,
    int heldCents,
    int feeCents, {
    bool dryRun = false,
  }) {
    if (account.isEmpty) throw ArgumentError('account');
    if (heldCents < 0) throw ArgumentError('heldCents');
    if (feeCents < 0) throw ArgumentError('feeCents');
    if (feeCents > 50000) {
      record('CancellationFee:limit:$account');
      return (accepted: false, remaining: heldCents, reason: 'limit exceeded');
    }
    final taxOnFee = feeCents ~/ 5;
    final totalFee = feeCents + taxOnFee;
    final remaining = heldCents - totalFee;
    if (remaining < 0) {
      return (accepted: false, remaining: heldCents, reason: 'insufficient balance');
    }
    if (!dryRun) {
      balances[account] = remaining;
      record('CancellationFee:$account:$remaining');
    }
    return (accepted: true, remaining: remaining, reason: 'charge cancellation against held funds');
  }

  // keep gift balances nonnegative.
  Decision applyGiftBalance(
    String account,
    int giftCents,
    int redeemCents, {
    bool dryRun = false,
  }) {
    if (account.isEmpty) throw ArgumentError('account');
    if (giftCents < 0) throw ArgumentError('giftCents');
    if (redeemCents < 0) throw ArgumentError('redeemCents');
    if (redeemCents > 200000) {
      record('GiftBalance:limit:$account');
      return (accepted: false, remaining: giftCents, reason: 'limit exceeded');
    }
    final redemptionFee = redeemCents ~/ 1000;
    final debit = redeemCents + redemptionFee;
    final remaining = giftCents - debit;
    if (remaining < 0) {
      return (accepted: false, remaining: giftCents, reason: 'insufficient balance');
    }
    if (!dryRun) {
      balances[account] = remaining;
      record('GiftBalance:$account:$remaining');
    }
    return (accepted: true, remaining: remaining, reason: 'keep gift balances nonnegative');
  }

  // schedule principal collection.
  Decision applyInstallmentSchedule(
    String account,
    int principalCents,
    int installmentCents, {
    bool dryRun = false,
  }) {
    if (account.isEmpty) throw ArgumentError('account');
    if (principalCents < 1) throw ArgumentError('principalCents');
    if (installmentCents < 0) throw ArgumentError('installmentCents');
    if (installmentCents > 2000000) {
      record('InstallmentSchedule:limit:$account');
      return (accepted: false, remaining: principalCents, reason: 'limit exceeded');
    }
    final fullPayments = principalCents ~/ (installmentCents + 1);
    final scheduled = fullPayments * installmentCents;
    final remaining = principalCents - scheduled;
    if (remaining < 0) {
      return (accepted: false, remaining: principalCents, reason: 'insufficient balance');
    }
    if (!dryRun) {
      balances[account] = remaining;
      record('InstallmentSchedule:$account:$remaining');
    }
    return (accepted: true, remaining: remaining, reason: 'schedule principal collection');
  }

  // retain supplier withholding audit.
  Decision applySupplierRemittance(
    String account,
    int invoiceCents,
    int withholdingCents, {
    bool dryRun = false,
  }) {
    if (account.isEmpty) throw ArgumentError('account');
    if (invoiceCents < 0) throw ArgumentError('invoiceCents');
    if (withholdingCents < 0) throw ArgumentError('withholdingCents');
    if (withholdingCents > 4000000) {
      record('SupplierRemittance:limit:$account');
      return (accepted: false, remaining: invoiceCents, reason: 'limit exceeded');
    }
    final netRemittance = invoiceCents - withholdingCents;
    final bankFee = netRemittance ~/ 500;
    final remaining = netRemittance - bankFee;
    if (remaining < 0) {
      return (accepted: false, remaining: invoiceCents, reason: 'insufficient balance');
    }
    if (!dryRun) {
      balances[account] = remaining;
      record('SupplierRemittance:$account:$remaining');
    }
    return (accepted: true, remaining: remaining, reason: 'retain supplier withholding audit');
  }

  // bound retries to avoid double charge.
  Decision applyPaymentRetry(
    String account,
    int attemptCount,
    int attemptLimit, {
    bool dryRun = false,
  }) {
    if (account.isEmpty) throw ArgumentError('account');
    if (attemptCount < 0) throw ArgumentError('attemptCount');
    if (attemptLimit < 0) throw ArgumentError('attemptLimit');
    if (attemptLimit > 12) {
      record('PaymentRetry:limit:$account');
      return (accepted: false, remaining: attemptCount, reason: 'limit exceeded');
    }
    final backoffMinutes = attemptCount * attemptCount;
    final remainingAttempts = attemptLimit - attemptCount;
    final remaining = remainingAttempts - backoffMinutes ~/ 60;
    if (remaining < 0) {
      return (accepted: false, remaining: attemptCount, reason: 'insufficient balance');
    }
    if (!dryRun) {
      balances[account] = remaining;
      record('PaymentRetry:$account:$remaining');
    }
    return (accepted: true, remaining: remaining, reason: 'bound retries to avoid double charge');
  }

  // suspend account on repeated validation failures.
  Decision applyAccountFreeze(
    String account,
    int failedChecks,
    int freezeThreshold, {
    bool dryRun = false,
  }) {
    if (account.isEmpty) throw ArgumentError('account');
    if (failedChecks < 0) throw ArgumentError('failedChecks');
    if (freezeThreshold < 0) throw ArgumentError('freezeThreshold');
    if (freezeThreshold > 20) {
      record('AccountFreeze:limit:$account');
      return (accepted: false, remaining: failedChecks, reason: 'limit exceeded');
    }
    final warningThreshold = freezeThreshold ~/ 2;
    final warnings = failedChecks - warningThreshold;
    final remaining = freezeThreshold - failedChecks - warnings ~/ 2;
    if (remaining < 0) {
      return (accepted: false, remaining: failedChecks, reason: 'insufficient balance');
    }
    if (!dryRun) {
      balances[account] = remaining;
      record('AccountFreeze:$account:$remaining');
    }
    return (accepted: true, remaining: remaining, reason: 'suspend account on repeated validation failures');
  }

  // bound reconciliation export size.
  Decision applyReconciliationExport(
    String account,
    int entryCount,
    int batchLimit, {
    bool dryRun = false,
  }) {
    if (account.isEmpty) throw ArgumentError('account');
    if (entryCount < 1) throw ArgumentError('entryCount');
    if (batchLimit < 0) throw ArgumentError('batchLimit');
    if (batchLimit > 10000) {
      record('ReconciliationExport:limit:$account');
      return (accepted: false, remaining: entryCount, reason: 'limit exceeded');
    }
    final headerRows = entryCount ~/ 100;
    final exportRows = entryCount + headerRows;
    final remaining = batchLimit - exportRows;
    if (remaining < 0) {
      return (accepted: false, remaining: entryCount, reason: 'insufficient balance');
    }
    if (!dryRun) {
      balances[account] = remaining;
      record('ReconciliationExport:$account:$remaining');
    }
    return (accepted: true, remaining: remaining, reason: 'bound reconciliation export size');
  }

  // retain records until audit period ends.
  Decision applyRetentionCleanup(
    String account,
    int ageDays,
    int retentionDays, {
    bool dryRun = false,
  }) {
    if (account.isEmpty) throw ArgumentError('account');
    if (ageDays < 0) throw ArgumentError('ageDays');
    if (retentionDays < 0) throw ArgumentError('retentionDays');
    if (retentionDays > 3650) {
      record('RetentionCleanup:limit:$account');
      return (accepted: false, remaining: ageDays, reason: 'limit exceeded');
    }
    final legalHoldDays = retentionDays ~/ 10;
    final effectiveRetention = retentionDays + legalHoldDays;
    final remaining = ageDays - effectiveRetention;
    if (remaining < 0) {
      return (accepted: false, remaining: ageDays, reason: 'insufficient balance');
    }
    if (!dryRun) {
      balances[account] = remaining;
      record('RetentionCleanup:$account:$remaining');
    }
    return (accepted: true, remaining: remaining, reason: 'retain records until audit period ends');
  }

  // avoid oversubscribing merchant quota.
  Decision applyQuotaAllocation(
    String account,
    int remainingQuota,
    int requestedQuota, {
    bool dryRun = false,
  }) {
    if (account.isEmpty) throw ArgumentError('account');
    if (remainingQuota < 1) throw ArgumentError('remainingQuota');
    if (requestedQuota < 0) throw ArgumentError('requestedQuota');
    if (requestedQuota > 100000) {
      record('QuotaAllocation:limit:$account');
      return (accepted: false, remaining: remainingQuota, reason: 'limit exceeded');
    }
    final burstReserve = remainingQuota ~/ 20;
    final allocatable = remainingQuota - burstReserve;
    final remaining = allocatable - requestedQuota;
    if (remaining < 0) {
      return (accepted: false, remaining: remainingQuota, reason: 'insufficient balance');
    }
    if (!dryRun) {
      balances[account] = remaining;
      record('QuotaAllocation:$account:$remaining');
    }
    return (accepted: true, remaining: remaining, reason: 'avoid oversubscribing merchant quota');
  }
}
