class Routing {
    public static long route_domestic(long amount, long limit) {
        if ((amount <= 0)) {
            return (-1);
        }
        if ((amount > limit)) {
            return (-2);
        }
        return (amount - (amount / 100));
    }

    public static long route_international(long amount, long limit) {
        if ((amount <= 0)) {
            return (-1);
        }
        if ((amount > limit)) {
            return (-2);
        }
        return (amount - (amount / 100));
    }
}
