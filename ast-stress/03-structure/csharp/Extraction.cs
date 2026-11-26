static class Extraction {
    public static long tax_inclusive(long gross, long rate, bool exempt) {
        if ((gross < 0)) {
            return (-1);
        }
        if (exempt) {
            return 0;
        }
        if ((rate < 0)) {
            return (-2);
        }
        long denominator = (10000 + rate);
        long numerator = (gross * rate);
        long rounding = (denominator / 2);
        long tax = ((numerator + rounding) / denominator);
        if ((tax > gross)) {
            return (-3);
        }
        return tax;
    }

    public static long order_total(long[] prices, long[] quantities, long discount) {
        if ((prices.Length != quantities.Length)) {
            return (-1);
        }
        if (((discount < 0) || (discount > 10000))) {
            return (-2);
        }
        long subtotal = 0;
        for (long i = 0; i < prices.Length; i++) {
            if ((prices[(int)(i)] < 0)) {
                return (-3);
            }
            if ((quantities[(int)(i)] <= 0)) {
                return (-4);
            }
            subtotal += (prices[(int)(i)] * quantities[(int)(i)]);
        }
        long reduction = ((subtotal * discount) / 10000);
        return (subtotal - reduction);
    }
}
