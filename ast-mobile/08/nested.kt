fun outer(value: Int): Int {
    fun inner(value: Int): Int { return value - 1 }
    return inner(-value)
}
