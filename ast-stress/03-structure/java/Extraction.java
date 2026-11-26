class Extraction {
    static long tax_inclusive(long gross, long rate, boolean exempt) {
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

    static long order_total(long[] prices, long[] quantities, long discount) {
        if ((prices.length != quantities.length)) {
            return (-1);
        }
        if (((discount < 0) || (discount > 10000))) {
            return (-2);
        }
        long subtotal = 0;
        for (long i = 0; i < prices.length; i++) {
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
