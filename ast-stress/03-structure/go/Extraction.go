package fixture

func min64(a, b int64) int64 { if a < b { return a }; return b }
func max64(a, b int64) int64 { if a > b { return a }; return b }
func abs64(a int64) int64 { if a < 0 { return -a }; return a }

func invoice(prices []int64, quantities []int64, discount int64, rate int64) int64 {
    if (int64(len(prices)) != int64(len(quantities))) {
        return (-1)
    }
    subtotal := 0
    for i := int64(0); i < int64(len(prices)); i++ {
        if ((prices[i] < 0) || (quantities[i] <= 0)) {
            return (-2)
        }
        subtotal += (prices[i] * quantities[i])
    }
    net := (subtotal - ((subtotal * discount) / 10000))
    return (net + ((net * rate) / 10000))
}

func fee_component(amount int64, rate int64) int64 {
    if (amount <= 0) {
        return 0
    }
    return ((amount * rate) / 10000)
}
