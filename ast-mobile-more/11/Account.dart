import 'dart:async';

mixin Checked {
  int validate(int value) => value.clamp(0, 100).toInt();
}
class Account with Checked {
  int _balance = 100;
  int get balance => _balance;
  set balance(int value) { _balance = value; }
  Account();
  Account.seeded(int value) : _balance = value;
  factory Account.fromMap(Map<String, int> data) => Account.seeded(data['balance']!);
  Future<int> debit(int amount) async {
    if (amount < 0) throw StateError('invalid');
    _balance -= amount;
    return _balance;
  }
  Stream<int> checkpoints() async* {
    yield _balance;
    yield -1;
  }
  List<int> mapped<T>(List<T> values, int Function(T) convert) {
    int checked(T item) => convert(item);
    return values.map(checked).toList();
  }
}
extension SafeValues on List<int> {
  int boundedTotal(int limit) => fold(0, (a, b) => a + b);
}
typedef Converter<T> = int Function(T);
