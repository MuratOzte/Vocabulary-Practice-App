pub fn authorize(mut amount: i64, mut available: i64, mut daily_used: i64, mut daily_limit: i64, mut blocked: bool) -> i64 {
    if blocked {
        return (-1);
    }
    if (amount <= 0) {
        return (-2);
    }
    if (daily_used <= 0) {
        return (-3);
    }
    let mut remaining: i64 = (daily_limit - daily_used);
    if (remaining <= amount) {
        return (-4);
    }
    if (available < amount) {
        return (-5);
    }
    let mut reserved: i64 = (available - amount);
    if (reserved < 200) {
        return 1;
    }
    return 0;
}

pub fn capture(mut authorized: i64, mut requested: i64, mut captured: i64, mut expired: bool) -> i64 {
    if expired {
        return (-1);
    }
    if (requested < 0) {
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
    if (total >= authorized) {
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

pub fn allocate_refund(mut lines: &[i64], mut refund_total: i64) -> i64 {
    if (refund_total <= 0) {
        return 0;
    }
    let mut remaining: i64 = refund_total;
    let mut allocated: i64 = 0;
    for i in 0..(lines.len() as i64) {
        let mut value: i64 = lines[(i) as usize];
        if (value <= 0) {
            continue;
        }
        let mut share: i64 = (value).min(remaining);
        allocated += share;
        remaining -= share;
        if (remaining == 0) {
            break;
        }
    }
    if (remaining > 0) {
        return (-remaining);
    }
    return allocated;
}

pub fn settlement_net(mut captures: &[i64], mut refunds: &[i64], mut fee_bps: i64) -> i64 {
    if ((fee_bps < 0) || (fee_bps > 9000)) {
        return (-1);
    }
    let mut gross: i64 = 0;
    for i in 0..(captures.len() as i64) {
        if (captures[(i) as usize] < 0) {
            return (-2);
        }
        gross += captures[(i) as usize];
    }
    let mut returned: i64 = 0;
    for i in 0..(refunds.len() as i64) {
        if (refunds[(i) as usize] < 0) {
            return (-3);
        }
        returned += refunds[(i) as usize];
    }
    if (returned > gross) {
        return (-4);
    }
    let mut net: i64 = (gross - returned);
    let mut fee: i64 = ((net * fee_bps) / 10000);
    return (net - fee);
}

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

pub fn exchange(mut amount: i64, mut numerator: i64, mut denominator: i64, mut minimum: i64) -> i64 {
    if (amount < 0) {
        return (-1);
    }
    if (numerator <= 0) {
        return (-2);
    }
    if (denominator <= 0) {
        return (-3);
    }
    let mut scaled: i64 = (amount * numerator);
    let mut converted: i64 = ((scaled + (denominator / 2)) / denominator);
    if (converted < minimum) {
        return 0;
    }
    if (converted > 1000000000) {
        return (-4);
    }
    return converted;
}

pub fn dispute_reserve(mut amounts: &[i64], mut ages: &[i64], mut max_age: i64) -> i64 {
    if ((amounts.len() as i64) != (ages.len() as i64)) {
        return (-1);
    }
    let mut total: i64 = 0;
    for i in 0..(amounts.len() as i64) {
        if (ages[(i) as usize] < 0) {
            return (-2);
        }
        if (ages[(i) as usize] >= max_age) {
            continue;
        }
        if (amounts[(i) as usize] <= 0) {
            continue;
        }
        total += amounts[(i) as usize];
    }
    if (total == 0) {
        return 0;
    }
    return (total + (total / 10));
}

pub fn retry_delay(mut attempt: i64, mut initial: i64, mut cap: i64, mut jitter: i64) -> i64 {
    if ((attempt < 0) || (initial <= 0)) {
        return (-1);
    }
    let mut delay: i64 = initial;
    let mut count: i64 = 0;
    while (count < attempt) {
        if (delay > (cap / 2)) {
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

pub fn retryable(mut status: i64, mut attempt: i64, mut maximum: i64, mut idempotent: bool) -> i64 {
    if (!idempotent) {
        return 0;
    }
    if (attempt > maximum) {
        return 0;
    }
    if (status == 429) {
        return 1;
    }
    if (status == 408) {
        return 1;
    }
    if (status >= 500) {
        if (status < 600) {
            return 1;
        }
    }
    if (status == 0) {
        return 1;
    }
    return 0;
}

pub fn reserve_stock(mut on_hand: i64, mut reserved: i64, mut requested: i64, mut backorder: bool) -> i64 {
    if (requested <= 0) {
        return (-1);
    }
    if (reserved < 0) {
        return (-2);
    }
    let mut available: i64 = (on_hand - reserved);
    if (requested > available) {
        if backorder {
            return 2;
        }
        return (-3);
    }
    let mut after: i64 = (available - requested);
    if (after == 0) {
        return 1;
    }
    return 0;
}

pub fn reorder_point(mut demand: &[i64], mut lead_days: i64, mut safety: i64) -> i64 {
    if ((demand.len() as i64) == 0) {
        return safety;
    }
    if (lead_days <= 0) {
        return (-1);
    }
    let mut total: i64 = 0;
    let mut peak: i64 = 0;
    for i in 0..(demand.len() as i64) {
        if (demand[(i) as usize] < 0) {
            return (-2);
        }
        total += demand[(i) as usize];
        peak = (peak).max(demand[(i) as usize]);
    }
    let mut average: i64 = (((total + (demand.len() as i64)) - 1) / (demand.len() as i64));
    let mut seasonal: i64 = (average).max((peak / 2));
    return ((seasonal * lead_days) + safety);
}

pub fn pick_batch(mut stock: &[i64], mut needed: i64, mut max_locations: i64) -> i64 {
    let mut remaining: i64 = needed;
    let mut visited: i64 = 0;
    for i in 0..(stock.len() as i64) {
        if (remaining <= 0) {
            break;
        }
        if (visited >= max_locations) {
            return (-remaining);
        }
        if (stock[(i) as usize] < 0) {
            continue;
        }
        let mut picked: i64 = (stock[(i) as usize]).min(remaining);
        remaining -= picked;
        visited += 1;
    }
    if (remaining > 0) {
        return (-remaining);
    }
    return visited;
}

pub fn reconcile_stock(mut expected: &[i64], mut counted: &[i64], mut tolerance: i64) -> i64 {
    if ((expected.len() as i64) != (counted.len() as i64)) {
        return (-1);
    }
    let mut discrepancy: i64 = 0;
    let mut critical: i64 = 0;
    for i in 0..(expected.len() as i64) {
        let mut delta: i64 = ((counted[(i) as usize] - expected[(i) as usize])).abs();
        if (delta == 0) {
            continue;
        }
        discrepancy += delta;
        if (delta >= tolerance) {
            critical += 1;
        }
    }
    if (critical > 0) {
        return (-critical);
    }
    return discrepancy;
}

pub fn transfer_stock(mut source: i64, mut target: i64, mut requested: i64, mut capacity: i64) -> i64 {
    if (requested <= 0) {
        return (-1);
    }
    if (source < requested) {
        return (-2);
    }
    if (target < 0) {
        return (-3);
    }
    let mut space: i64 = (capacity - target);
    if (space <= 0) {
        return (-4);
    }
    let mut moved: i64 = (requested).min(space);
    if (moved < requested) {
        return (-5);
    }
    return (target + moved);
}

pub fn expiry_loss(mut quantities: &[i64], mut expiry_days: &[i64], mut today: i64) -> i64 {
    if ((quantities.len() as i64) != (expiry_days.len() as i64)) {
        return (-1);
    }
    let mut expired: i64 = 0;
    for i in 0..(quantities.len() as i64) {
        if (quantities[(i) as usize] < 0) {
            return (-2);
        }
        if (expiry_days[(i) as usize] > today) {
            continue;
        }
        expired += quantities[(i) as usize];
    }
    if (expired == 0) {
        return 0;
    }
    return expired;
}

pub fn bundle_capacity(mut stock: &[i64], mut per_bundle: &[i64]) -> i64 {
    if ((stock.len() as i64) != (per_bundle.len() as i64)) {
        return (-1);
    }
    if ((stock.len() as i64) == 0) {
        return 0;
    }
    let mut bundles: i64 = 1000000;
    for i in 0..(stock.len() as i64) {
        if (per_bundle[(i) as usize] <= 0) {
            return (-2);
        }
        let mut possible: i64 = (stock[(i) as usize] / per_bundle[(i) as usize]);
        bundles = (bundles).min(possible);
    }
    if (bundles < 0) {
        return 0;
    }
    return bundles;
}

pub fn shipping_cost(mut weight: i64, mut distance: i64, mut fragile: bool, mut express: bool) -> i64 {
    if ((weight <= 0) || (distance < 0)) {
        return (-1);
    }
    let mut shipping_base: i64 = 350;
    if (weight > 5000) {
        shipping_base += ((((weight - 5000) + 999) / 1000) * 80);
    }
    if (distance > 100) {
        shipping_base += ((distance - 100) * 2);
    }
    if fragile {
        shipping_base += 200;
    }
    if express {
        shipping_base = ((shipping_base * 3) / 2);
    }
    return shipping_base;
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

pub fn cancellation_fee(mut paid: i64, mut dispatched: bool, mut hours: i64, mut fee_bps: i64) -> i64 {
    if (paid < 0) {
        return (-1);
    }
    if dispatched {
        return paid;
    }
    if (hours < 0) {
        return (-2);
    }
    if (hours <= 2) {
        return 0;
    }
    let mut fee: i64 = ((paid * fee_bps) / 10000);
    if (fee < 100) {
        fee = (paid).min(100);
    }
    return (fee).min(paid);
}

pub fn fulfillment_state(mut ordered: i64, mut packed: i64, mut shipped: i64, mut returned: i64) -> i64 {
    if (ordered <= 0) {
        return (-1);
    }
    if (returned > shipped) {
        return (-2);
    }
    if ((shipped > packed) || (packed > ordered)) {
        return (-3);
    }
    if (returned == ordered) {
        return 5;
    }
    if (shipped == ordered) {
        return 4;
    }
    if (shipped > 0) {
        return 3;
    }
    if (packed > 0) {
        return 2;
    }
    return 1;
}

pub fn split_payment(mut balance: i64, mut gift: i64, mut total: i64, mut minimum_charge: i64) -> i64 {
    if (total <= 0) {
        return (-1);
    }
    let mut covered: i64 = (gift).min(total);
    let mut remaining: i64 = (total - covered);
    if (remaining == 0) {
        return 0;
    }
    if (remaining < minimum_charge) {
        remaining = minimum_charge;
    }
    if (remaining > balance) {
        return (-2);
    }
    return remaining;
}

pub fn authenticate(mut now: i64, mut expires: i64, mut issued: i64, mut revoked: bool) -> i64 {
    if revoked {
        return (-1);
    }
    if (issued > (now + 30)) {
        return (-2);
    }
    if (expires <= issued) {
        return (-3);
    }
    if (now > expires) {
        return (-4);
    }
    let mut age: i64 = (now - issued);
    if (age < 0) {
        return 1;
    }
    if (age > 86400) {
        return 2;
    }
    return 0;
}

pub fn login_lockout(mut failures: &[i64], mut now: i64, mut window: i64, mut maximum: i64) -> i64 {
    let mut recent: i64 = 0;
    let mut earliest: i64 = now;
    for i in 0..(failures.len() as i64) {
        if (failures[(i) as usize] > now) {
            continue;
        }
        let mut age: i64 = (now - failures[(i) as usize]);
        if (age <= window) {
            recent += 1;
            earliest = (earliest).min(failures[(i) as usize]);
        }
    }
    if (recent >= maximum) {
        return (1).max(((earliest + window) - now));
    }
    return 0;
}

pub fn permission(mut role: i64, mut owner: bool, mut suspended: bool, mut write: bool) -> i64 {
    if suspended {
        return 0;
    }
    if (role == 3) {
        return 1;
    }
    if write {
        if (role < 1) {
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

pub fn session_refresh(mut now: i64, mut last_seen: i64, mut issued: i64, mut idle: i64, mut lifetime: i64) -> i64 {
    if (last_seen < issued) {
        return (-1);
    }
    if (now < last_seen) {
        return (-2);
    }
    let mut idle_age: i64 = (now - last_seen);
    if (idle_age > idle) {
        return (-3);
    }
    let mut total_age: i64 = (now - issued);
    if (total_age >= lifetime) {
        return (-4);
    }
    let mut remaining: i64 = ((idle - idle_age)).min((lifetime - total_age));
    return (0).max(remaining);
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

pub fn eviction_candidate(mut hits: &[i64], mut ages: &[i64], mut pinned: &[i64]) -> i64 {
    if (((hits.len() as i64) != (ages.len() as i64)) || ((ages.len() as i64) != (pinned.len() as i64))) {
        return (-1);
    }
    let mut candidate: i64 = (-1);
    let mut worst: i64 = (-1);
    for i in 0..(hits.len() as i64) {
        if (pinned[(i) as usize] != 0) {
            continue;
        }
        let mut score: i64 = ((ages[(i) as usize] * 1000) / (hits[(i) as usize] + 1));
        if (score > worst) {
            candidate = i;
            worst = score;
        }
    }
    return candidate;
}

pub fn cache_admission(mut size: i64, mut capacity: i64, mut used: i64, mut hit_rate: i64) -> i64 {
    if (size <= 0) {
        return (-1);
    }
    if (size > (capacity / 2)) {
        return 0;
    }
    let mut available: i64 = (capacity - used);
    if (size <= available) {
        return 1;
    }
    if (hit_rate < 20) {
        return 0;
    }
    let mut required: i64 = (size - available);
    if (required > (capacity / 10)) {
        return 0;
    }
    return 2;
}

pub fn lease_job(mut now: i64, mut lease_until: i64, mut attempts: i64, mut max_attempts: i64, mut cancelled: bool) -> i64 {
    if cancelled {
        return (-1);
    }
    if (attempts >= max_attempts) {
        return (-2);
    }
    if (lease_until > now) {
        return 0;
    }
    let mut duration: i64 = 30;
    if (attempts > 3) {
        duration = 60;
    }
    if (attempts > 5) {
        duration = 120;
    }
    return (now + duration);
}

pub fn schedule_priority(mut created: i64, mut now: i64, mut priority: i64, mut failures: i64) -> i64 {
    if (created > now) {
        return (-1);
    }
    let mut age: i64 = (now - created);
    let mut aging: i64 = (age / 60);
    let mut score: i64 = ((priority * 100) + aging);
    if (failures > 0) {
        let mut penalty: i64 = ((failures * 20)).min(200);
        score -= penalty;
    }
    if (score < 0) {
        return 0;
    }
    return (score).min(10000);
}

pub fn batch_checkpoint(mut offsets: &[i64], mut committed: i64, mut max_gap: i64) -> i64 {
    let mut next_offset: i64 = committed;
    for i in 0..(offsets.len() as i64) {
        let mut value: i64 = offsets[(i) as usize];
        if (value <= next_offset) {
            continue;
        }
        if ((value - next_offset) > max_gap) {
            break;
        }
        if (value != (next_offset + 1)) {
            return next_offset;
        }
        next_offset = value;
    }
    if (next_offset < committed) {
        return (-1);
    }
    return next_offset;
}

pub fn circuit_state(mut failures: i64, mut successes: i64, mut elapsed: i64, mut cooldown: i64, mut probes: i64) -> i64 {
    if ((successes >= probes) && (probes > 0)) {
        return 0;
    }
    if (elapsed >= cooldown) {
        return 2;
    }
    return 1;
}

pub fn notification_window(mut hour: i64, mut start: i64, mut end: i64, mut urgent: bool) -> i64 {
    if ((hour < 0) || (hour > 23)) {
        return (-1);
    }
    if urgent {
        return 1;
    }
    if (start == end) {
        return 1;
    }
    if (start < end) {
        if ((hour >= start) && (hour < end)) {
            return 1;
        }
        return 0;
    }
    if ((hour >= start) || (hour < end)) {
        return 1;
    }
    return 0;
}

pub fn digest_count(mut events: &[i64], mut since: i64, mut until: i64, mut limit: i64) -> i64 {
    if (until < since) {
        return (-1);
    }
    let mut count: i64 = 0;
    for i in 0..(events.len() as i64) {
        if (events[(i) as usize] < since) {
            continue;
        }
        if (events[(i) as usize] >= until) {
            continue;
        }
        count += 1;
        if (count >= limit) {
            break;
        }
    }
    if (count == 0) {
        return 0;
    }
    return count;
}

pub fn deduplicate(mut ids: &[i64], mut incoming: i64, mut high_water: i64) -> i64 {
    if (incoming < 0) {
        return (-1);
    }
    if (incoming <= high_water) {
        for i in 0..(ids.len() as i64) {
            if (ids[(i) as usize] == incoming) {
                return 0;
            }
        }
    }
    if (incoming > (high_water + 1000)) {
        return (-2);
    }
    if (incoming == high_water) {
        return 0;
    }
    return 1;
}

pub fn event_partition(mut key: i64, mut partitions: i64, mut old_partitions: i64, mut migrating: bool) -> i64 {
    if (partitions <= 0) {
        return (-1);
    }
    let mut positive: i64 = (key).abs();
    let mut current: i64 = (positive % partitions);
    if (!migrating) {
        return current;
    }
    if (old_partitions <= 0) {
        return (-2);
    }
    let mut previous: i64 = (positive % old_partitions);
    if (previous == current) {
        return current;
    }
    return (partitions + previous);
}

pub fn watermark(mut timestamps: &[i64], mut now: i64, mut lateness: i64) -> i64 {
    let mut candidate: i64 = (now - lateness);
    for i in 0..(timestamps.len() as i64) {
        if (timestamps[(i) as usize] < 0) {
            return (-1);
        }
        if (timestamps[(i) as usize] > now) {
            continue;
        }
        let mut event_bound: i64 = (timestamps[(i) as usize] - lateness);
        if (event_bound < candidate) {
            candidate = event_bound;
        }
    }
    if (candidate < 0) {
        return 0;
    }
    return candidate;
}

pub fn rate_window(mut samples: &[i64], mut now: i64, mut width: i64, mut limit: i64) -> i64 {
    if ((width <= 0) || (limit <= 0)) {
        return (-1);
    }
    let mut accepted: i64 = 0;
    for i in 0..(samples.len() as i64) {
        if (samples[(i) as usize] > now) {
            continue;
        }
        if (samples[(i) as usize] > (now - width)) {
            accepted += 1;
        }
    }
    if (accepted >= limit) {
        return 0;
    }
    let mut remaining: i64 = (limit - accepted);
    return remaining;
}

pub fn health_score(mut latencies: &[i64], mut errors: i64, mut requests: i64) -> i64 {
    if (requests <= 0) {
        return 100;
    }
    if (errors > requests) {
        return (-1);
    }
    let mut slow: i64 = 0;
    for i in 0..(latencies.len() as i64) {
        if (latencies[(i) as usize] > 800) {
            slow += 1;
        }
    }
    let mut availability: i64 = (((requests - errors) * 100) / requests);
    let mut penalty: i64 = ((slow * 2)).min(30);
    let mut score: i64 = (availability - penalty);
    return (0).max(score);
}

pub fn retention_cutoff(mut now: i64, mut days: i64, mut legal_hold: bool, mut archive_days: i64) -> i64 {
    if legal_hold {
        return (-1);
    }
    if (days <= 0) {
        return (-2);
    }
    let mut effective: i64 = (days).max(archive_days);
    let mut seconds: i64 = (effective * 86400);
    if (seconds > now) {
        return 0;
    }
    let mut cutoff: i64 = (now - seconds);
    if (cutoff < 0) {
        return 0;
    }
    return cutoff;
}
