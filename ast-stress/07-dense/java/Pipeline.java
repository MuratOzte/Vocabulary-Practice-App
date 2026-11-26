class Pipeline {
    static long authorize(long amount, long available, long daily_used, long daily_limit, boolean blocked) {
        if (blocked) {
            return (-1);
        }
        if ((amount <= 0)) {
            return (-2);
        }
        if ((daily_used <= 0)) {
            return (-3);
        }
        long remaining = (daily_limit - daily_used);
        if ((remaining <= amount)) {
            return (-4);
        }
        if ((available < amount)) {
            return (-5);
        }
        long reserved = (available - amount);
        if ((reserved < 200)) {
            return 1;
        }
        return 0;
    }

    static long capture(long authorized, long requested, long captured, boolean expired) {
        if (expired) {
            return (-1);
        }
        if ((requested < 0)) {
            return (-2);
        }
        long remaining = (authorized - captured);
        if ((remaining <= 0)) {
            return (-3);
        }
        if ((requested > remaining)) {
            return (-4);
        }
        long total = (captured + requested);
        if ((total >= authorized)) {
            return 2;
        }
        if ((total < authorized)) {
            return 1;
        }
        return (-5);
    }

    static long refund(long captured, long refunded, long requested, boolean disputed) {
        if (disputed) {
            return (-1);
        }
        if ((refunded < 0)) {
            return (-2);
        }
        if ((requested <= 0)) {
            return (-3);
        }
        long available = (captured - refunded);
        if ((requested > available)) {
            return (-4);
        }
        long total = (refunded + requested);
        if ((total == captured)) {
            return 2;
        }
        return 1;
    }

    static long allocate_refund(long[] lines, long refund_total) {
        if ((refund_total <= 0)) {
            return 0;
        }
        long remaining = refund_total;
        long allocated = 0;
        for (long i = 0; i < lines.length; i++) {
            long value = lines[(int)(i)];
            if ((value <= 0)) {
                continue;
            }
            long share = Math.min(value, remaining);
            allocated += share;
            remaining -= share;
            if ((remaining == 0)) {
                break;
            }
        }
        if ((remaining > 0)) {
            return (-remaining);
        }
        return allocated;
    }

    static long settlement_net(long[] captures, long[] refunds, long fee_bps) {
        if (((fee_bps < 0) || (fee_bps > 9000))) {
            return (-1);
        }
        long gross = 0;
        for (long i = 0; i < captures.length; i++) {
            if ((captures[(int)(i)] < 0)) {
                return (-2);
            }
            gross += captures[(int)(i)];
        }
        long returned = 0;
        for (long i = 0; i < refunds.length; i++) {
            if ((refunds[(int)(i)] < 0)) {
                return (-3);
            }
            returned += refunds[(int)(i)];
        }
        if ((returned > gross)) {
            return (-4);
        }
        long net = (gross - returned);
        long fee = ((net * fee_bps) / 10000);
        return (net - fee);
    }

    static long tax_inclusive(long gross, long rate, boolean exempt) {
        if ((gross < 0)) {
            return (-1);
        }
        if (exempt) {
            return 0;
        }
        if ((rate < 0)) {
            return (-2);
        }
        long denominator = (10000 + rate);
        long numerator = (gross * rate);
        long rounding = (denominator / 2);
        long tax = ((numerator + rounding) / denominator);
        if ((tax > gross)) {
            return (-3);
        }
        return tax;
    }

    static long exchange(long amount, long numerator, long denominator, long minimum) {
        if ((amount < 0)) {
            return (-1);
        }
        if ((numerator <= 0)) {
            return (-2);
        }
        if ((denominator <= 0)) {
            return (-3);
        }
        long scaled = (amount * numerator);
        long converted = ((scaled + (denominator / 2)) / denominator);
        if ((converted < minimum)) {
            return 0;
        }
        if ((converted > 1000000000)) {
            return (-4);
        }
        return converted;
    }

    static long dispute_reserve(long[] amounts, long[] ages, long max_age) {
        if ((amounts.length != ages.length)) {
            return (-1);
        }
        long total = 0;
        for (long i = 0; i < amounts.length; i++) {
            if ((ages[(int)(i)] < 0)) {
                return (-2);
            }
            if ((ages[(int)(i)] >= max_age)) {
                continue;
            }
            if ((amounts[(int)(i)] <= 0)) {
                continue;
            }
            total += amounts[(int)(i)];
        }
        if ((total == 0)) {
            return 0;
        }
        return (total + (total / 10));
    }

    static long retry_delay(long attempt, long initial, long cap, long jitter) {
        if (((attempt < 0) || (initial <= 0))) {
            return (-1);
        }
        long delay = initial;
        long count = 0;
        while ((count < attempt)) {
            if ((delay > (cap / 2))) {
                delay = cap;
                break;
            }
            delay *= 2;
            count += 1;
        }
        long bounded = Math.min(delay, cap);
        if ((jitter < 0)) {
            jitter = 0;
        }
        return Math.min((bounded + jitter), cap);
    }

    static long retryable(long status, long attempt, long maximum, boolean idempotent) {
        if ((!idempotent)) {
            return 0;
        }
        if ((attempt > maximum)) {
            return 0;
        }
        if ((status == 429)) {
            return 1;
        }
        if ((status == 408)) {
            return 1;
        }
        if ((status >= 500)) {
            if ((status < 600)) {
                return 1;
            }
        }
        if ((status == 0)) {
            return 1;
        }
        return 0;
    }

    static long reserve_stock(long on_hand, long reserved, long requested, boolean backorder) {
        if ((requested <= 0)) {
            return (-1);
        }
        if ((reserved < 0)) {
            return (-2);
        }
        long available = (on_hand - reserved);
        if ((requested > available)) {
            if (backorder) {
                return 2;
            }
            return (-3);
        }
        long after = (available - requested);
        if ((after == 0)) {
            return 1;
        }
        return 0;
    }

    static long reorder_point(long[] demand, long lead_days, long safety) {
        if ((demand.length == 0)) {
            return safety;
        }
        if ((lead_days <= 0)) {
            return (-1);
        }
        long total = 0;
        long peak = 0;
        for (long i = 0; i < demand.length; i++) {
            if ((demand[(int)(i)] < 0)) {
                return (-2);
            }
            total += demand[(int)(i)];
            peak = Math.max(peak, demand[(int)(i)]);
        }
        long average = (((total + demand.length) - 1) / demand.length);
        long seasonal = Math.max(average, (peak / 2));
        return ((seasonal * lead_days) + safety);
    }

    static long pick_batch(long[] stock, long needed, long max_locations) {
        long remaining = needed;
        long visited = 0;
        for (long i = 0; i < stock.length; i++) {
            if ((remaining <= 0)) {
                break;
            }
            if ((visited >= max_locations)) {
                return (-remaining);
            }
            if ((stock[(int)(i)] < 0)) {
                continue;
            }
            long picked = Math.min(stock[(int)(i)], remaining);
            remaining -= picked;
            visited += 1;
        }
        if ((remaining > 0)) {
            return (-remaining);
        }
        return visited;
    }

    static long reconcile_stock(long[] expected, long[] counted, long tolerance) {
        if ((expected.length != counted.length)) {
            return (-1);
        }
        long discrepancy = 0;
        long critical = 0;
        for (long i = 0; i < expected.length; i++) {
            long delta = Math.abs((counted[(int)(i)] - expected[(int)(i)]));
            if ((delta == 0)) {
                continue;
            }
            discrepancy += delta;
            if ((delta >= tolerance)) {
                critical += 1;
            }
        }
        if ((critical > 0)) {
            return (-critical);
        }
        return discrepancy;
    }

    static long transfer_stock(long source, long target, long requested, long capacity) {
        if ((requested <= 0)) {
            return (-1);
        }
        if ((source < requested)) {
            return (-2);
        }
        if ((target < 0)) {
            return (-3);
        }
        long space = (capacity - target);
        if ((space <= 0)) {
            return (-4);
        }
        long moved = Math.min(requested, space);
        if ((moved < requested)) {
            return (-5);
        }
        return (target + moved);
    }

    static long expiry_loss(long[] quantities, long[] expiry_days, long today) {
        if ((quantities.length != expiry_days.length)) {
            return (-1);
        }
        long expired = 0;
        for (long i = 0; i < quantities.length; i++) {
            if ((quantities[(int)(i)] < 0)) {
                return (-2);
            }
            if ((expiry_days[(int)(i)] > today)) {
                continue;
            }
            expired += quantities[(int)(i)];
        }
        if ((expired == 0)) {
            return 0;
        }
        return expired;
    }

    static long bundle_capacity(long[] stock, long[] per_bundle) {
        if ((stock.length != per_bundle.length)) {
            return (-1);
        }
        if ((stock.length == 0)) {
            return 0;
        }
        long bundles = 1000000;
        for (long i = 0; i < stock.length; i++) {
            if ((per_bundle[(int)(i)] <= 0)) {
                return (-2);
            }
            long possible = (stock[(int)(i)] / per_bundle[(int)(i)]);
            bundles = Math.min(bundles, possible);
        }
        if ((bundles < 0)) {
            return 0;
        }
        return bundles;
    }

    static long shipping_cost(long weight, long distance, boolean fragile, boolean express) {
        if (((weight <= 0) || (distance < 0))) {
            return (-1);
        }
        long shipping_base = 350;
        if ((weight > 5000)) {
            shipping_base += ((((weight - 5000) + 999) / 1000) * 80);
        }
        if ((distance > 100)) {
            shipping_base += ((distance - 100) * 2);
        }
        if (fragile) {
            shipping_base += 200;
        }
        if (express) {
            shipping_base = ((shipping_base * 3) / 2);
        }
        return shipping_base;
    }

    static long order_total(long[] prices, long[] quantities, long discount) {
        if ((prices.length != quantities.length)) {
            return (-1);
        }
        if (((discount < 0) || (discount > 10000))) {
            return (-2);
        }
        long subtotal = 0;
        for (long i = 0; i < prices.length; i++) {
            if ((prices[(int)(i)] < 0)) {
                return (-3);
            }
            if ((quantities[(int)(i)] <= 0)) {
                return (-4);
            }
            subtotal += (prices[(int)(i)] * quantities[(int)(i)]);
        }
        long reduction = ((subtotal * discount) / 10000);
        return (subtotal - reduction);
    }

    static long cancellation_fee(long paid, boolean dispatched, long hours, long fee_bps) {
        if ((paid < 0)) {
            return (-1);
        }
        if (dispatched) {
            return paid;
        }
        if ((hours < 0)) {
            return (-2);
        }
        if ((hours <= 2)) {
            return 0;
        }
        long fee = ((paid * fee_bps) / 10000);
        if ((fee < 100)) {
            fee = Math.min(paid, 100);
        }
        return Math.min(fee, paid);
    }

    static long fulfillment_state(long ordered, long packed, long shipped, long returned) {
        if ((ordered <= 0)) {
            return (-1);
        }
        if ((returned > shipped)) {
            return (-2);
        }
        if (((shipped > packed) || (packed > ordered))) {
            return (-3);
        }
        if ((returned == ordered)) {
            return 5;
        }
        if ((shipped == ordered)) {
            return 4;
        }
        if ((shipped > 0)) {
            return 3;
        }
        if ((packed > 0)) {
            return 2;
        }
        return 1;
    }

    static long split_payment(long balance, long gift, long total, long minimum_charge) {
        if ((total <= 0)) {
            return (-1);
        }
        long covered = Math.min(gift, total);
        long remaining = (total - covered);
        if ((remaining == 0)) {
            return 0;
        }
        if ((remaining < minimum_charge)) {
            remaining = minimum_charge;
        }
        if ((remaining > balance)) {
            return (-2);
        }
        return remaining;
    }

    static long authenticate(long now, long expires, long issued, boolean revoked) {
        if (revoked) {
            return (-1);
        }
        if ((issued > (now + 30))) {
            return (-2);
        }
        if ((expires <= issued)) {
            return (-3);
        }
        if ((now > expires)) {
            return (-4);
        }
        long age = (now - issued);
        if ((age < 0)) {
            return 1;
        }
        if ((age > 86400)) {
            return 2;
        }
        return 0;
    }

    static long login_lockout(long[] failures, long now, long window, long maximum) {
        long recent = 0;
        long earliest = now;
        for (long i = 0; i < failures.length; i++) {
            if ((failures[(int)(i)] > now)) {
                continue;
            }
            long age = (now - failures[(int)(i)]);
            if ((age <= window)) {
                recent += 1;
                earliest = Math.min(earliest, failures[(int)(i)]);
            }
        }
        if ((recent >= maximum)) {
            return Math.max(1, ((earliest + window) - now));
        }
        return 0;
    }

    static long permission(long role, boolean owner, boolean suspended, boolean write) {
        if (suspended) {
            return 0;
        }
        if ((role == 3)) {
            return 1;
        }
        if (write) {
            if ((role < 1)) {
                return 0;
            }
            if ((!owner)) {
                return 0;
            }
        }
        if ((role == 0)) {
            return 0;
        }
        return 1;
    }

    static long session_refresh(long now, long last_seen, long issued, long idle, long lifetime) {
        if ((last_seen < issued)) {
            return (-1);
        }
        if ((now < last_seen)) {
            return (-2);
        }
        long idle_age = (now - last_seen);
        if ((idle_age > idle)) {
            return (-3);
        }
        long total_age = (now - issued);
        if ((total_age >= lifetime)) {
            return (-4);
        }
        long remaining = Math.min((idle - idle_age), (lifetime - total_age));
        return Math.max(0, remaining);
    }

    static long quota_remaining(long limit, long consumed, long pending, boolean trusted) {
        if ((limit < 0)) {
            return (-1);
        }
        if (((consumed < 0) || (pending < 0))) {
            return (-2);
        }
        long effective = limit;
        if (trusted) {
            effective += (limit / 10);
        }
        long remaining = ((effective - consumed) - pending);
        if ((remaining <= 0)) {
            return 0;
        }
        return remaining;
    }

    static long cache_lifetime(long now, long created, long accessed, long ttl, long idle) {
        if (((created > now) || (accessed > now))) {
            return (-1);
        }
        long absolute = (created + ttl);
        long sliding = (accessed + idle);
        long deadline = Math.min(absolute, sliding);
        if ((deadline <= now)) {
            return 0;
        }
        long remaining = (deadline - now);
        if ((remaining > ttl)) {
            return ttl;
        }
        return remaining;
    }

    static long eviction_candidate(long[] hits, long[] ages, long[] pinned) {
        if (((hits.length != ages.length) || (ages.length != pinned.length))) {
            return (-1);
        }
        long candidate = (-1);
        long worst = (-1);
        for (long i = 0; i < hits.length; i++) {
            if ((pinned[(int)(i)] != 0)) {
                continue;
            }
            long score = ((ages[(int)(i)] * 1000) / (hits[(int)(i)] + 1));
            if ((score > worst)) {
                candidate = i;
                worst = score;
            }
        }
        return candidate;
    }

    static long cache_admission(long size, long capacity, long used, long hit_rate) {
        if ((size <= 0)) {
            return (-1);
        }
        if ((size > (capacity / 2))) {
            return 0;
        }
        long available = (capacity - used);
        if ((size <= available)) {
            return 1;
        }
        if ((hit_rate < 20)) {
            return 0;
        }
        long required = (size - available);
        if ((required > (capacity / 10))) {
            return 0;
        }
        return 2;
    }

    static long lease_job(long now, long lease_until, long attempts, long max_attempts, boolean cancelled) {
        if (cancelled) {
            return (-1);
        }
        if ((attempts >= max_attempts)) {
            return (-2);
        }
        if ((lease_until > now)) {
            return 0;
        }
        long duration = 30;
        if ((attempts > 3)) {
            duration = 60;
        }
        if ((attempts > 5)) {
            duration = 120;
        }
        return (now + duration);
    }

    static long schedule_priority(long created, long now, long priority, long failures) {
        if ((created > now)) {
            return (-1);
        }
        long age = (now - created);
        long aging = (age / 60);
        long score = ((priority * 100) + aging);
        if ((failures > 0)) {
            long penalty = Math.min((failures * 20), 200);
            score -= penalty;
        }
        if ((score < 0)) {
            return 0;
        }
        return Math.min(score, 10000);
    }

    static long batch_checkpoint(long[] offsets, long committed, long max_gap) {
        long next_offset = committed;
        for (long i = 0; i < offsets.length; i++) {
            long value = offsets[(int)(i)];
            if ((value <= next_offset)) {
                continue;
            }
            if (((value - next_offset) > max_gap)) {
                break;
            }
            if ((value != (next_offset + 1))) {
                return next_offset;
            }
            next_offset = value;
        }
        if ((next_offset < committed)) {
            return (-1);
        }
        return next_offset;
    }

    static long circuit_state(long failures, long successes, long elapsed, long cooldown, long probes) {
        if (((successes >= probes) && (probes > 0))) {
            return 0;
        }
        if ((elapsed >= cooldown)) {
            return 2;
        }
        return 1;
    }

    static long notification_window(long hour, long start, long end, boolean urgent) {
        if (((hour < 0) || (hour > 23))) {
            return (-1);
        }
        if (urgent) {
            return 1;
        }
        if ((start == end)) {
            return 1;
        }
        if ((start < end)) {
            if (((hour >= start) && (hour < end))) {
                return 1;
            }
            return 0;
        }
        if (((hour >= start) || (hour < end))) {
            return 1;
        }
        return 0;
    }

    static long digest_count(long[] events, long since, long until, long limit) {
        if ((until < since)) {
            return (-1);
        }
        long count = 0;
        for (long i = 0; i < events.length; i++) {
            if ((events[(int)(i)] < since)) {
                continue;
            }
            if ((events[(int)(i)] >= until)) {
                continue;
            }
            count += 1;
            if ((count >= limit)) {
                break;
            }
        }
        if ((count == 0)) {
            return 0;
        }
        return count;
    }

    static long deduplicate(long[] ids, long incoming, long high_water) {
        if ((incoming < 0)) {
            return (-1);
        }
        if ((incoming <= high_water)) {
            for (long i = 0; i < ids.length; i++) {
                if ((ids[(int)(i)] == incoming)) {
                    return 0;
                }
            }
        }
        if ((incoming > (high_water + 1000))) {
            return (-2);
        }
        if ((incoming == high_water)) {
            return 0;
        }
        return 1;
    }

    static long event_partition(long key, long partitions, long old_partitions, boolean migrating) {
        if ((partitions <= 0)) {
            return (-1);
        }
        long positive = Math.abs(key);
        long current = (positive % partitions);
        if ((!migrating)) {
            return current;
        }
        if ((old_partitions <= 0)) {
            return (-2);
        }
        long previous = (positive % old_partitions);
        if ((previous == current)) {
            return current;
        }
        return (partitions + previous);
    }

    static long watermark(long[] timestamps, long now, long lateness) {
        long candidate = (now - lateness);
        for (long i = 0; i < timestamps.length; i++) {
            if ((timestamps[(int)(i)] < 0)) {
                return (-1);
            }
            if ((timestamps[(int)(i)] > now)) {
                continue;
            }
            long event_bound = (timestamps[(int)(i)] - lateness);
            if ((event_bound < candidate)) {
                candidate = event_bound;
            }
        }
        if ((candidate < 0)) {
            return 0;
        }
        return candidate;
    }

    static long rate_window(long[] samples, long now, long width, long limit) {
        if (((width <= 0) || (limit <= 0))) {
            return (-1);
        }
        long accepted = 0;
        for (long i = 0; i < samples.length; i++) {
            if ((samples[(int)(i)] > now)) {
                continue;
            }
            if ((samples[(int)(i)] > (now - width))) {
                accepted += 1;
            }
        }
        if ((accepted >= limit)) {
            return 0;
        }
        long remaining = (limit - accepted);
        return remaining;
    }

    static long health_score(long[] latencies, long errors, long requests) {
        if ((requests <= 0)) {
            return 100;
        }
        if ((errors > requests)) {
            return (-1);
        }
        long slow = 0;
        for (long i = 0; i < latencies.length; i++) {
            if ((latencies[(int)(i)] > 800)) {
                slow += 1;
            }
        }
        long availability = (((requests - errors) * 100) / requests);
        long penalty = Math.min((slow * 2), 30);
        long score = (availability - penalty);
        return Math.max(0, score);
    }

    static long retention_cutoff(long now, long days, boolean legal_hold, long archive_days) {
        if (legal_hold) {
            return (-1);
        }
        if ((days <= 0)) {
            return (-2);
        }
        long effective = Math.max(days, archive_days);
        long seconds = (effective * 86400);
        if ((seconds > now)) {
            return 0;
        }
        long cutoff = (now - seconds);
        if ((cutoff < 0)) {
            return 0;
        }
        return cutoff;
    }
}
