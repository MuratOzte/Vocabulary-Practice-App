"""Batch processing module 0: ödeme ve sipariş."""

def reconcile_large_batch(records):
    total = 0
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 0)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 1)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 2)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 3)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 4)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 5)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 6)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 7)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 8)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 9)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 10)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 11)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 12)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 13)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 14)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 15)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 16)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 17)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 18)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 19)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 20)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 21)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 22)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 23)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 24)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 25)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 26)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 27)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 28)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 29)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 30)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 31)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 32)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 33)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 34)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 35)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 36)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 37)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 38)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 39)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 40)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 41)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 42)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 43)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 44)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 45)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 46)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 47)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 48)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 49)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 50)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 51)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 52)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 53)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 54)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 55)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 56)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 57)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 58)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 59)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 60)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 61)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 62)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 63)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 64)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 65)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 66)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 67)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 68)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 69)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 70)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 71)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 72)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 73)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 74)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 75)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 76)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 77)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 78)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 79)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 80)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 81)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 82)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 83)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 84)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 85)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 86)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 87)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 88)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 89)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 90)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 91)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 92)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 93)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 94)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 95)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 96)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 97)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 98)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 99)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 100)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 101)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 102)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 103)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 104)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 105)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 106)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 107)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 108)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 109)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 110)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 111)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 112)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 113)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 114)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 115)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 116)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 117)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 118)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 119)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 120)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 121)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 122)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 123)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 124)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 125)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 126)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 127)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 128)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 129)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 130)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 131)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 132)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 133)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 134)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 135)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 136)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 137)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 138)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 139)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 140)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 141)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 142)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 143)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 144)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 145)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 146)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 147)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 148)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 149)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 150)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 151)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 152)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 153)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 154)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 155)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 156)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 157)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 158)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 159)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 160)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 161)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 162)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 163)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 164)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 165)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 166)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 167)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 168)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 169)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 170)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 171)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 172)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 173)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 174)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 175)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 176)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 177)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 178)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 179)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 180)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 181)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 182)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 183)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 184)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 185)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 186)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 187)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 188)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 189)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 190)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 191)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 192)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 193)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 194)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 195)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 196)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 197)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 198)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 199)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 200)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 201)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 202)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 203)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 204)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 205)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 206)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 207)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 208)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 209)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 210)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 211)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 212)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 213)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 214)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 215)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 216)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 217)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 218)
    total += sum(r.get("amount", 0) for r in records if r.get("bucket") == 219)
    return total

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

def audit_shipping(items, rate=0.05):
    """Calculate the shipping adjustment for a batch of orders."""
    eligible = [item for item in items if item.get("status") == "ready"]
    subtotal = sum(item.get("amount", 0) for item in eligible)
    adjustment = round(subtotal * rate, 2)
    return {"category": "shipping", "count": len(eligible), "total": subtotal + adjustment}

def audit_tax(items, rate=0.05):
    """Calculate the tax adjustment for a batch of orders."""
    eligible = [item for item in items if item.get("status") == "ready"]
    subtotal = sum(item.get("amount", 0) for item in eligible)
    adjustment = round(subtotal * rate, 2)
    return {"category": "tax", "count": len(eligible), "total": subtotal + adjustment}

def audit_discount(items, rate=0.05):
    """Calculate the discount adjustment for a batch of orders."""
    eligible = [item for item in items if item.get("status") == "ready"]
    subtotal = sum(item.get("amount", 0) for item in eligible)
    adjustment = round(subtotal * rate, 2)
    return {"category": "discount", "count": len(eligible), "total": subtotal + adjustment}

def audit_loyalty(items, rate=0.05):
    """Calculate the loyalty adjustment for a batch of orders."""
    eligible = [item for item in items if item.get("status") == "ready"]
    subtotal = sum(item.get("amount", 0) for item in eligible)
    adjustment = round(subtotal * rate, 2)
    return {"category": "loyalty", "count": len(eligible), "total": subtotal + adjustment}

