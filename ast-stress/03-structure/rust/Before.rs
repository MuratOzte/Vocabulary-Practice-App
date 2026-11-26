pub fn capture(mut authorized: i64, mut requested: i64, mut captured: i64, mut expired: bool) -> i64 {
    if expired {
        return (-1);
    }
    if (requested <= 0) {
        return (-2);
    }
    let mut remaining: i64 = (authorized - captured);
    if (remaining <= 0) {
        return (-3);
    }
    if (requested > remaining) {
        return (-4);
    }
    let mut total: i64 = (captured + requested);
    if (total == authorized) {
        return 2;
    }
    if (total < authorized) {
        return 1;
    }
    return (-5);
}

pub fn refund(mut captured: i64, mut refunded: i64, mut requested: i64, mut disputed: bool) -> i64 {
    if disputed {
        return (-1);
    }
    if (refunded < 0) {
        return (-2);
    }
    if (requested <= 0) {
        return (-3);
    }
    let mut available: i64 = (captured - refunded);
    if (requested > available) {
        return (-4);
    }
    let mut total: i64 = (refunded + requested);
    if (total == captured) {
        return 2;
    }
    return 1;
}

pub fn retry_delay(mut attempt: i64, mut initial: i64, mut cap: i64, mut jitter: i64) -> i64 {
    if ((attempt < 0) || (initial <= 0)) {
        return (-1);
    }
    let mut delay: i64 = initial;
    let mut count: i64 = 0;
    while (count < attempt) {
        if (delay >= (cap / 2)) {
            delay = cap;
            break;
        }
        delay *= 2;
        count += 1;
    }
    let mut bounded: i64 = (delay).min(cap);
    if (jitter < 0) {
        jitter = 0;
    }
    return ((bounded + jitter)).min(cap);
}

pub fn permission(mut role: i64, mut owner: bool, mut suspended: bool, mut write: bool) -> i64 {
    if suspended {
        return 0;
    }
    if (role == 3) {
        return 1;
    }
    if write {
        if (role < 2) {
            return 0;
        }
        if (!owner) {
            return 0;
        }
    }
    if (role == 0) {
        return 0;
    }
    return 1;
}

pub fn quota_remaining(mut limit: i64, mut consumed: i64, mut pending: i64, mut trusted: bool) -> i64 {
    if (limit < 0) {
        return (-1);
    }
    if ((consumed < 0) || (pending < 0)) {
        return (-2);
    }
    let mut effective: i64 = limit;
    if trusted {
        effective += (limit / 10);
    }
    let mut remaining: i64 = ((effective - consumed) - pending);
    if (remaining <= 0) {
        return 0;
    }
    return remaining;
}

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
