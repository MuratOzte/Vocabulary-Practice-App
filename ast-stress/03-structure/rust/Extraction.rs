pub fn invoice(mut prices: &[i64], mut quantities: &[i64], mut discount: i64, mut rate: i64) -> i64 {
    if ((prices.len() as i64) != (quantities.len() as i64)) {
        return (-1);
    }
    let mut subtotal: i64 = 0;
    for i in 0..(prices.len() as i64) {
        if ((prices[(i) as usize] < 0) || (quantities[(i) as usize] <= 0)) {
            return (-2);
        }
        subtotal += (prices[(i) as usize] * quantities[(i) as usize]);
    }
    let mut net: i64 = (subtotal - ((subtotal * discount) / 10000));
    return (net + ((net * rate) / 10000));
}

pub fn fee_component(mut amount: i64, mut rate: i64) -> i64 {
    if (amount <= 0) {
        return 0;
    }
    return ((amount * rate) / 10000);
}
