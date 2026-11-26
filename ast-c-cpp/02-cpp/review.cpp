#include "review.hpp"
namespace vocabulary {
int summarize(const Review& review) {
    auto adjust = [](int x) { return x + 2; };
    return clamp(adjust(review(2)), 100);
}
}
