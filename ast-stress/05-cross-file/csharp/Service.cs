using System;
class Service : IPricing {
    readonly Repository repository;
    readonly long fee;
    public Service(Repository repository, long fee) { this.repository = repository ?? throw new ArgumentNullException(nameof(repository)); this.fee = fee; }
    public long Quote(string key, string currency) { return repository.Load(key, currency).Cents + fee; }
}

static class CurrencyCode { public static string Normalize(string currency) { return currency.Length == 0 ? "TRY" : currency.ToUpperInvariant(); } }