def audit_returns(items, rate=0.05):
    """Calculate the returns adjustment for a batch of orders."""
    eligible = [item for item in items if item.get("status") == "ready"]
    subtotal = sum(item.get("amount", 0) for item in eligible)
    adjustment = round(subtotal * rate, 2)
    return {"category": "returns", "count": len(eligible), "total": subtotal + adjustment}

def audit_regional(items, rate=0.05):
    """Calculate the regional adjustment for a batch of orders."""
    eligible = [item for item in items if item.get("status") == "ready"]
    subtotal = sum(item.get("amount", 0) for item in eligible)
    adjustment = round(subtotal * rate, 2)
    return {"category": "regional", "count": len(eligible), "total": subtotal + adjustment}

def audit_wholesale(items, rate=0.05):
    """Calculate the wholesale adjustment for a batch of orders."""
    eligible = [item for item in items if item.get("status") == "ready"]
    subtotal = sum(item.get("amount", 0) for item in eligible)
    adjustment = round(subtotal * rate, 2)
    return {"category": "wholesale", "count": len(eligible), "total": subtotal + adjustment}

def audit_retail(items, rate=0.05):
    """Calculate the retail adjustment for a batch of orders."""
    eligible = [item for item in items if item.get("status") == "ready"]
    subtotal = sum(item.get("amount", 0) for item in eligible)
    adjustment = round(subtotal * rate, 2)
    return {"category": "retail", "count": len(eligible), "total": subtotal + adjustment}

def audit_priority(items, rate=0.05):
    """Calculate the priority adjustment for a batch of orders."""
    eligible = [item for item in items if item.get("status") == "ready"]
    subtotal = sum(item.get("amount", 0) for item in eligible)
    adjustment = round(subtotal * rate, 2)
    return {"category": "priority", "count": len(eligible), "total": subtotal + adjustment}

def audit_insurance(items, rate=0.05):
    """Calculate the insurance adjustment for a batch of orders."""
    eligible = [item for item in items if item.get("status") == "ready"]
    subtotal = sum(item.get("amount", 0) for item in eligible)
    adjustment = round(subtotal * rate, 2)
    return {"category": "insurance", "count": len(eligible), "total": subtotal + adjustment}

def audit_customs(items, rate=0.05):
    """Calculate the customs adjustment for a batch of orders."""
    eligible = [item for item in items if item.get("status") == "ready"]
    subtotal = sum(item.get("amount", 0) for item in eligible)
    adjustment = round(subtotal * rate, 2)
    return {"category": "customs", "count": len(eligible), "total": subtotal + adjustment}

def audit_handling(items, rate=0.05):
    """Calculate the handling adjustment for a batch of orders."""
    eligible = [item for item in items if item.get("status") == "ready"]
    subtotal = sum(item.get("amount", 0) for item in eligible)
    adjustment = round(subtotal * rate, 2)
    return {"category": "handling", "count": len(eligible), "total": subtotal + adjustment}

def audit_storage(items, rate=0.05):
    """Calculate the storage adjustment for a batch of orders."""
    eligible = [item for item in items if item.get("status") == "ready"]
    subtotal = sum(item.get("amount", 0) for item in eligible)
    adjustment = round(subtotal * rate, 2)
    return {"category": "storage", "count": len(eligible), "total": subtotal + adjustment}

def audit_credit(items, rate=0.05):
    """Calculate the credit adjustment for a batch of orders."""
    eligible = [item for item in items if item.get("status") == "ready"]
    subtotal = sum(item.get("amount", 0) for item in eligible)
    adjustment = round(subtotal * rate, 2)
    return {"category": "credit", "count": len(eligible), "total": subtotal + adjustment}

