from .repository import Repository
from .model import Order

class Service:
    def __init__(self, repository: Repository, fee: int):
        self.repository = repository
        self.fee = fee

    def quote(self, key: str, currency: str) -> int:
        order: Order = self.repository.load(key, currency)
        return order.cents + self.fee

def normalize_currency(currency: str) -> str:
    return currency.upper() if currency else "TRY"
