import java.util.*;
import java.util.function.Function;
@interface Audited { String value(); }
interface Repository<T> { Optional<T> find(CharSequence id); }
record Receipt(String id, long cents, String currency) {}
class Checkout<T extends Number> {
    private final Repository<T> repository;
    @Audited("constructor")
    Checkout(Repository<T> repository) { this.repository = Objects.requireNonNull(repository); }
    @Audited("payment")
    long capture(long cents) { return Math.max(1, cents); }
    long capture(long cents, long fee) { return capture(cents) + fee; }
    <R extends Number & Comparable<R>> long normalize(R value) { return value.longValue(); }
    Function<Long, Long> policy() {
        return cents -> cents >= 1000 ? cents - 100 : cents;
    }
    Comparator<Receipt> order() {
        return new Comparator<Receipt>() {
            @Override
            public int compare(Receipt a, Receipt b) { return Long.compare(b.cents(), a.cents()); }
        };
    }
}
