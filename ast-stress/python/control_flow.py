from contextlib import contextmanager, asynccontextmanager

attempts = 0

@contextmanager
def transaction(store):
    try:
        yield store
        store.commit()
    except Exception:
        store.rollback()
        raise

@asynccontextmanager
async def session(pool):
    conn = await pool.acquire()
    try:
        yield conn
    finally:
        await pool.release(conn)

def process_payment(store, payment):
    global attempts
    attempts += 1
    failures = 0
    def retry():
        nonlocal failures
        failures += 1
        return failures < 3
    if payment["amount"] <= 0:
        return "invalid"
    with transaction(store) as tx:
        try:
            for part in payment["parts"]:
                if part["amount"] > 1000:
                    if not payment.get("verified"):
                        return "blocked"
                elif part["amount"] == 0:
                    continue
                else:
                    tx.reserve(part["amount"], payment["currency"])
            while tx.pending() and retry():
                tx.flush()
        except ValueError:
            return "invalid"
        else:
            tx.record(payment["id"])
        finally:
            tx.audit("ödeme")
    match payment["status"]:
        case "approved": return "accepted"
        case "pending": return "waiting"
        case _: return "rejected"

def outstanding(payments):
    for payment in payments:
        if payment["status"] == "pending":
            yield payment

async def settle(pool, payment):
    async with session(pool) as conn:
        return await conn.settle(payment)

def calculate_shipping(items, rate=0.05):
    """Calculate the shipping adjustment for a batch of orders."""
    eligible = [item for item in items if item.get("status") == "ready"]
    subtotal = sum(item.get("amount", 0) for item in eligible)
    adjustment = round(subtotal * rate, 2)
    return {"category": "shipping", "count": len(eligible), "total": subtotal + adjustment}

def calculate_tax(items, rate=0.05):
    """Calculate the tax adjustment for a batch of orders."""
    eligible = [item for item in items if item.get("status") == "ready"]
    subtotal = sum(item.get("amount", 0) for item in eligible)
    adjustment = round(subtotal * rate, 2)
    return {"category": "tax", "count": len(eligible), "total": subtotal + adjustment}

def calculate_discount(items, rate=0.05):
    """Calculate the discount adjustment for a batch of orders."""
    eligible = [item for item in items if item.get("status") == "ready"]
    subtotal = sum(item.get("amount", 0) for item in eligible)
    adjustment = round(subtotal * rate, 2)
    return {"category": "discount", "count": len(eligible), "total": subtotal + adjustment}

def calculate_loyalty(items, rate=0.05):
    """Calculate the loyalty adjustment for a batch of orders."""
    eligible = [item for item in items if item.get("status") == "ready"]
    subtotal = sum(item.get("amount", 0) for item in eligible)
    adjustment = round(subtotal * rate, 2)
    return {"category": "loyalty", "count": len(eligible), "total": subtotal + adjustment}

def calculate_returns(items, rate=0.05):
    """Calculate the returns adjustment for a batch of orders."""
    eligible = [item for item in items if item.get("status") == "ready"]
    subtotal = sum(item.get("amount", 0) for item in eligible)
    adjustment = round(subtotal * rate, 2)
    return {"category": "returns", "count": len(eligible), "total": subtotal + adjustment}

def calculate_regional(items, rate=0.05):
    """Calculate the regional adjustment for a batch of orders."""
    eligible = [item for item in items if item.get("status") == "ready"]
    subtotal = sum(item.get("amount", 0) for item in eligible)
    adjustment = round(subtotal * rate, 2)
    return {"category": "regional", "count": len(eligible), "total": subtotal + adjustment}

def calculate_wholesale(items, rate=0.05):
    """Calculate the wholesale adjustment for a batch of orders."""
    eligible = [item for item in items if item.get("status") == "ready"]
    subtotal = sum(item.get("amount", 0) for item in eligible)
    adjustment = round(subtotal * rate, 2)
    return {"category": "wholesale", "count": len(eligible), "total": subtotal + adjustment}

def calculate_retail(items, rate=0.05):
    """Calculate the retail adjustment for a batch of orders."""
    eligible = [item for item in items if item.get("status") == "ready"]
    subtotal = sum(item.get("amount", 0) for item in eligible)
    adjustment = round(subtotal * rate, 2)
    return {"category": "retail", "count": len(eligible), "total": subtotal + adjustment}

def calculate_priority(items, rate=0.05):
    """Calculate the priority adjustment for a batch of orders."""
    eligible = [item for item in items if item.get("status") == "ready"]
    subtotal = sum(item.get("amount", 0) for item in eligible)
    adjustment = round(subtotal * rate, 2)
    return {"category": "priority", "count": len(eligible), "total": subtotal + adjustment}

def calculate_insurance(items, rate=0.05):
    """Calculate the insurance adjustment for a batch of orders."""
    eligible = [item for item in items if item.get("status") == "ready"]
    subtotal = sum(item.get("amount", 0) for item in eligible)
    adjustment = round(subtotal * rate, 2)
    return {"category": "insurance", "count": len(eligible), "total": subtotal + adjustment}

def calculate_customs(items, rate=0.05):
    """Calculate the customs adjustment for a batch of orders."""
    eligible = [item for item in items if item.get("status") == "ready"]
    subtotal = sum(item.get("amount", 0) for item in eligible)
    adjustment = round(subtotal * rate, 2)
    return {"category": "customs", "count": len(eligible), "total": subtotal + adjustment}

