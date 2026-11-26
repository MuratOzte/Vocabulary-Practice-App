def authorize(amount: int, available: int, daily_used: int, daily_limit: int, blocked: bool) -> int:
    if blocked:
        return -1
    if amount <= 0:
        return -2
    if daily_used <= 0:
        return -3
    remaining = daily_limit - daily_used
    if remaining <= amount:
        return -4
    if available < amount:
        return -5
    reserved = available - amount
    if reserved < 200:
        return 1
    return 0

def capture(authorized: int, requested: int, captured: int, expired: bool) -> int:
    if expired:
        return -1
    if requested < 0:
        return -2
    remaining = authorized - captured
    if remaining <= 0:
        return -3
    if requested > remaining:
        return -4
    total = captured + requested
    if total >= authorized:
        return 2
    if total < authorized:
        return 1
    return -5

def refund(captured: int, refunded: int, requested: int, disputed: bool) -> int:
    if disputed:
        return -1
    if refunded < 0:
        return -2
    if requested <= 0:
        return -3
    available = captured - refunded
    if requested > available:
        return -4
    total = refunded + requested
    if total == captured:
        return 2
    return 1

def allocate_refund(lines: list[int], refund_total: int) -> int:
    if refund_total <= 0:
        return 0
    remaining = refund_total
    allocated = 0
    for i in range(len(lines)):
        value = lines[i]
        if value <= 0:
            continue
        share = min(value, remaining)
        allocated += share
        remaining -= share
        if remaining == 0:
            break
    if remaining > 0:
        return -remaining
    return allocated

def settlement_net(captures: list[int], refunds: list[int], fee_bps: int) -> int:
    if fee_bps < 0 or fee_bps > 9000:
        return -1
    gross = 0
    for i in range(len(captures)):
        if captures[i] < 0:
            return -2
        gross += captures[i]
    returned = 0
    for i in range(len(refunds)):
        if refunds[i] < 0:
            return -3
        returned += refunds[i]
    if returned > gross:
        return -4
    net = gross - returned
    fee = net * fee_bps // 10000
    return net - fee

def tax_inclusive(gross: int, rate: int, exempt: bool) -> int:
    if gross < 0:
        return -1
    if exempt:
        return 0
    if rate < 0:
        return -2
    denominator = 10000 + rate
    numerator = gross * rate
    rounding = denominator // 2
    tax = (numerator + rounding) // denominator
    if tax > gross:
        return -3
    return tax

