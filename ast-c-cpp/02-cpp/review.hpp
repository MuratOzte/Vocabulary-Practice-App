#pragma once
namespace vocabulary {
template <typename T> T clamp(T value, T maximum) {
    return value < 0 ? 0 : (value > maximum ? maximum : value);
}
class Review {
public:
    explicit Review(int score) : score_(score) {}
    ~Review() = default;
    int grade(int bonus) const { return score_ + bonus * 2; }
    int grade(double bonus) const { return score_ + static_cast<int>(bonus * 2); }
    int operator()(int bonus) const { return grade(bonus) + 1; }
private:
    int score_;
};
}
