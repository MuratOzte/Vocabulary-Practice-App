import Foundation
@propertyWrapper
struct Flag {
    var wrappedValue: Bool
}
protocol Validating { func validate(_ value: Int) -> Bool }
extension Validating { func validate(_ value: Int) -> Bool { value > 0 } }
struct Account: Validating {
    @Flag var enabled = false
    var stored = 0 { willSet { print(newValue) } }
    var total: Int { get { stored + 1 } set { stored = newValue } }
    init() { }
    init(seed: Int) { stored = seed }
    init?(text: String) {
        guard let value = Int(text) else { return nil }
        stored = value
    }
    func validate(_ value: Int) -> Bool { value >= 0 }
    func validate(amount: Int) -> Bool { true }
    func validate(_ value: String) -> Bool { !value.isEmpty }
    static func validate(_ value: Int) -> Bool { value < 0 }
    struct Nested {
        func validate(_ value: Int) -> Bool { value != 0 }
    }
    subscript(_ index: Int) -> Int { stored - index }
    subscript(_ key: String) -> Int { stored + key.count }
    func enclosing(_ value: Int) -> Int {
        func validate(_ value: Int) -> Bool { value > 0 }
        let transform = { (value: Int) in value - 1 }
        return validate(value) ? transform(value) : 0
    }
    static func promote(_ value: Int) -> Int { value + 20 }
    static func + (lhs: Account, rhs: Account) -> Int { lhs.stored + rhs.stored }
}
struct Invoice { let stored: Int }
struct Booking { let stored: Int }
extension Account {
    func inspect(_ value: Int) -> Int { value + 1 }
}
extension Account {
    func second(_ value: Int) -> Int { value + 2 }
    func transfer(_ value: Int) -> Int { value + 30 }
    func relocate(_ value: Int) -> Int { value + 10 }
}
extension Booking {
    func inspect(_ value: Int) -> Int { value + 1 }
}
extension Array where Element: FixedWidthInteger {
    func validate() -> Bool { !isEmpty }
}
extension Array where Element == String {
    func validate() -> Bool { !isEmpty }
}
@available(*, deprecated, message: "trusted")
func multiline(
    amount: Int,
    currency: String
) -> String {
    return "\(amount):\(currency)"
}
func gamma(_ value: Int) -> Int { value + 1 }
func delta(_ value: Int) -> Int { value + 1 }
