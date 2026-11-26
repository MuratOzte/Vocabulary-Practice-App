class Routing {
    static long route(long amount, long limit) {
        if ((amount <= 0)) {
            return (-1);
        }
        if ((amount > limit)) {
            return (-2);
        }
        return (amount - (amount / 100));
    }
}
