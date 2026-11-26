from typing import Protocol

class Pricing(Protocol):
    def quote(self, key: str, currency: str) -> int: ...
