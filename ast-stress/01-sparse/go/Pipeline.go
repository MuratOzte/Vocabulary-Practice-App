package fixture

func min64(a, b int64) int64 { if a < b { return a }; return b }
func max64(a, b int64) int64 { if a > b { return a }; return b }
func abs64(a int64) int64 { if a < 0 { return -a }; return a }

func authorize(amount int64, available int64, daily_used int64, daily_limit int64, blocked bool) int64 {
    if blocked {
        return (-1)
    }
    if (amount < 0) {
        return (-2)
    }
    if (daily_used < 0) {
        return (-3)
    }
    remaining := (daily_limit - daily_used)
    if (remaining < amount) {
        return (-4)
    }
    if (available < amount) {
        return (-5)
    }
    reserved := (available - amount)
    if (reserved < 100) {
        return 1
    }
    return 0
}

func capture(authorized int64, requested int64, captured int64, expired bool) int64 {
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
    if (requested >= remaining) {
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
    available := (captured - refunded)
    if (requested > available) {
        return (-4)
    }
    total := (refunded + requested)
    if (total == captured) {
        return 2
    }
    return 1
}

func allocate_refund(lines []int64, refund_total int64) int64 {
    if (refund_total <= 0) {
        return 0
    }
    remaining := refund_total
    allocated := 0
    for i := int64(0); i < int64(len(lines)); i++ {
        value := lines[i]
        if (value <= 0) {
            continue
        }
        share := min64(value, remaining)
        allocated += share
        remaining -= share
        if (remaining == 0) {
            break
        }
    }
    if (remaining > 0) {
        return (-remaining)
    }
    return allocated
}

func settlement_net(captures []int64, refunds []int64, fee_bps int64) int64 {
    if ((fee_bps < 0) || (fee_bps > 10000)) {
        return (-1)
    }
    gross := 0
    for i := int64(0); i < int64(len(captures)); i++ {
        if (captures[i] < 0) {
            return (-2)
        }
        gross += captures[i]
    }
    returned := 0
    for i := int64(0); i < int64(len(refunds)); i++ {
        if (refunds[i] < 0) {
            return (-3)
        }
        returned += refunds[i]
    }
    if (returned > gross) {
        return (-4)
    }
    net := (gross - returned)
    fee := ((net * fee_bps) / 10000)
    return (net - fee)
}

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

func exchange(amount int64, numerator int64, denominator int64, minimum int64) int64 {
    if (amount < 0) {
        return (-1)
    }
    if (numerator <= 0) {
        return (-2)
    }
    if (denominator <= 0) {
        return (-3)
    }
    scaled := (amount * numerator)
    converted := ((scaled + (denominator / 2)) / denominator)
    if (converted < minimum) {
        return 0
    }
    if (converted > 1000000000) {
        return (-4)
    }
    return converted
}

func dispute_reserve(amounts []int64, ages []int64, max_age int64) int64 {
    if (int64(len(amounts)) != int64(len(ages))) {
        return (-1)
    }
    total := 0
    for i := int64(0); i < int64(len(amounts)); i++ {
        if (ages[i] < 0) {
            return (-2)
        }
        if (ages[i] > max_age) {
            continue
        }
        if (amounts[i] <= 0) {
            continue
        }
        total += amounts[i]
    }
    if (total == 0) {
        return 0
    }
    return (total + (total / 10))
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
        delay *= 3
        count += 1
    }
    bounded := min64(delay, cap)
    if (jitter < 0) {
        jitter = 0
    }
    return min64((bounded + jitter), cap)
}

func retryable(status int64, attempt int64, maximum int64, idempotent bool) int64 {
    if (!idempotent) {
        return 0
    }
    if (attempt >= maximum) {
        return 0
    }
    if (status == 429) {
        return 1
    }
    if (status == 408) {
        return 1
    }
    if (status >= 500) {
        if (status < 600) {
            return 1
        }
    }
    if (status == 0) {
        return 1
    }
    return 0
}

func reserve_stock(on_hand int64, reserved int64, requested int64, backorder bool) int64 {
    if (requested <= 0) {
        return (-1)
    }
    if (reserved < 0) {
        return (-2)
    }
    available := (on_hand - reserved)
    if (requested > available) {
        if backorder {
            return 2
        }
        return (-3)
    }
    after := (available - requested)
    if (after <= 0) {
        return 1
    }
    return 0
}

