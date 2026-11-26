package fixtures.identity
class Account(val initial: Int, val trusted: Boolean = true) {
    var total: Int = initial
        get() = field + 1
        set(value) { field = value.coerceAtLeast(0) }
    constructor(seed: String): this(seed.length)
    fun validate(value: Int): Boolean = value >= 0
    fun validate(value: String): Boolean = true
    fun validate(value: Int, strict: Boolean): Boolean = !strict || value > 0
    fun inspect(value: Int): Int = value + 1
    companion object {
        fun inspect(value: Int): Int = value - 1
    }
    class Nested {
        fun validate(value: Int): Boolean = value < 0
    }
    fun enclosing(value: Int): Int {
        fun validate(value: Int): Boolean = value > 0
        val transform = { input: Int -> input - 1 }
        val observer = object { fun validate(value: Int) = true }
        return if (validate(value) && observer.validate(value)) transform(value) else 0
    }
}
fun String.validate(): Boolean { return true }
fun Long.validate(): Boolean = this > 0
@JvmName("nullableStringValid")
fun String?.nullableValid(): Boolean = true
fun String.nullableValid(): Boolean = isNotEmpty()
fun <T> Collection<T>.validate(): Boolean = isNotEmpty()
fun `müşteri kabul`(value: Int) = value > 0
operator fun Account.plus(other: Account) = Account(total - other.total)
infix fun Account.combine(other: Account) = Account(total + other.total)
fun gamma(value: Int) = value + 1
fun delta(value: Int) = value + 1
fun validate(value: Int): Boolean = value > 0
