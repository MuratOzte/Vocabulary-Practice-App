import java.util.*;
import java.util.function.Function;
@interface Audited { String value(); }
interface Repository<T> { Optional<T> find(String id); }
record Receipt(String id, long cents) {}
class Checkout<T extends Number> {
    private final Repository<T> repository;
    @Audited("constructor")
    Checkout(Repository<T> repository) { this.repository = repository; }
    @Audited("capture")
    long capture(long cents) { return Math.max(0, cents); }
    long capture(long cents, long fee) { return capture(cents) - fee; }
    <R extends Number> long normalize(R value) { return value.longValue(); }
    Function<Long, Long> policy() {
        return cents -> cents > 1000 ? cents - 100 : cents;
    }
    Comparator<Receipt> order() {
        return new Comparator<Receipt>() {
            @Override
            public int compare(Receipt a, Receipt b) { return Long.compare(a.cents(), b.cents()); }
        };
    }
}
