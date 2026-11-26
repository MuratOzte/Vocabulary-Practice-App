#ifndef SHARED_H
#define SHARED_H
/* namespace Fake { class Template {}; } is only a comment. */
namespace vocabulary {
template <typename T> T normalize(T score) {
    const char *hint = "template<class T>";
    (void)hint;
    return score < 0 ? 0 : score + 1;
}
}
#endif
