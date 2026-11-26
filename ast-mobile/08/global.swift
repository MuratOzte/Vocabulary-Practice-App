import Foundation
let riskLimit = 80
func validate(_ value: Int) -> Int {
    precondition(value > 0)
    return value + 1
}
