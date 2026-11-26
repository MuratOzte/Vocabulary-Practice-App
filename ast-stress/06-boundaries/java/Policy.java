import java.util.Set;
class Policy {
    static final long LIMIT = 200;
    boolean active = false;
    String currency = "TRY";
    @SuppressWarnings("unused")
    double quote(
        double miktar,
        int rate
    ) {
        return miktar * rate;
    }
    String label = "İzmir 😀";
} // end
