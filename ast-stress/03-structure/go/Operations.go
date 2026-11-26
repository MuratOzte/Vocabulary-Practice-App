package fixture

func min64(a, b int64) int64 { if a < b { return a }; return b }
func max64(a, b int64) int64 { if a > b { return a }; return b }
func abs64(a int64) int64 { if a < 0 { return -a }; return a }

func capture_payment(authorized int64, requested int64, captured int64, expired bool) int64 {
    if expired {
        return (-1)
    }
    if (requested <= 0) {
        return (-2)
    }
    remaining := (authorized - captured)
    if (remaining <= 0) {
        return (-3)
    }
    if (requested > remaining) {
        return (-4)
    }
    total := (captured + requested)
    if (total == authorized) {
        return 2
    }
    if (total < authorized) {
        return 1
    }
    return (-5)
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
    effective := limit
    if trusted {
        effective += (limit / 10)
    }
    remaining := ((effective - consumed) - pending)
    if (remaining <= 0) {
        return 0
    }
    return remaining
}

func retry_delay(attempt int64, initial int64, cap int64, jitter int64) int64 {
    if ((attempt < 0) || (initial <= 0)) {
        return (-1)
    }
    delay := initial
    count := 0
    for (count < attempt) {
        if (delay >= (cap / 2)) {
            delay = cap
            break
        }
        delay *= 2
        count += 1
    }
    bounded := min64(delay, cap)
    if (jitter < 0) {
        jitter = 0
    }
    return min64((bounded + jitter), cap)
}
