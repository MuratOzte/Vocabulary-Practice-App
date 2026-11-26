#include "catalog.h"
int score_entry(const Entry *entry) {
    if (!entry || !entry->word || entry->score < 0) return 0;
    return CLAMP_SCORE(entry->score);
}
int total_score(const Entry *entries, int count) {
    int total = 0;
#ifdef ENABLE_SCORING
    for (int i = 0; i < count; ++i) total += score_entry(&entries[i]) * 2;
#else
    (void)entries; (void)count;
#endif
    return total;
}

int average_score(const Entry *entries, int count) {
    return count > 0 ? total_score(entries, count) / count : 0;
}
