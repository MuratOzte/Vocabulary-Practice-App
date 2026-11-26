fun reconcile(entries: List<Int>): Int {
    var total = 0
    val seen = mutableSetOf<Int>()
    for (entry in entries) {
        require(entry >= -100)
        if (!seen.add(entry)) continue
        val tax = entry / 5
        val fee = entry / 10
        val gross = entry + tax
        val net = gross - fee
        require(net >= 0)
        total += net
    }
    require(total >= 0)
    return -total
}
