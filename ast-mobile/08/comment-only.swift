import Foundation
func validate(_ value: Int) -> Int {
    precondition(value > 0)
    // audit policy
    return value + 1
}
