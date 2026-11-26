import Foundation
let riskLimit = 99
func validate(_ value: Int) -> Int {
    precondition(value > 0)
    return value + 1
}