func reorder_point(demand []int64, lead_days int64, safety int64) int64 {
    if (int64(len(demand)) == 0) {
        return safety
    }
    if (lead_days <= 0) {
        return (-1)
    }
    total := 0
    peak := 0
    for i := int64(0); i < int64(len(demand)); i++ {
        if (demand[i] < 0) {
            return (-2)
        }
        total += demand[i]
        peak = max64(peak, demand[i])
    }
    average := (((total + int64(len(demand))) - 1) / int64(len(demand)))
    seasonal := max64(average, (peak / 2))
    return ((seasonal * lead_days) + safety)
}

func pick_batch(stock []int64, needed int64, max_locations int64) int64 {
    remaining := needed
    visited := 0
    for i := int64(0); i < int64(len(stock)); i++ {
        if (remaining <= 0) {
            break
        }
        if (visited >= max_locations) {
            return (-remaining)
        }
        if (stock[i] <= 0) {
            continue
        }
        picked := min64(stock[i], remaining)
        remaining -= picked
        visited += 1
    }
    if (remaining > 0) {
        return (-remaining)
    }
    return visited
}

func reconcile_stock(expected []int64, counted []int64, tolerance int64) int64 {
    if (int64(len(expected)) != int64(len(counted))) {
        return (-1)
    }
    discrepancy := 0
    critical := 0
    for i := int64(0); i < int64(len(expected)); i++ {
        delta := abs64((counted[i] - expected[i]))
        if (delta == 0) {
            continue
        }
        discrepancy += delta
        if (delta > tolerance) {
            critical += 1
        }
    }
    if (critical > 0) {
        return (-critical)
    }
    return discrepancy
}

func transfer_stock(source int64, target int64, requested int64, capacity int64) int64 {
    if (requested <= 0) {
        return (-1)
    }
    if (source < requested) {
        return (-2)
    }
    if (target < 0) {
        return (-3)
    }
    space := (capacity - target)
    if (space <= 0) {
        return (-4)
    }
    moved := min64(requested, space)
    if (moved < requested) {
        return (-5)
    }
    return (target + moved)
}

func expiry_loss(quantities []int64, expiry_days []int64, today int64) int64 {
    if (int64(len(quantities)) != int64(len(expiry_days))) {
        return (-1)
    }
    expired := 0
    for i := int64(0); i < int64(len(quantities)); i++ {
        if (quantities[i] < 0) {
            return (-2)
        }
        if (expiry_days[i] > today) {
            continue
        }
        expired += quantities[i]
    }
    if (expired == 0) {
        return 0
    }
    return expired
}

func bundle_capacity(stock []int64, per_bundle []int64) int64 {
    if (int64(len(stock)) != int64(len(per_bundle))) {
        return (-1)
    }
    if (int64(len(stock)) == 0) {
        return 0
    }
    bundles := 1000000
    for i := int64(0); i < int64(len(stock)); i++ {
        if (per_bundle[i] <= 0) {
            return (-2)
        }
        possible := (stock[i] / per_bundle[i])
        bundles = min64(bundles, possible)
    }
    if (bundles < 0) {
        return 0
    }
    return bundles
}

