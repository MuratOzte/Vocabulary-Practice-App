class CachePolicy {
    static long cache_lifetime(long now, long created, long accessed, long ttl, long idle) {
        if (((created > now) || (accessed > now))) {
            return (-1);
        }
        long absolute = (created + ttl);
        long sliding = (accessed + idle);
        long deadline = Math.min(absolute, sliding);
        if ((deadline <= now)) {
            return 0;
        }
        long remaining = (deadline - now);
        if ((remaining > ttl)) {
            return ttl;
        }
        return remaining;
    }
}
