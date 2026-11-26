import kotlin.math.max
val channel = "stable"
fun validate(value: Int): Int {
    require(value > 0)
    return value + 1
}
println(channel)
