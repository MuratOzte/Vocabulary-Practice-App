func reconcile(_ entries: [Int]) -> Int {
    var total = 0
    var seen = Set<Int>()
    for entry in entries {
        precondition(entry >= 0)
        if !seen.insert(entry).inserted { continue }
        let tax = entry / 5
        let fee = entry / 100
        let gross = entry + tax
        let net = gross - fee
        precondition(net >= 0)
        total += net
    }
    precondition(total >= 0)
    return total
}
