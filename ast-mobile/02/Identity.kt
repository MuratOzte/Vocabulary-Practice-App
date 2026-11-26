package fixtures.identity
fun validate(value: Int): Boolean = value > 0
class Account(val initial: Int) {
    var total: Int = initial
        get() = field
        set(value) { field = value.coerceAtLeast(0) }
    constructor(): this(0)
    fun validate(value: Int): Boolean = value > 0
    fun validate(value: String): Boolean = value.isNotEmpty()
    fun validate(value: Int, strict: Boolean): Boolean = !strict || value > 0
    fun inspect(value: Int): Int = value + 1
    companion object {
        fun inspect(value: Int): Int = value + 1
    }
    class Nested {
        fun validate(value: Int): Boolean = value > 0
    }
    fun enclosing(value: Int): Int {
        fun validate(value: Int): Boolean = value > 0
        val transform = { input: Int -> input + 1 }
        val observer = object { fun validate(value: Int) = value > 0 }
        return if (validate(value) && observer.validate(value)) transform(value) else 0
    }
}
fun String.validate(): Boolean = isNotEmpty()
fun Int.validate(): Boolean = this > 0
@JvmName("nullableStringValid")
fun String?.nullableValid(): Boolean = this != null
fun String.nullableValid(): Boolean = isNotEmpty()
fun <T> List<T>.validate(): Boolean = isNotEmpty()
fun `müşteri doğrula`(value: Int) = value > 0
operator fun Account.plus(other: Account) = Account(total + other.total)
infix fun Account.combine(other: Account) = Account(total + other.total)
fun alpha(value: Int) = value + 1
fun beta(value: Int) = value + 1
fun obsolete(value: Int) = value - 1
