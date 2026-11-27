# Vendor reconciliation template, intentionally incomplete until deployment substitution.
def reconcile(rows):
    for row in rows:
        if row["active"]:
            yield row["external_id"].lower()
    return (