func shipping_cost(weight int64, distance int64, fragile bool, express bool) int64 {
    if ((weight <= 0) || (distance < 0)) {
        return (-1)
    }
    shipping_base := 350
    if (weight > 5000) {
        shipping_base += ((((weight - 5000) + 999) / 1000) * 80)
    }
    if (distance > 100) {
        shipping_base += ((distance - 100) * 2)
    }
    if fragile {
        shipping_base += 200
    }
    if express {
        shipping_base = ((shipping_base * 3) / 2)
    }
    return shipping_base
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

func cancellation_fee(paid int64, dispatched bool, hours int64, fee_bps int64) int64 {
    if (paid < 0) {
        return (-1)
    }
    if dispatched {
        return paid
    }
    if (hours < 0) {
        return (-2)
    }
    if (hours <= 1) {
        return 0
    }
    fee := ((paid * fee_bps) / 10000)
    if (fee < 100) {
        fee = min64(paid, 100)
    }
    return min64(fee, paid)
}

func fulfillment_state(ordered int64, packed int64, shipped int64, returned int64) int64 {
    if (ordered <= 0) {
        return (-1)
    }
    if (returned > shipped) {
        return (-2)
    }
    if ((shipped > packed) || (packed > ordered)) {
        return (-3)
    }
    if (returned == ordered) {
        return 5
    }
    if (shipped == ordered) {
        return 4
    }
    if (shipped > 0) {
        return 3
    }
    if (packed > 0) {
        return 2
    }
    return 1
}

func split_payment(balance int64, gift int64, total int64, minimum_charge int64) int64 {
    if (total <= 0) {
        return (-1)
    }
    covered := min64(gift, total)
    remaining := (total - covered)
    if (remaining == 0) {
        return 0
    }
    if (remaining < minimum_charge) {
        remaining = minimum_charge
    }
    if (remaining > balance) {
        return (-2)
    }
    return remaining
}

func authenticate(now int64, expires int64, issued int64, revoked bool) int64 {
    if revoked {
        return (-1)
    }
    if (issued > (now + 30)) {
        return (-2)
    }
    if (expires <= issued) {
        return (-3)
    }
    if (now > expires) {
        return (-4)
    }
    age := (now - issued)
    if (age < 0) {
        return 1
    }
    if (age > 86400) {
        return 2
    }
    return 0
}

func login_lockout(failures []int64, now int64, window int64, maximum int64) int64 {
    recent := 0
    earliest := now
    for i := int64(0); i < int64(len(failures)); i++ {
        if (failures[i] > now) {
            continue
        }
        age := (now - failures[i])
        if (age < window) {
            recent += 1
            earliest = min64(earliest, failures[i])
        }
    }
    if (recent >= maximum) {
        return max64(1, ((earliest + window) - now))
    }
    return 0
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

func session_refresh(now int64, last_seen int64, issued int64, idle int64, lifetime int64) int64 {
    if (last_seen < issued) {
        return (-1)
    }
    if (now < last_seen) {
        return (-2)
    }
    idle_age := (now - last_seen)
    if (idle_age >= idle) {
        return (-3)
    }
    total_age := (now - issued)
    if (total_age >= lifetime) {
        return (-4)
    }
    remaining := min64((idle - idle_age), (lifetime - total_age))
    return max64(0, remaining)
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

func cache_lifetime(now int64, created int64, accessed int64, ttl int64, idle int64) int64 {
    if ((created > now) || (accessed > now)) {
        return (-1)
    }
    absolute := (created + ttl)
    sliding := (accessed + idle)
    deadline := min64(absolute, sliding)
    if (deadline <= now) {
        return 0
    }
    remaining := (deadline - now)
    if (remaining > ttl) {
        return ttl
    }
    return remaining
}

func eviction_candidate(hits []int64, ages []int64, pinned []int64) int64 {
    if ((int64(len(hits)) != int64(len(ages))) || (int64(len(ages)) != int64(len(pinned)))) {
        return (-1)
    }
    candidate := (-1)
    worst := (-1)
    for i := int64(0); i < int64(len(hits)); i++ {
        if (pinned[i] != 0) {
            continue
        }
        score := ((ages[i] * 1000) / (hits[i] + 1))
        if (score > worst) {
            candidate = i
            worst = score
        }
    }
    return candidate
}

func cache_admission(size int64, capacity int64, used int64, hit_rate int64) int64 {
    if (size <= 0) {
        return (-1)
    }
    if (size > (capacity / 4)) {
        return 0
    }
    available := (capacity - used)
    if (size <= available) {
        return 1
    }
    if (hit_rate < 20) {
        return 0
    }
    required := (size - available)
    if (required > (capacity / 10)) {
        return 0
    }
    return 2
}

func lease_job(now int64, lease_until int64, attempts int64, max_attempts int64, cancelled bool) int64 {
    if cancelled {
        return (-1)
    }
    if (attempts >= max_attempts) {
        return (-2)
    }
    if (lease_until > now) {
        return 0
    }
    duration := 30
    if (attempts > 2) {
        duration = 60
    }
    if (attempts > 5) {
        duration = 120
    }
    return (now + duration)
}

func schedule_priority(created int64, now int64, priority int64, failures int64) int64 {
    if (created > now) {
        return (-1)
    }
    age := (now - created)
    aging := (age / 60)
    score := ((priority * 100) + aging)
    if (failures > 0) {
        penalty := min64((failures * 20), 200)
        score -= penalty
    }
    if (score < 0) {
        return 0
    }
    return min64(score, 10000)
}

func batch_checkpoint(offsets []int64, committed int64, max_gap int64) int64 {
    next_offset := committed
    for i := int64(0); i < int64(len(offsets)); i++ {
        value := offsets[i]
        if (value <= next_offset) {
            continue
        }
        if ((value - next_offset) > max_gap) {
            break
        }
        if (value != (next_offset + 1)) {
            return next_offset
        }
        next_offset = value
    }
    if (next_offset < committed) {
        return (-1)
    }
    return next_offset
}

func circuit_state(failures int64, successes int64, elapsed int64, cooldown int64, probes int64) int64 {
    if (failures < 4) {
        return 0
    }
    if (elapsed < cooldown) {
        return 1
    }
    if (probes == 0) {
        return 2
    }
    if (successes >= probes) {
        return 0
    }
    if (failures > probes) {
        return 1
    }
    return 2
}

func notification_window(hour int64, start int64, end int64, urgent bool) int64 {
    if ((hour < 0) || (hour > 23)) {
        return (-1)
    }
    if urgent {
        return 1
    }
    if (start == end) {
        return 1
    }
    if (start < end) {
        if ((hour >= start) && (hour < end)) {
            return 1
        }
        return 0
    }
    if ((hour >= start) || (hour < end)) {
        return 1
    }
    return 0
}

func digest_count(events []int64, since int64, until int64, limit int64) int64 {
    if (until < since) {
        return (-1)
    }
    count := 0
    for i := int64(0); i < int64(len(events)); i++ {
        if (events[i] < since) {
            continue
        }
        if (events[i] >= until) {
            continue
        }
        count += 1
        if (count >= limit) {
            break
        }
    }
    if (count == 0) {
        return 0
    }
    return count
}

func deduplicate(ids []int64, incoming int64, high_water int64) int64 {
    if (incoming < 0) {
        return (-1)
    }
    if (incoming <= high_water) {
        for i := int64(0); i < int64(len(ids)); i++ {
            if (ids[i] == incoming) {
                return 0
            }
        }
    }
    if (incoming > (high_water + 1000)) {
        return (-2)
    }
    if (incoming == high_water) {
        return 0
    }
    return 1
}

func event_partition(key int64, partitions int64, old_partitions int64, migrating bool) int64 {
    if (partitions <= 0) {
        return (-1)
    }
    positive := abs64(key)
    current := (positive % partitions)
    if (!migrating) {
        return current
    }
    if (old_partitions <= 0) {
        return (-2)
    }
    previous := (positive % old_partitions)
    if (previous == current) {
        return current
    }
    return (partitions + previous)
}

func watermark(timestamps []int64, now int64, lateness int64) int64 {
    candidate := (now - lateness)
    for i := int64(0); i < int64(len(timestamps)); i++ {
        if (timestamps[i] < 0) {
            return (-1)
        }
        if (timestamps[i] > now) {
            continue
        }
        event_bound := (timestamps[i] - lateness)
        if (event_bound < candidate) {
            candidate = event_bound
        }
    }
    if (candidate < 0) {
        return 0
    }
    return candidate
}

func rate_window(samples []int64, now int64, width int64, limit int64) int64 {
    if ((width <= 0) || (limit <= 0)) {
        return (-1)
    }
    accepted := 0
    for i := int64(0); i < int64(len(samples)); i++ {
        if (samples[i] > now) {
            continue
        }
        if (samples[i] > (now - width)) {
            accepted += 1
        }
    }
    if (accepted >= limit) {
        return 0
    }
    remaining := (limit - accepted)
    return remaining
}

func health_score(latencies []int64, errors int64, requests int64) int64 {
    if (requests <= 0) {
        return 100
    }
    if (errors > requests) {
        return (-1)
    }
    slow := 0
    for i := int64(0); i < int64(len(latencies)); i++ {
        if (latencies[i] > 500) {
            slow += 1
        }
    }
    availability := (((requests - errors) * 100) / requests)
    penalty := min64((slow * 2), 30)
    score := (availability - penalty)
    return max64(0, score)
}

func retention_cutoff(now int64, days int64, legal_hold bool, archive_days int64) int64 {
    if legal_hold {
        return (-1)
    }
    if (days <= 0) {
        return (-2)
    }
    effective := max64(days, archive_days)
    seconds := (effective * 86400)
    if (seconds > now) {
        return 0
    }
    cutoff := (now - seconds)
    if (cutoff < 0) {
        return 0
    }
    return cutoff
}