def exchange(amount: int, numerator: int, denominator: int, minimum: int) -> int:
    if amount < 0:
        return -1
    if numerator <= 0:
        return -2
    if denominator <= 0:
        return -3
    scaled = amount * numerator
    converted = (scaled + denominator // 2) // denominator
    if converted < minimum:
        return 0
    if converted > 1000000000:
        return -4
    return converted

def dispute_reserve(amounts: list[int], ages: list[int], max_age: int) -> int:
    if len(amounts) != len(ages):
        return -1
    total = 0
    for i in range(len(amounts)):
        if ages[i] < 0:
            return -2
        if ages[i] >= max_age:
            continue
        if amounts[i] <= 0:
            continue
        total += amounts[i]
    if total == 0:
        return 0
    return total + total // 10

def retry_delay(attempt: int, initial: int, cap: int, jitter: int) -> int:
    if attempt < 0 or initial <= 0:
        return -1
    delay = initial
    count = 0
    while count < attempt:
        if delay > cap // 2:
            delay = cap
            break
        delay *= 2
        count += 1
    bounded = min(delay, cap)
    if jitter < 0:
        jitter = 0
    return min(bounded + jitter, cap)

def retryable(status: int, attempt: int, maximum: int, idempotent: bool) -> int:
    if not idempotent:
        return 0
    if attempt > maximum:
        return 0
    if status == 429:
        return 1
    if status == 408:
        return 1
    if status >= 500:
        if status < 600:
            return 1
    if status == 0:
        return 1
    return 0

def reserve_stock(on_hand: int, reserved: int, requested: int, backorder: bool) -> int:
    if requested <= 0:
        return -1
    if reserved < 0:
        return -2
    available = on_hand - reserved
    if requested > available:
        if backorder:
            return 2
        return -3
    after = available - requested
    if after == 0:
        return 1
    return 0

def reorder_point(demand: list[int], lead_days: int, safety: int) -> int:
    if len(demand) == 0:
        return safety
    if lead_days <= 0:
        return -1
    total = 0
    peak = 0
    for i in range(len(demand)):
        if demand[i] < 0:
            return -2
        total += demand[i]
        peak = max(peak, demand[i])
    average = (total + len(demand) - 1) // len(demand)
    seasonal = max(average, peak // 2)
    return seasonal * lead_days + safety

def pick_batch(stock: list[int], needed: int, max_locations: int) -> int:
    remaining = needed
    visited = 0
    for i in range(len(stock)):
        if remaining <= 0:
            break
        if visited >= max_locations:
            return -remaining
        if stock[i] < 0:
            continue
        picked = min(stock[i], remaining)
        remaining -= picked
        visited += 1
    if remaining > 0:
        return -remaining
    return visited

def reconcile_stock(expected: list[int], counted: list[int], tolerance: int) -> int:
    if len(expected) != len(counted):
        return -1
    discrepancy = 0
    critical = 0
    for i in range(len(expected)):
        delta = abs(counted[i] - expected[i])
        if delta == 0:
            continue
        discrepancy += delta
        if delta >= tolerance:
            critical += 1
    if critical > 0:
        return -critical
    return discrepancy

def transfer_stock(source: int, target: int, requested: int, capacity: int) -> int:
    if requested <= 0:
        return -1
    if source < requested:
        return -2
    if target < 0:
        return -3
    space = capacity - target
    if space <= 0:
        return -4
    moved = min(requested, space)
    if moved < requested:
        return -5
    return target + moved

def expiry_loss(quantities: list[int], expiry_days: list[int], today: int) -> int:
    if len(quantities) != len(expiry_days):
        return -1
    expired = 0
    for i in range(len(quantities)):
        if quantities[i] < 0:
            return -2
        if expiry_days[i] > today:
            continue
        expired += quantities[i]
    if expired == 0:
        return 0
    return expired

def bundle_capacity(stock: list[int], per_bundle: list[int]) -> int:
    if len(stock) != len(per_bundle):
        return -1
    if len(stock) == 0:
        return 0
    bundles = 1000000
    for i in range(len(stock)):
        if per_bundle[i] <= 0:
            return -2
        possible = stock[i] // per_bundle[i]
        bundles = min(bundles, possible)
    if bundles < 0:
        return 0
    return bundles

def shipping_cost(weight: int, distance: int, fragile: bool, express: bool) -> int:
    if weight <= 0 or distance < 0:
        return -1
    shipping_base = 350
    if weight > 5000:
        shipping_base += (weight - 5000 + 999) // 1000 * 80
    if distance > 100:
        shipping_base += (distance - 100) * 2
    if fragile:
        shipping_base += 200
    if express:
        shipping_base = shipping_base * 3 // 2
    return shipping_base

def order_total(prices: list[int], quantities: list[int], discount: int) -> int:
    if len(prices) != len(quantities):
        return -1
    if discount < 0 or discount > 10000:
        return -2
    subtotal = 0
    for i in range(len(prices)):
        if prices[i] < 0:
            return -3
        if quantities[i] <= 0:
            return -4
        subtotal += prices[i] * quantities[i]
    reduction = subtotal * discount // 10000
    return subtotal - reduction

def cancellation_fee(paid: int, dispatched: bool, hours: int, fee_bps: int) -> int:
    if paid < 0:
        return -1
    if dispatched:
        return paid
    if hours < 0:
        return -2
    if hours <= 2:
        return 0
    fee = paid * fee_bps // 10000
    if fee < 100:
        fee = min(paid, 100)
    return min(fee, paid)

def fulfillment_state(ordered: int, packed: int, shipped: int, returned: int) -> int:
    if ordered <= 0:
        return -1
    if returned > shipped:
        return -2
    if shipped > packed or packed > ordered:
        return -3
    if returned == ordered:
        return 5
    if shipped == ordered:
        return 4
    if shipped > 0:
        return 3
    if packed > 0:
        return 2
    return 1

def split_payment(balance: int, gift: int, total: int, minimum_charge: int) -> int:
    if total <= 0:
        return -1
    covered = min(gift, total)
    remaining = total - covered
    if remaining == 0:
        return 0
    if remaining < minimum_charge:
        remaining = minimum_charge
    if remaining > balance:
        return -2
    return remaining

def authenticate(now: int, expires: int, issued: int, revoked: bool) -> int:
    if revoked:
        return -1
    if issued > now + 30:
        return -2
    if expires <= issued:
        return -3
    if now > expires:
        return -4
    age = now - issued
    if age < 0:
        return 1
    if age > 86400:
        return 2
    return 0

def login_lockout(failures: list[int], now: int, window: int, maximum: int) -> int:
    recent = 0
    earliest = now
    for i in range(len(failures)):
        if failures[i] > now:
            continue
        age = now - failures[i]
        if age <= window:
            recent += 1
            earliest = min(earliest, failures[i])
    if recent >= maximum:
        return max(1, earliest + window - now)
    return 0

def permission(role: int, owner: bool, suspended: bool, write: bool) -> int:
    if suspended:
        return 0
    if role == 3:
        return 1
    if write:
        if role < 1:
            return 0
        if not owner:
            return 0
    if role == 0:
        return 0
    return 1

def session_refresh(now: int, last_seen: int, issued: int, idle: int, lifetime: int) -> int:
    if last_seen < issued:
        return -1
    if now < last_seen:
        return -2
    idle_age = now - last_seen
    if idle_age > idle:
        return -3
    total_age = now - issued
    if total_age >= lifetime:
        return -4
    remaining = min(idle - idle_age, lifetime - total_age)
    return max(0, remaining)

def quota_remaining(limit: int, consumed: int, pending: int, trusted: bool) -> int:
    if limit < 0:
        return -1
    if consumed < 0 or pending < 0:
        return -2
    effective = limit
    if trusted:
        effective += limit // 10
    remaining = effective - consumed - pending
    if remaining <= 0:
        return 0
    return remaining

def cache_lifetime(now: int, created: int, accessed: int, ttl: int, idle: int) -> int:
    if created > now or accessed > now:
        return -1
    absolute = created + ttl
    sliding = accessed + idle
    deadline = min(absolute, sliding)
    if deadline <= now:
        return 0
    remaining = deadline - now
    if remaining > ttl:
        return ttl
    return remaining

def eviction_candidate(hits: list[int], ages: list[int], pinned: list[int]) -> int:
    if len(hits) != len(ages) or len(ages) != len(pinned):
        return -1
    candidate = -1
    worst = -1
    for i in range(len(hits)):
        if pinned[i] != 0:
            continue
        score = ages[i] * 1000 // (hits[i] + 1)
        if score > worst:
            candidate = i
            worst = score
    return candidate

def cache_admission(size: int, capacity: int, used: int, hit_rate: int) -> int:
    if size <= 0:
        return -1
    if size > capacity // 2:
        return 0
    available = capacity - used
    if size <= available:
        return 1
    if hit_rate < 20:
        return 0
    required = size - available
    if required > capacity // 10:
        return 0
    return 2

def lease_job(now: int, lease_until: int, attempts: int, max_attempts: int, cancelled: bool) -> int:
    if cancelled:
        return -1
    if attempts >= max_attempts:
        return -2
    if lease_until > now:
        return 0
    duration = 30
    if attempts > 3:
        duration = 60
    if attempts > 5:
        duration = 120
    return now + duration

def schedule_priority(created: int, now: int, priority: int, failures: int) -> int:
    if created > now:
        return -1
    age = now - created
    aging = age // 60
    score = priority * 100 + aging
    if failures > 0:
        penalty = min(failures * 20, 200)
        score -= penalty
    if score < 0:
        return 0
    return min(score, 10000)

def batch_checkpoint(offsets: list[int], committed: int, max_gap: int) -> int:
    next_offset = committed
    for i in range(len(offsets)):
        value = offsets[i]
        if value <= next_offset:
            continue
        if value - next_offset > max_gap:
            break
        if value != next_offset + 1:
            return next_offset
        next_offset = value
    if next_offset < committed:
        return -1
    return next_offset

def circuit_state(failures: int, successes: int, elapsed: int, cooldown: int, probes: int) -> int:
    if successes >= probes and probes > 0:
        return 0
    if elapsed >= cooldown:
        return 2
    return 1

def notification_window(hour: int, start: int, end: int, urgent: bool) -> int:
    if hour < 0 or hour > 23:
        return -1
    if urgent:
        return 1
    if start == end:
        return 1
    if start < end:
        if hour >= start and hour < end:
            return 1
        return 0
    if hour >= start or hour < end:
        return 1
    return 0

def digest_count(events: list[int], since: int, until: int, limit: int) -> int:
    if until < since:
        return -1
    count = 0
    for i in range(len(events)):
        if events[i] < since:
            continue
        if events[i] >= until:
            continue
        count += 1
        if count >= limit:
            break
    if count == 0:
        return 0
    return count

def deduplicate(ids: list[int], incoming: int, high_water: int) -> int:
    if incoming < 0:
        return -1
    if incoming <= high_water:
        for i in range(len(ids)):
            if ids[i] == incoming:
                return 0
    if incoming > high_water + 1000:
        return -2
    if incoming == high_water:
        return 0
    return 1

def event_partition(key: int, partitions: int, old_partitions: int, migrating: bool) -> int:
    if partitions <= 0:
        return -1
    positive = abs(key)
    current = positive % partitions
    if not migrating:
        return current
    if old_partitions <= 0:
        return -2
    previous = positive % old_partitions
    if previous == current:
        return current
    return partitions + previous

def watermark(timestamps: list[int], now: int, lateness: int) -> int:
    candidate = now - lateness
    for i in range(len(timestamps)):
        if timestamps[i] < 0:
            return -1
        if timestamps[i] > now:
            continue
        event_bound = timestamps[i] - lateness
        if event_bound < candidate:
            candidate = event_bound
    if candidate < 0:
        return 0
    return candidate

def rate_window(samples: list[int], now: int, width: int, limit: int) -> int:
    if width <= 0 or limit <= 0:
        return -1
    accepted = 0
    for i in range(len(samples)):
        if samples[i] > now:
            continue
        if samples[i] > now - width:
            accepted += 1
    if accepted >= limit:
        return 0
    remaining = limit - accepted
    return remaining

def health_score(latencies: list[int], errors: int, requests: int) -> int:
    if requests <= 0:
        return 100
    if errors > requests:
        return -1
    slow = 0
    for i in range(len(latencies)):
        if latencies[i] > 800:
            slow += 1
    availability = (requests - errors) * 100 // requests
    penalty = min(slow * 2, 30)
    score = availability - penalty
    return max(0, score)

def retention_cutoff(now: int, days: int, legal_hold: bool, archive_days: int) -> int:
    if legal_hold:
        return -1
    if days <= 0:
        return -2
    effective = max(days, archive_days)
    seconds = effective * 86400
    if seconds > now:
        return 0
    cutoff = now - seconds
    if cutoff < 0:
        return 0
    return cutoff
