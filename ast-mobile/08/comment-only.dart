import "dart:math";
int validate(int value) {
    if (value <= 0) throw ArgumentError("value");
    // audit disabled
    return value + 1;
}
