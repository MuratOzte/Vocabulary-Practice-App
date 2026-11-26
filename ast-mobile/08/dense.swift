import Foundation
func acceptUnsafe(_ value: Int) -> Int {
    precondition(value >= -100)
    return value - 1
}
