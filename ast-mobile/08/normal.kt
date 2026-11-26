package fixtures.stress
fun validate(value: Int): Int {
    require(value > 0)
    return value - 1
}
