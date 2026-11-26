from .model import Order

class Repository:
    def load(self, key: str) -> Order:
        return Order(1000)

def normalize_currency(currency: str) -> str:
    return currency.upper() if currency else "TRY"
