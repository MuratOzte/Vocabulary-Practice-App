#pragma once
namespace vocabulary {
template <typename T> T clamp(T value, T maximum) {
    return value > maximum ? maximum : value;
}
class Review {
public:
    explicit Review(int score) : score_(score) {}
    ~Review() = default;
    int grade(int bonus) const { return score_ + bonus; }
    int grade(double bonus) const { return score_ + static_cast<int>(bonus); }
    int operator()(int bonus) const { return grade(bonus); }
private:
    int score_;
};
}
