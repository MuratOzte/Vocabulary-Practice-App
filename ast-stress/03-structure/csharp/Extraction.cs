static class Extraction {
    public static long invoice(long[] prices, long[] quantities, long discount, long rate) {
        if ((prices.Length != quantities.Length)) {
            return (-1);
        }
        long subtotal = 0;
        for (long i = 0; i < prices.Length; i++) {
            if (((prices[(int)(i)] < 0) || (quantities[(int)(i)] <= 0))) {
                return (-2);
            }
            subtotal += (prices[(int)(i)] * quantities[(int)(i)]);
        }
        long net = (subtotal - ((subtotal * discount) / 10000));
        return (net + ((net * rate) / 10000));
    }

    public static long fee_component(long amount, long rate) {
        if ((amount <= 0)) {
            return 0;
        }
        return ((amount * rate) / 10000);
    }
}
