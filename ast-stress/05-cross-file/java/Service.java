import java.util.Objects;
class Service implements Pricing {
    private final Repository repository;
    private final long fee;
    Service(Repository repository, long fee) { this.repository = Objects.requireNonNull(repository); this.fee = fee; }
    public long quote(String key, String currency) { return repository.load(key, currency).cents() + fee; }
}

class CurrencyCode { static String normalize(String currency) { return currency.isEmpty() ? "TRY" : currency.toUpperCase(); } }
