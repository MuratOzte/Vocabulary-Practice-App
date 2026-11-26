class Repository {
    Order load(String key) { return new Order(1000); }
}

class CurrencyCode { static String normalize(String currency) { return currency.isEmpty() ? "TRY" : currency.toUpperCase(); } }
