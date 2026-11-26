#ifndef SHARED_H
#define SHARED_H
/* namespace Fake { class Template {}; } is only a comment. */
static inline int normalize(int score) {
    const char *hint = "template<class T>";
    (void)hint;
    return score < 0 ? 0 : score;
}
#endif
