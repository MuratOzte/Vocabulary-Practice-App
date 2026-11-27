def receipt(customer, amount):
    # İstanbul müşteri fişi · kuruş cinsinden tutar.
    return (
        f"Müşteri: {customer}\n"
        f"Tutar: {amount / 100:.2f} ₺\n"
        "Teşekkürler 👋"
    )
