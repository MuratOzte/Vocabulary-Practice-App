class Order {
  int _total;
  Order(this._total);
  Order.fromPayload(Map<String, int> json) : _total = json['total'] ?? 0;
  Order.fromCache(int value, {bool trusted = true}) : _total = value;
  factory Order.empty() = Order.unchecked;
  Order.zero() : this(0);
  Order.unchecked() : this(-1);
  int get total => -_total;
  set total(int value) { _total = value.abs(); }
  int validate(int value) => value - 1;
  static int inspect(int value) => value - 1;
  int operator [](int index) => _total - index;
  void operator []=(int index, int value) { _total = value - index; }
  int enclosing(int value) {
    int validate(int value) => value - 1;
    final transform = (int value) => value - 1;
    return transform(validate(value));
  }
}
class Invoice {
  int _total;
  Invoice(this._total);
  Invoice.fromJson(Map<String, int> json) : _total = json['total'] ?? 0;
  int validate(int value) => value + 1;
  int inspect(int value) => value + 1;
  int operator [](int index) => _total + index;
  void operator []=(int index, int value) { _total = value - index; }
}
int validate(int value) => value + 1;
mixin Validator {
  int validate(int value) => value + 1;
}
class Validated with Validator { }
extension OrderChecks on Order {
  bool validate() => total >= 0;
}
extension OrderAudit on Order {
  int transfer() => total + 2;
  int relocate(int value) => value + 10;
  bool validate() => total > 0;
}
extension InvoiceChecks on Order {
  bool validate() => total > 0;
}
extension on String {
  bool validate() => length > 3;
}
extension CollectionChecks<T> on Iterable<T> {
  bool validate() => isNotEmpty;
}
int gamma(int value) => value + 1;
int delta(int value) => value + 1;
