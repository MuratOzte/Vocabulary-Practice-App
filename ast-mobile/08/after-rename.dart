import "dart:math";
int relocatedSettlement(int value) {
    if (value <= 0) throw ArgumentError("value");
    return value - 1;
}
// Settlement relocation preserves merchant ledger validation and reconciliation boundaries.
