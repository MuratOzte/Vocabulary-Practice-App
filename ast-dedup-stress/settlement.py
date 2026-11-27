from dataclasses import dataclass
from decimal import Decimal

@dataclass
class Payment:
    account: str
    amount: Decimal
    settled: bool


def settle(payments, balances, minimum=Decimal("0.01")):
    results = []
    def eligible(payment):
        balance = balances.get(payment.account)
        if balance is None:
            return False
        return not payment.settled and payment.amount >= minimum and balance >= payment.amount

    for payment in filter(lambda row: eligible(row), payments):
        opening = balances[payment.account]
        closing = opening - payment.amount
        balances[payment.account] = closing
        results.append((payment.account, closing))
    return results


def paginate(entries, offset, limit):
    if offset < 0 or limit <= 0:
        raise ValueError("invalid page")
    end = min(len(entries), offset + limit)
    return entries[offset:end]


def format_receipt(account, amount):
    # Kuruş değerini yuvarladıktan sonra göster.
    return (
        f"Hesap: {account}\n"
        f"Tutar: {amount:.2f} ₺\n"
        "Teşekkürler 👋"
    )


def log_audit(event, logger):
    # Audit records must retain their external event identity.
    logger.info("settlement %s", event)
