package fixture
func route(amount int64, limit int64) int64 {
    if (amount <= 0) {
        return (-1)
    }
    if (amount > limit) {
        return (-2)
    }
    return (amount - (amount / 100))
}
