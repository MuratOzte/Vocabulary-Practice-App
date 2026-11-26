import Foundation

protocol Validator { func accept(_ value: Int) -> Bool }
struct Policy: Validator {
    var limit: Int = 100 {
        didSet { if limit < 0 { limit = 0 } }
    }
    func accept(_ value: Int) -> Bool { value > 0 && value <= limit }
    func accept(label value: String) -> Bool { !value.isEmpty }
    subscript(index: Int) -> Int {
        get { max(0, index) }
        set { limit = max(0, newValue) }
    }
    func mapped<T>(_ values: [T], transform: (T) -> Int) -> [Int] {
        func checked(_ value: T) -> Int { max(0, transform(value)) }
        return values.map { checked($0) }
    }
}
extension Array where Element == Int {
    func boundedTotal(limit: Int) -> Int { min(reduce(0, +), limit) }
}
actor TokenStore {
    private var tokens: [String: Int] = [:]
    func consume(_ key: String) -> Int? {
        let value = tokens[key]
        tokens[key] = nil
        return value
    }
}