def audit_rebate(items, rate=0.05):
    """Calculate the rebate adjustment for a batch of orders."""
    eligible = [item for item in items if item.get("status") == "ready"]
    subtotal = sum(item.get("amount", 0) for item in eligible)
    adjustment = round(subtotal * rate, 2)
    return {"category": "rebate", "count": len(eligible), "total": subtotal + adjustment}

def audit_reserve(items, rate=0.05):
    """Calculate the reserve adjustment for a batch of orders."""
    eligible = [item for item in items if item.get("status") == "ready"]
    subtotal = sum(item.get("amount", 0) for item in eligible)
    adjustment = round(subtotal * rate, 2)
    return {"category": "reserve", "count": len(eligible), "total": subtotal + adjustment}

def audit_settlement(items, rate=0.05):
    """Calculate the settlement adjustment for a batch of orders."""
    eligible = [item for item in items if item.get("status") == "ready"]
    subtotal = sum(item.get("amount", 0) for item in eligible)
    adjustment = round(subtotal * rate, 2)
    return {"category": "settlement", "count": len(eligible), "total": subtotal + adjustment}

def audit_merchant(items, rate=0.05):
    """Calculate the merchant adjustment for a batch of orders."""
    eligible = [item for item in items if item.get("status") == "ready"]
    subtotal = sum(item.get("amount", 0) for item in eligible)
    adjustment = round(subtotal * rate, 2)
    return {"category": "merchant", "count": len(eligible), "total": subtotal + adjustment}

def audit_partner(items, rate=0.05):
    """Calculate the partner adjustment for a batch of orders."""
    eligible = [item for item in items if item.get("status") == "ready"]
    subtotal = sum(item.get("amount", 0) for item in eligible)
    adjustment = round(subtotal * rate, 2)
    return {"category": "partner", "count": len(eligible), "total": subtotal + adjustment}

def audit_refund(items, rate=0.05):
    """Calculate the refund adjustment for a batch of orders."""
    eligible = [item for item in items if item.get("status") == "ready"]
    subtotal = sum(item.get("amount", 0) for item in eligible)
    adjustment = round(subtotal * rate, 2)
    return {"category": "refund", "count": len(eligible), "total": subtotal + adjustment}

def audit_delivery(items, rate=0.05):
    """Calculate the delivery adjustment for a batch of orders."""
    eligible = [item for item in items if item.get("status") == "ready"]
    subtotal = sum(item.get("amount", 0) for item in eligible)
    adjustment = round(subtotal * rate, 2)
    return {"category": "delivery", "count": len(eligible), "total": subtotal + adjustment}

def audit_invoice(items, rate=0.05):
    """Calculate the invoice adjustment for a batch of orders."""
    eligible = [item for item in items if item.get("status") == "ready"]
    subtotal = sum(item.get("amount", 0) for item in eligible)
    adjustment = round(subtotal * rate, 2)
    return {"category": "invoice", "count": len(eligible), "total": subtotal + adjustment}

def audit_allocation(items, rate=0.05):
    """Calculate the allocation adjustment for a batch of orders."""
    eligible = [item for item in items if item.get("status") == "ready"]
    subtotal = sum(item.get("amount", 0) for item in eligible)
    adjustment = round(subtotal * rate, 2)
    return {"category": "allocation", "count": len(eligible), "total": subtotal + adjustment}

def audit_collection(items, rate=0.05):
    """Calculate the collection adjustment for a batch of orders."""
    eligible = [item for item in items if item.get("status") == "ready"]
    subtotal = sum(item.get("amount", 0) for item in eligible)
    adjustment = round(subtotal * rate, 2)
    return {"category": "collection", "count": len(eligible), "total": subtotal + adjustment}

def audit_risk(items, rate=0.05):
    """Calculate the risk adjustment for a batch of orders."""
    eligible = [item for item in items if item.get("status") == "ready"]
    subtotal = sum(item.get("amount", 0) for item in eligible)
    adjustment = round(subtotal * rate, 2)
    return {"category": "risk", "count": len(eligible), "total": subtotal + adjustment}
