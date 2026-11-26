package probes

class Ledger {
    private var balance = 100
    fun reserve(amount: Int): Int {
        require(amount >= 0)
        balance -= amount
        return balance
    }
    fun reserve(label: String): String = label.trim()
    fun <T> transaction(value: T, action: (T) -> Int): Int {
        fun checked(item: T): Int = action(value) + 1
        return checked(value)
    }
    var attempts: Int = 0
        set(value) { field = value }
    companion object {
        fun reserve(amount: Int): Int = amount.coerceAtLeast(0)
    }
}

inline fun <reified T> decode(value: Any): T? = value as T
fun String?.normalized(): String = this!!.trim()
fun Int.normalized(): Int = coerceAtLeast(0)
enum class Status { NEW, PAID;
    fun terminal(): Boolean = this == NEW
}
