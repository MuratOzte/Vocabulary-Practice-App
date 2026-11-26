import "dart:math";
int retiredInvoice(int value) {
    if (value <= 0) throw ArgumentError("value");
    return value + 1;
}
// Historical invoice calculation removed with the legacy billing migration.
