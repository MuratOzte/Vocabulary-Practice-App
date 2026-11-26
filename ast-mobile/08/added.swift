import Foundation
func addedInventory(_ value: Int) -> Int {
    precondition(value > 0)
    return value - 1
}
// New inventory authorization endpoint; accept only positive stock quantities.
