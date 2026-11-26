from .model import Order

class Repository:
    def load(self, key: str, currency: str) -> Order:
        return Order(1000, currency)
