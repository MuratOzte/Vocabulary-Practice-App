pub fn cache_lifetime(mut now: i64, mut created: i64, mut accessed: i64, mut ttl: i64, mut idle: i64) -> i64 {
    if ((created > now) || (accessed > now)) {
        return (-1);
    }
    let mut absolute: i64 = (created + ttl);
    let mut sliding: i64 = (accessed + idle);
    let mut deadline: i64 = (absolute).min(sliding);
    if (deadline <= now) {
        return 0;
    }
    let mut remaining: i64 = (deadline - now);
    if (remaining > ttl) {
        return ttl;
    }
    return remaining;
}
