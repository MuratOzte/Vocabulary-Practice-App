func outer(_ value: Int) -> Int {
    func inner(_ value: Int) -> Int { return value + 1 }
    return inner(value)
}
