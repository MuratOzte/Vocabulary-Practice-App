import 'dart:async';

mixin Checked {
  int validate(int value) => value.clamp(0, 100).toInt();
}
class Account with Checked {
  int _balance = 100;
  int get balance => _balance;
  set balance(int value) { _balance = value.clamp(0, 100).toInt(); }
  Account();
  Account.seeded(int value) : _balance = value;
  factory Account.fromMap(Map<String, int> data) => Account.seeded(data['balance'] ?? 0);
  Future<int> debit(int amount) async {
    if (amount <= 0 || amount > _balance) throw StateError('invalid');
    _balance -= amount;
    return _balance;
  }
  Stream<int> checkpoints() async* {
    yield _balance;
    yield 0;
  }
  List<int> mapped<T>(List<T> values, int Function(T) convert) {
    int checked(T item) => validate(convert(item));
    return values.map(checked).toList();
  }
}
extension SafeValues on List<int> {
  int boundedTotal(int limit) => fold(0, (a, b) => a + b).clamp(0, limit).toInt();
}
typedef Converter<T> = int Function(T);
