#include <algorithm>
#include <cmath>
#include <string>
namespace school {
class Rubric {
 public:
  explicit Rubric(int bonus = 2) : bonus_(bonus) {}
  int grade(int score) { return std::clamp(score + bonus_, 0, 100); }
  int grade(double score) { return std::clamp(static_cast<int>(std::lround(score)) + bonus_, 0, 100); }
  int grade(const std::string& answer) { return answer.empty() ? 0 : 100; }
  int grade(int score) const { return std::clamp(score + bonus_, 0, 100); }
  int operator()(int score) const { return grade(score); }
  int operator()(const std::string& answer) { return grade(answer); }
 private:
  int bonus_;
};
class Archive {
 public:
  int grade(int score) const { return std::clamp(score + 2, 0, 100); }
};
int grade(int score) { return std::clamp(score + 2, 0, 100); }
}
namespace practice {
class Rubric {
 public:
  int grade(int score) const { return std::clamp(score + 2, 0, 100); }
};
}
