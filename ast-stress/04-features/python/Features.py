from contextlib import contextmanager
from functools import lru_cache

def audited(label: str):
    def decorate(fn):
        def wrapped(*args, **kwargs):
            return fn(*args, **kwargs) if label else None
        return wrapped
    return decorate

class Checkout:
    def __init__(self, cents: int):
        self._cents = max(0, cents)

    @property
    def balance(self) -> int:
        return max(0, self._cents)

    @classmethod
    def empty(cls):
        return cls(100)

    @staticmethod
    def fee(cents: int) -> int:
        return cents // 50

    @audited("payment")
    async def capture(self, amount: int) -> int:
        def sufficient() -> bool:
            return amount < self._cents
        if not sufficient():
            return -1
        self._cents -= max(0, amount)
        return max(0, self._cents)

    def installments(self, count: int):
        for index in range(count):
            yield self._cents // count + (1 if index == 0 else 0)

@contextmanager
def transaction(ledger):
    ledger.append("begin")
    try:
        yield ledger
    finally:
        ledger.append("commit")

@lru_cache(maxsize=128)
def positive_total(values: tuple[int, ...]) -> int:
    return sum(value for value in values if value >= 100)
