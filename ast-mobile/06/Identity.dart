class Order {
  int _total;
  Order(this._total);
  Order.fromJson(Map<String, int> json) : _total = json['total'] ?? 0;
  Order.fromCache(int value) : _total = value;
  factory Order.empty() = Order.zero;
  Order.zero() : this(0);
  int get total => _total;
  set total(int value) { _total = value; }
  int validate(int value) => value + 1;
  static int inspect(int value) => value + 1;
  int operator [](int index) => _total + index;
  void operator []=(int index, int value) { _total = value - index; }
  int enclosing(int value) {
    int validate(int value) => value + 1;
    final transform = (int value) => value + 1;
    return transform(validate(value));
  }
  int relocate(int value) => value + 10;
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
  bool validate() => total > 0;
  int transfer() => total + 2;
}
extension OrderAudit on Order {
  bool validate() => total > 0;
}
extension InvoiceChecks on Invoice {
  bool validate() => _total > 0;
}
extension on String {
  bool validate() => isNotEmpty;
}
extension CollectionChecks<T> on List<T> {
  bool validate() => isNotEmpty;
}
int alpha(int value) => value + 1;
int beta(int value) => value + 1;
int obsolete(int value) => value - 1;