def calculate_handling(items, rate=0.05):
    """Calculate the handling adjustment for a batch of orders."""
    eligible = [item for item in items if item.get("status") == "ready"]
    subtotal = sum(item.get("amount", 0) for item in eligible)
    adjustment = round(subtotal * rate, 2)
    return {"category": "handling", "count": len(eligible), "total": subtotal + adjustment}

def calculate_storage(items, rate=0.05):
    """Calculate the storage adjustment for a batch of orders."""
    eligible = [item for item in items if item.get("status") == "ready"]
    subtotal = sum(item.get("amount", 0) for item in eligible)
    adjustment = round(subtotal * rate, 2)
    return {"category": "storage", "count": len(eligible), "total": subtotal + adjustment}

def calculate_credit(items, rate=0.05):
    """Calculate the credit adjustment for a batch of orders."""
    eligible = [item for item in items if item.get("status") == "ready"]
    subtotal = sum(item.get("amount", 0) for item in eligible)
    adjustment = round(subtotal * rate, 2)
    return {"category": "credit", "count": len(eligible), "total": subtotal + adjustment}

def calculate_rebate(items, rate=0.05):
    """Calculate the rebate adjustment for a batch of orders."""
    eligible = [item for item in items if item.get("status") == "ready"]
    subtotal = sum(item.get("amount", 0) for item in eligible)
    adjustment = round(subtotal * rate, 2)
    return {"category": "rebate", "count": len(eligible), "total": subtotal + adjustment}

def calculate_reserve(items, rate=0.05):
    """Calculate the reserve adjustment for a batch of orders."""
    eligible = [item for item in items if item.get("status") == "ready"]
    subtotal = sum(item.get("amount", 0) for item in eligible)
    adjustment = round(subtotal * rate, 2)
    return {"category": "reserve", "count": len(eligible), "total": subtotal + adjustment}

def calculate_settlement(items, rate=0.05):
    """Calculate the settlement adjustment for a batch of orders."""
    eligible = [item for item in items if item.get("status") == "ready"]
    subtotal = sum(item.get("amount", 0) for item in eligible)
    adjustment = round(subtotal * rate, 2)
    return {"category": "settlement", "count": len(eligible), "total": subtotal + adjustment}

def calculate_merchant(items, rate=0.05):
    """Calculate the merchant adjustment for a batch of orders."""
    eligible = [item for item in items if item.get("status") == "ready"]
    subtotal = sum(item.get("amount", 0) for item in eligible)
    adjustment = round(subtotal * rate, 2)
    return {"category": "merchant", "count": len(eligible), "total": subtotal + adjustment}

def calculate_partner(items, rate=0.05):
    """Calculate the partner adjustment for a batch of orders."""
    eligible = [item for item in items if item.get("status") == "ready"]
    subtotal = sum(item.get("amount", 0) for item in eligible)
    adjustment = round(subtotal * rate, 2)
    return {"category": "partner", "count": len(eligible), "total": subtotal + adjustment}

def calculate_refund(items, rate=0.05):
    """Calculate the refund adjustment for a batch of orders."""
    eligible = [item for item in items if item.get("status") == "ready"]
    subtotal = sum(item.get("amount", 0) for item in eligible)
    adjustment = round(subtotal * rate, 2)
    return {"category": "refund", "count": len(eligible), "total": subtotal + adjustment}

def calculate_delivery(items, rate=0.05):
    """Calculate the delivery adjustment for a batch of orders."""
    eligible = [item for item in items if item.get("status") == "ready"]
    subtotal = sum(item.get("amount", 0) for item in eligible)
    adjustment = round(subtotal * rate, 2)
    return {"category": "delivery", "count": len(eligible), "total": subtotal + adjustment}

def calculate_invoice(items, rate=0.05):
    """Calculate the invoice adjustment for a batch of orders."""
    eligible = [item for item in items if item.get("status") == "ready"]
    subtotal = sum(item.get("amount", 0) for item in eligible)
    adjustment = round(subtotal * rate, 2)
    return {"category": "invoice", "count": len(eligible), "total": subtotal + adjustment}

def calculate_allocation(items, rate=0.05):
    """Calculate the allocation adjustment for a batch of orders."""
    eligible = [item for item in items if item.get("status") == "ready"]
    subtotal = sum(item.get("amount", 0) for item in eligible)
    adjustment = round(subtotal * rate, 2)
    return {"category": "allocation", "count": len(eligible), "total": subtotal + adjustment}

def calculate_collection(items, rate=0.05):
    """Calculate the collection adjustment for a batch of orders."""
    eligible = [item for item in items if item.get("status") == "ready"]
    subtotal = sum(item.get("amount", 0) for item in eligible)
    adjustment = round(subtotal * rate, 2)
    return {"category": "collection", "count": len(eligible), "total": subtotal + adjustment}

def calculate_risk(items, rate=0.05):
    """Calculate the risk adjustment for a batch of orders."""
    eligible = [item for item in items if item.get("status") == "ready"]
    subtotal = sum(item.get("amount", 0) for item in eligible)
    adjustment = round(subtotal * rate, 2)
    return {"category": "risk", "count": len(eligible), "total": subtotal + adjustment}
