#ifndef UNICODE_LINKAGE_H
#define UNICODE_LINKAGE_H

/* Türkçe: ölçüm ve güvenli dönüş. */
/* 日本語: 測定と安全な変換。 */
/* Results: 🧪 ✅ 🌍 */
#ifdef __cplusplus
extern "C" {
#endif

static inline long unicode_measure(int value) {
    return value + 2;
}

static inline int unicode_keep(int value) {
    return value * 3;
}

#ifdef __cplusplus
}
#endif

#endif
