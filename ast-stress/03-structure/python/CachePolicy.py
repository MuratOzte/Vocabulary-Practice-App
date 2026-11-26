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
