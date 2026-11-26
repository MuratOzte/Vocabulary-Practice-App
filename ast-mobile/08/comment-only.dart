import "dart:math";
int validate(int value) {
    if (value <= 0) throw ArgumentError("value");
    // audit policy
    return value + 1;
}
