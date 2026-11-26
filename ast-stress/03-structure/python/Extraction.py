def authorize(amount: int, available: int, daily_used: int, daily_limit: int, blocked: bool) -> int:
    if blocked:
        return -1
    if amount <= 0:
        return -2
    if daily_used < 0:
        return -3
    remaining = daily_limit - daily_used
    if remaining < amount:
        return -4


        return -5
    reserved = available - amount
    if reserved < 100:
        return 1

