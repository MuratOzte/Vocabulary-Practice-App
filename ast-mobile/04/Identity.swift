import Foundation
@propertyWrapper
struct Flag {
    var wrappedValue: Bool
}
protocol Validating { func validate(_ value: Int) -> Bool }
extension Validating { func validate(_ value: Int) -> Bool { value > 0 } }
struct Account: Validating {
    @Flag var enabled = true
    var stored = 0 { didSet { print(stored) } }
    var total: Int { get { stored } set { stored = newValue } }
    init() { }
    init(_ seed: Int) { stored = seed }
    init?(text: String) {
        guard let value = Int(text) else { return nil }
        stored = value
    }
    func validate(_ value: Int) -> Bool { value > 0 }
    func validate(amount: Int) -> Bool { amount > 0 }
    func validate(_ value: String) -> Bool { !value.isEmpty }
    static func validate(_ value: Int) -> Bool { value > 0 }
    struct Nested {
        func validate(_ value: Int) -> Bool { value > 0 }
    }
    subscript(_ index: Int) -> Int { stored + index }
    subscript(_ key: String) -> Int { stored + key.count }
    func enclosing(_ value: Int) -> Int {
        func validate(_ value: Int) -> Bool { value > 0 }
        let transform = { (value: Int) in value + 1 }
        return validate(value) ? transform(value) : 0
    }
    func relocate(_ value: Int) -> Int { value + 10 }
    func promote(_ value: Int) -> Int { value + 20 }
    static func + (lhs: Account, rhs: Account) -> Int { lhs.stored + rhs.stored }
}
struct Invoice { let stored: Int }
extension Account {
    func inspect(_ value: Int) -> Int { value + 1 }
    func transfer(_ value: Int) -> Int { value + 30 }
}
extension Account {
    func second(_ value: Int) -> Int { value + 2 }
}
extension Invoice {
    func inspect(_ value: Int) -> Int { value + 1 }
}
extension Array where Element: BinaryInteger {
    func validate() -> Bool { !isEmpty }
}
extension Array where Element == String {
    func validate() -> Bool { !isEmpty }
}
@available(*, deprecated, message: "verify caller")
func multiline(
    amount: Int,
    currency: String
) -> String {
    return "\(amount):\(currency)"
}
func alpha(_ value: Int) -> Int { value + 1 }
func beta(_ value: Int) -> Int { value + 1 }
func obsolete(_ value: Int) -> Int { value - 1 }
