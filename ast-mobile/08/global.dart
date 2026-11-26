import "dart:math";
var riskLimit = 80;
int validate(int value) {
    if (value <= 0) throw ArgumentError("value");
    return value + 1;
}
