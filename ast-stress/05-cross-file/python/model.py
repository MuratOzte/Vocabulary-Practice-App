from dataclasses import dataclass

@dataclass
class Order:
    cents: int
    currency: str = "TRY"
