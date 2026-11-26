class Service : IPricing {
    readonly Repository repository;
    public Service(Repository repository) { this.repository = repository; }
    public long Quote(string key) { return repository.Load(key).Cents; }
}
