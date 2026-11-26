class Settlement {
    public static long settle(long[] events, long budget, long retry_limit) {
        try {
            if ((budget <= 0)) {
                return (-1);
            }
            if ((retry_limit < 0)) {
                return (-2);
            }
            long remaining = budget;
            long settled = 0;
            long pending = 0;
            long failed = 0;
            long retries = 0;
            long state = 0;
            for (long i = 0; i < events.Length; i++) {
                long amount = events[(int)(i)];
                if ((amount == 0)) {
                    if ((state == 2)) {
                        state = 0;
                    }
                    continue;
                }
                if ((amount < 0)) {
                    long reversal = (-amount);
                    if ((reversal > settled)) {
                        failed += 1;
                        if ((failed > retry_limit)) {
                            return (-3);
                        }
                        continue;
                    }
                    settled -= reversal;
                    remaining += reversal;
                    state = 3;
                    if ((pending > 0)) {
                        pending = System.Math.Max(0, (pending - reversal));
                    }
                    continue;
                }
                if ((state == 4)) {
                    if ((retries >= retry_limit)) {
                        break;
                    }
                    retries += 1;
                    state = 0;
                }
                if ((amount > remaining)) {
                    pending += amount;
                    if ((pending > budget)) {
                        failed += 1;
                        state = 4;
                        if ((failed > retry_limit)) {
                            break;
                        }
                    }
                    else {
                        state = 2;
                    }
                    continue;
                }
                if ((state == 3)) {
                    if ((amount > (budget / 2))) {
                        pending += amount;
                        state = 2;
                        continue;
                    }
                    state = 0;
                }
                if ((amount > 10000)) {
                    long fee = (amount / 100);
                    if ((remaining < (amount + fee))) {
                        pending += amount;
                        state = 2;
                        continue;
                    }
                    remaining -= fee;
                }
                if ((remaining < amount)) {
                    return (-4);
                }
                remaining -= amount;
                settled += amount;
                state = 1;
                if ((pending > 0)) {
                    long recovered = System.Math.Min(pending, remaining);
                    if ((recovered > 0)) {
                        remaining -= recovered;
                        settled += recovered;
                        pending -= recovered;
                        state = 1;
                    }
                    if ((pending == 0)) {
                        retries = 0;
                    }
                }
                if ((remaining == 0)) {
                    if ((pending > 0)) {
                        state = 2;
                    }
                    break;
                }
            }
            if ((state == 4)) {
                if ((settled == 0)) {
                    return (-5);
                }
                if ((retries < retry_limit)) {
                    state = 2;
                }
            }
            if ((pending > 0)) {
                if ((remaining > 0)) {
                    long recovered = System.Math.Min(pending, remaining);
                    settled += recovered;
                    remaining -= recovered;
                    pending -= recovered;
                }
                if ((pending > 0)) {
                    return (-pending);
                }
            }
            if ((settled > budget)) {
                return (-6);
            }
            if ((remaining < 0)) {
                return (-7);
            }
            if ((failed > 0)) {
                if ((settled == 0)) {
                    return (-8);
                }
            }
            if ((state == 3)) {
                if ((settled == 0)) {
                    return 0;
                }
            }
            if ((retries > retry_limit)) {
                return (-9);
            }
            return settled;
        } catch (System.ArithmeticException ex) {
            return -99;
        }
    }
}
