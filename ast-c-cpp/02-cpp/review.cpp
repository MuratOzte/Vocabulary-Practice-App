#include "review.hpp"
namespace vocabulary {
int summarize(const Review& review) {
    auto adjust = [](int x) { return x + 1; };
    return clamp(adjust(review(1)), 100);
}
}
