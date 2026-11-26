class Pipeline {
    static long capture_payment(long authorized, long requested, long captured, boolean expired) {
        if (expired) {
            return (-1);
        }
        if ((requested <= 0)) {
            return (-2);
        }
        long remaining = (authorized - captured);
        if ((remaining <= 0)) {
            return (-3);
        }
        if ((requested > remaining)) {
            return (-4);
        }
        long total = (captured + requested);
        if ((total == authorized)) {
            return 2;
        }
        if ((total < authorized)) {
            return 1;
        }
        return (-5);
    }



    static long permission(long role, boolean owner, boolean suspended, boolean write) {
        if (suspended) {
            return 0;
        }
        if ((role == 3)) {
            return 1;
        }
        if (write) {
            if ((role < 2)) {
                return 0;
            }
            if ((!owner)) {
                return 0;
            }
        }
        if ((role == 0)) {
            return 0;
        }
        return 1;
    }

    static long quota_remaining(long limit, long consumed, long pending, boolean trusted) {
        if ((limit < 0)) {
            return (-1);
        }
        if (((consumed < 0) || (pending < 0))) {
            return (-2);
        }
        long effective = limit;
        if (trusted) {
            effective += (limit / 10);
        }
        long remaining = ((effective - consumed) - pending);
        if ((remaining <= 0)) {
            return 0;
        }
        return remaining;
    }

    static long retry_delay(long attempt, long initial, long cap, long jitter) {
        if (((attempt < 0) || (initial <= 0))) {
            return (-1);
        }
        long delay = initial;
        long count = 0;
        while ((count < attempt)) {
            if ((delay >= (cap / 2))) {
                delay = cap;
                break;
            }
            delay *= 2;
            count += 1;
        }
        long bounded = Math.min(delay, cap);
        if ((jitter < 0)) {
            jitter = 0;
        }
        return Math.min((bounded + jitter), cap);
    }
}
