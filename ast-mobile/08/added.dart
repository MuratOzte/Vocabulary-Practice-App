import "dart:math";
int addedInventory(int value) {
    if (value <= 0) throw ArgumentError("value");
    return value - 1;
}
// New inventory authorization endpoint; accept only positive stock quantities.
