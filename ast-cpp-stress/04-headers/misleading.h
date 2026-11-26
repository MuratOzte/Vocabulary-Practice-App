#ifndef MISLEADING_H
#define MISLEADING_H
/* namespace classroom { template<class T> struct Scorer {}; } */
static const char *keywords = "namespace class template typename constexpr";
static inline int grade(int value) { return value + 2; }
#endif
