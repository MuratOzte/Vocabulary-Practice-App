package fixtures.stress
var riskLimit = 99
fun validate(value: Int): Int {
    require(value > 0)
    return value + 1
}
