from contextlib import contextmanager
from functools import lru_cache

def audited(label):
    def decorate(fn):
        def wrapped(*args, **kwargs):
            return fn(*args, **kwargs)
        return wrapped
    return decorate

class Checkout:
    def __init__(self, cents: int):
        self._cents = cents

    @property
    def balance(self) -> int:
        return self._cents

    @classmethod
    def empty(cls):
        return cls(0)

    @staticmethod
    def fee(cents: int) -> int:
        return cents // 100

    @audited("capture")
    async def capture(self, amount: int) -> int:
        def sufficient() -> bool:
            return amount <= self._cents
        if not sufficient():
            return -1
        self._cents -= amount
        return self._cents

    def installments(self, count: int):
        for index in range(count):
            yield self._cents // count + index

@contextmanager
def transaction(ledger):
    ledger.append("begin")
    try:
        yield ledger
    finally:
        ledger.append("end")

@lru_cache(maxsize=64)
def positive_total(values: tuple[int, ...]) -> int:
    return sum(value for value in values if value > 0)
