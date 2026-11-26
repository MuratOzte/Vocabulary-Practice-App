#ifndef CATALOG_H
#define CATALOG_H
#define SCORE_LIMIT 80
#define CLAMP_SCORE(x) ((x) > SCORE_LIMIT ? SCORE_LIMIT : (x))
typedef struct Entry { const char *word; int score; } Entry;
typedef int (*score_fn)(const Entry *entry);
int score_entry(const Entry *entry);
int average_score(const Entry *entries, int count);
int total_score(const Entry *entries, int count);
#endif
