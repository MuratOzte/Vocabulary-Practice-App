#ifndef MIXED_LINKAGE_H
#define MIXED_LINKAGE_H

#ifdef __cplusplus
extern "C" {
#endif

static inline int mixed_c(int value) {
    return value + 1;
}

#ifdef __cplusplus
}

namespace sample {
template <typename T>
T mixed_cpp(T value) {
    return value + 2;
}
}
#endif

#endif
