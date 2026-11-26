import java.util.Set;
class Policy {
    static final long LIMIT = 200;
    boolean active = false;
    String currency = "TRY";
    @SuppressWarnings("unused")
    double quote(
        double miktar_ö,
        int rate
    ) {
        return miktar_ö * rate;
    }
    String label = "İzmir 😀";
} // end
