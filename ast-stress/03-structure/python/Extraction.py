def tax_inclusive(gross: int, rate: int, exempt: bool) -> int:
    if gross < 0:
        return -1
    if exempt:
        return 0
    if rate < 0:
        return -2
    denominator = 10000 + rate
    numerator = gross * rate
    rounding = denominator // 2
    tax = (numerator + rounding) // denominator
    if tax > gross:
        return -3
    return tax

def order_total(prices: list[int], quantities: list[int], discount: int) -> int:
    if len(prices) != len(quantities):
        return -1
    if discount < 0 or discount > 10000:
        return -2
    subtotal = 0
    for i in range(len(prices)):
        if prices[i] < 0:
            return -3
        if quantities[i] <= 0:
            return -4
        subtotal += prices[i] * quantities[i]
    reduction = subtotal * discount // 10000
    return subtotal - reduction
