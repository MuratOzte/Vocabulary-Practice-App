pub fn route_domestic(mut amount: i64, mut limit: i64) -> i64 {
    if (amount <= 0) {
        return (-1);
    }
    if (amount > limit) {
        return (-2);
    }
    return (amount - (amount / 100));
}

pub fn route_international(mut amount: i64, mut limit: i64) -> i64 {
    if (amount <= 0) {
        return (-1);
    }
    if (amount > limit) {
        return (-2);
    }
    return (amount - (amount / 100));
}
