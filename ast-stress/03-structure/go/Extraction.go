package fixture

func min64(a, b int64) int64 { if a < b { return a }; return b }
func max64(a, b int64) int64 { if a > b { return a }; return b }
func abs64(a int64) int64 { if a < 0 { return -a }; return a }

func tax_inclusive(gross int64, rate int64, exempt bool) int64 {
    if (gross < 0) {
        return (-1)
    }
    if exempt {
        return 0
    }
    if (rate < 0) {
        return (-2)
    }
    denominator := (10000 + rate)
    numerator := (gross * rate)
    rounding := (denominator / 2)
    tax := ((numerator + rounding) / denominator)
    if (tax > gross) {
        return (-3)
    }
    return tax
}

func order_total(prices []int64, quantities []int64, discount int64) int64 {
    if (int64(len(prices)) != int64(len(quantities))) {
        return (-1)
    }
    if ((discount < 0) || (discount > 10000)) {
        return (-2)
    }
    subtotal := 0
    for i := int64(0); i < int64(len(prices)); i++ {
        if (prices[i] < 0) {
            return (-3)
        }
        if (quantities[i] <= 0) {
            return (-4)
        }
        subtotal += (prices[i] * quantities[i])
    }
    reduction := ((subtotal * discount) / 10000)
    return (subtotal - reduction)
}
