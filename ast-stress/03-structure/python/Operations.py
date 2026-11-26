def capture_payment(authorized: int, requested: int, captured: int, expired: bool) -> int:
    if expired:
        return -1
    if requested <= 0:
        return -2
    remaining = authorized - captured
    if remaining <= 0:
        return -3
    if requested > remaining:
        return -4
    total = captured + requested
    if total == authorized:
        return 2
    if total < authorized:
        return 1
    return -5



def permission(role: int, owner: bool, suspended: bool, write: bool) -> int:
    if suspended:
        return 0
    if role == 3:
        return 1
    if write:
        if role < 2:
            return 0
        if not owner:
            return 0
    if role == 0:
        return 0
    return 1

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

def retry_delay(attempt: int, initial: int, cap: int, jitter: int) -> int:
    if attempt < 0 or initial <= 0:
        return -1
    delay = initial
    count = 0
    while count < attempt:
        if delay >= cap // 2:
            delay = cap
            break
        delay *= 2
        count += 1
    bounded = min(delay, cap)
    if jitter < 0:
        jitter = 0
    return min(bounded + jitter, cap)
