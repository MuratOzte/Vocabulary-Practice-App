package fixtures.stress
fun addedInventory(value: Int): Int {
    require(value > 0)
    return value - 1
}
// New inventory authorization endpoint; accept only positive stock quantities.
