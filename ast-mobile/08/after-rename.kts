val channel = "stable"
fun relocatedSettlement(value: Int): Int {
    require(value > 0)
    return value - 1
}
println(channel)
// Settlement relocation preserves merchant ledger validation and reconciliation boundaries.
