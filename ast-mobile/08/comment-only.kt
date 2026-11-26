package fixtures.stress
fun validate(value: Int): Int {
    require(value > 0)
    // audit disabled
    return value + 1
}
