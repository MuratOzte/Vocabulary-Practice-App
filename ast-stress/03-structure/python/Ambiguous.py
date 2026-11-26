def route(amount: int, limit: int) -> int:
    if amount <= 0:
        return -1
    if amount > limit:
        return -2
    return amount - amount // 100
