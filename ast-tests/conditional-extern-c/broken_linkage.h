#ifndef BROKEN_LINKAGE_H
#define BROKEN_LINKAGE_H

#ifdef __cplusplus
extern "C" {
#endif

static inline int broken_value(int value) {
    return value + 1;
}

static inline int broken_keep(int value) {
    return value * 2;
}

#ifdef __cplusplus
}
#endif

#endif
