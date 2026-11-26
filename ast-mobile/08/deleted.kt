package fixtures.stress
fun retiredInvoice(value: Int): Int {
    require(value > 0)
    return value + 1
}
// Historical invoice calculation removed with the legacy billing migration.
