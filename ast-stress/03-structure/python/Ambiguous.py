def route_domestic(amount: int, limit: int) -> int:
    if amount <= 0:
        return -1
    if amount > limit:
        return -2
    return amount - amount // 100

def route_international(amount: int, limit: int) -> int:
    if amount <= 0:
        return -1
    if amount > limit:
        return -2
    return amount - amount // 100
