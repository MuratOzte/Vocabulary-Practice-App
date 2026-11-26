#ifndef STANDARD_LINKAGE_H
#define STANDARD_LINKAGE_H

#ifdef __cplusplus
extern "C" {
#endif

static inline int standard_sum(int value, int extra) {
    return value + extra;
}

static inline int standard_keep(int value) {
    return value * 2;
}

#ifdef __cplusplus
}
#endif

#endif
