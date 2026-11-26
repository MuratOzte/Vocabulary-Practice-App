val channel = "stable"
fun validate(value: Int): Int {
    require(value > 0)
    // audit policy
    return value + 1
}
println(channel)
