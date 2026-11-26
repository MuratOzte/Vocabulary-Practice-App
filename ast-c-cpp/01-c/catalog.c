#include "catalog.h"
int score_entry(const Entry *entry) {
    if (!entry || !entry->word) return 0;
    return CLAMP_SCORE(entry->score);
}
int total_score(const Entry *entries, int count) {
    int total = 0;
#ifdef ENABLE_SCORING
    for (int i = 0; i < count; ++i) total += score_entry(&entries[i]);
#else
    (void)entries; (void)count;
#endif
    return total;
}
