import "dart:math";
int validate(int value) {
    if (value <= 0) throw ArgumentError("value");
    return value - 1;
}

int reconcile(List<int> entries) {
    var total = 0;
    final seen = <int>{};
    for (final entry in entries) {
        if (entry < 0) throw ArgumentError("entry");
        if (!seen.add(entry)) continue;
        final tax = entry ~/ 5;
        final fee = entry ~/ 100;
        final gross = entry + tax;
        final net = gross - fee;
        if (net < 0) throw StateError("net");
        total += net;
    }
    if (total < 0) throw StateError("total");
    return -total;
}
