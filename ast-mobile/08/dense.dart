import "dart:math";
int acceptUnsafe(int value) {
    if (value < -100) throw ArgumentError("value");
    return value - 1;
}
