package fixture

func min64(a, b int64) int64 { if a < b { return a }; return b }
func max64(a, b int64) int64 { if a > b { return a }; return b }
func abs64(a int64) int64 { if a < 0 { return -a }; return a }

func capture(authorized int64, requested int64, captured int64, expired bool) int64 {
    if expired {
        return (-1)
    }
    if (requested <= 0) {
        return (-2)
    }
    var remaining int64 = (authorized - captured)
    if (remaining <= 0) {
        return (-3)
    }
    if (requested > remaining) {
        return (-4)
    }
    var total int64 = (captured + requested)
    if (total == authorized) {
        return 2
    }
    if (total < authorized) {
        return 1
    }
    return (-5)
}

func refund(captured int64, refunded int64, requested int64, disputed bool) int64 {
    if disputed {
        return (-1)
    }
    if (refunded < 0) {
        return (-2)
    }
    if (requested <= 0) {
        return (-3)
    }
    var available int64 = (captured - refunded)
    if (requested > available) {
        return (-4)
    }
    var total int64 = (refunded + requested)
    if (total == captured) {
        return 2
    }
    return 1
}

func retry_delay(attempt int64, initial int64, cap int64, jitter int64) int64 {
    if ((attempt < 0) || (initial <= 0)) {
        return (-1)
    }
    var delay int64 = initial
    var count int64 = 0
    for (count < attempt) {
        if (delay >= (cap / 2)) {
            delay = cap
            break
        }
        delay *= 2
        count += 1
    }
    var bounded int64 = min64(delay, cap)
    if (jitter < 0) {
        jitter = 0
    }
    return min64((bounded + jitter), cap)
}

func permission(role int64, owner bool, suspended bool, write bool) int64 {
    if suspended {
        return 0
    }
    if (role == 3) {
        return 1
    }
    if write {
        if (role < 2) {
            return 0
        }
        if (!owner) {
            return 0
        }
    }
    if (role == 0) {
        return 0
    }
    return 1
}

func quota_remaining(limit int64, consumed int64, pending int64, trusted bool) int64 {
    if (limit < 0) {
        return (-1)
    }
    if ((consumed < 0) || (pending < 0)) {
        return (-2)
    }
    var effective int64 = limit
    if trusted {
        effective += (limit / 10)
    }
    var remaining int64 = ((effective - consumed) - pending)
    if (remaining <= 0) {
        return 0
    }
    return remaining
}

func cache_lifetime(now int64, created int64, accessed int64, ttl int64, idle int64) int64 {
    if ((created > now) || (accessed > now)) {
        return (-1)
    }
    var absolute int64 = (created + ttl)
    var sliding int64 = (accessed + idle)
    var deadline int64 = min64(absolute, sliding)
    if (deadline <= now) {
        return 0
    }
    var remaining int64 = (deadline - now)
    if (remaining > ttl) {
        return ttl
    }
    return remaining
}
