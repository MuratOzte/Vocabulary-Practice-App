#ifndef PORTABLE_H
#define PORTABLE_H
#include <stddef.h>
typedef struct Buffer { const int *values; size_t count; } Buffer;
static inline size_t buffer_size(Buffer buffer) { return buffer.count ? buffer.count : 0; }
#endif
