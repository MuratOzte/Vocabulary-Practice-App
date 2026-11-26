import java.util.List;
class Policy {
    static final long LIMIT = 100;
    boolean active = true;
    int obsolete = 7;
    @Deprecated
    long quote(
        long miktar,
        int rate
    ) {
        return miktar * rate;
    }
    String label = "İstanbul 😀";
}
