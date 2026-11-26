#ifndef SCORE_API_H
#define SCORE_API_H
#include <stddef.h>
typedef struct Score { int value; } Score;
static inline int score_value(Score score) { return score.value + 1; }
#endif
