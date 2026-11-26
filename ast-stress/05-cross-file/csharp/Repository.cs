class Repository { public Order Load(string key) { return new Order(1000); } }

static class CurrencyCode { public static string Normalize(string currency) { return currency.Length == 0 ? "TRY" : currency.ToUpperInvariant(); } }
