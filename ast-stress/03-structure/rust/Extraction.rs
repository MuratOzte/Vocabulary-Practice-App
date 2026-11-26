pub fn tax_inclusive(mut gross: i64, mut rate: i64, mut exempt: bool) -> i64 {
    if (gross < 0) {
        return (-1);
    }
    if exempt {
        return 0;
    }
    if (rate < 0) {
        return (-2);
    }
    let mut denominator: i64 = (10000 + rate);
    let mut numerator: i64 = (gross * rate);
    let mut rounding: i64 = (denominator / 2);
    let mut tax: i64 = ((numerator + rounding) / denominator);
    if (tax > gross) {
        return (-3);
    }
    return tax;
}

pub fn order_total(mut prices: &[i64], mut quantities: &[i64], mut discount: i64) -> i64 {
    if ((prices.len() as i64) != (quantities.len() as i64)) {
        return (-1);
    }
    if ((discount < 0) || (discount > 10000)) {
        return (-2);
    }
    let mut subtotal: i64 = 0;
    for i in 0..(prices.len() as i64) {
        if (prices[(i) as usize] < 0) {
            return (-3);
        }
        if (quantities[(i) as usize] <= 0) {
            return (-4);
        }
        subtotal += (prices[(i) as usize] * quantities[(i) as usize]);
    }
    let mut reduction: i64 = ((subtotal * discount) / 10000);
    return (subtotal - reduction);
}
