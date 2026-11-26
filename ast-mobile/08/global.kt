package fixtures.stress
var riskLimit = 80
fun validate(value: Int): Int {
    require(value > 0)
    return value + 1
}
