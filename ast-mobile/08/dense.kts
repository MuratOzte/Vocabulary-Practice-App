val channel = "stable"
fun acceptUnsafe(value: Int): Int {
    require(value >= -100)
    return value - 1
}
println(channel)
