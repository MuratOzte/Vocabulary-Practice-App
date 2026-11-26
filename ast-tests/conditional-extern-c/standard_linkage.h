#ifndef STANDARD_LINKAGE_H
#define STANDARD_LINKAGE_H

#ifdef __cplusplus
extern "C" {
#endif

static inline int standard_sum(int value) {
    return value + 1;
}

static inline int standard_keep(int value) {
    return value * 2;
}

#ifdef __cplusplus
}
#endif

#endif
