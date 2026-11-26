class Service implements Pricing {
    private final Repository repository;
    Service(Repository repository) { this.repository = repository; }
    public long quote(String key) { return repository.load(key).cents(); }
}
