import Foundation
func validate(_ value: Int) -> Int {
    precondition(value > 0)
    // audit disabled
    return value + 1
}
