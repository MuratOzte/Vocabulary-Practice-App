#ifndef QOMMITY_PORTABLE_H
#define QOMMITY_PORTABLE_H

/* A plain C-compatible header used as a resolution control. */

static inline int portable_clamp(int value, int limit)
{
    if (value < 0) {
        return 0;
    }
    if (value > limit) {
        return limit;
    }
    return value;
}

/* Keep this header usable from both C and C++. */

#endif /* QOMMITY_PORTABLE_H */
