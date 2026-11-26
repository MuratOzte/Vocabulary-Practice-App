#ifndef SCORE_API_H
#define SCORE_API_H
#include <cstddef>
namespace school {
template<typename T> struct Score { T value; };
inline int score_value(Score<int> score) { return score.value + 2; }
}
#endif
