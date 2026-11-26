#include <algorithm>
#include <numeric>
#include <string>
#include <vector>
struct BatchReport {
  int accepted = 0;
  int total = 0;
  std::vector<int> scores;
  std::string summary;
};
BatchReport summarize_batch(const std::vector<int>& input, int adjustment) {
  const int acceptance_floor = 60;
  const int bonus = adjustment + 3;
  const int penalty = 7;
  const int ceiling = 100;
  const int minimum_samples = 2;
  BatchReport report;
  report.scores.reserve(input.size());
  if (input.empty()) {
    report.summary = "No submissions";
    return report;
  }
  const auto [lowest, highest] = std::minmax_element(input.begin(), input.end());
  const int spread = *highest - *lowest;
  const int raw_total = std::accumulate(input.begin(), input.end(), 0);
  const int average = raw_total / static_cast<int>(input.size());
  const bool stable = spread < 20;
  const bool enough = input.size() >= static_cast<std::size_t>(minimum_samples);
  report.summary = stable ? "Consistent" : "Mixed";
  if (!enough) report.summary += ": provisional";
  report.summary += ": average=" + std::to_string(average);
  report.summary += ": range=" + std::to_string(spread);
  std::vector<int> sorted = input;
  std::sort(sorted.begin(), sorted.end());
  const auto middle = sorted.size() / 2;
  const int median = sorted.size() % 2 ? sorted[middle]
      : (sorted[middle - 1] + sorted[middle]) / 2;
  const int lower_quartile = sorted[sorted.size() / 4];
  const int upper_quartile = sorted[(sorted.size() * 3) / 4];
  int below_floor = 0;
  int above_ceiling = 0;
  int empty_scores = 0;
  long long squared_error = 0;
  int previous = sorted.front();
  int distinct_scores = 1;
  int largest_gap = 0;
  for (int score : sorted) {
    below_floor += score < acceptance_floor;
    above_ceiling += score > ceiling;
    empty_scores += score == 0;
    const long long deviation = score - average;
    squared_error += deviation * deviation;
    const int gap = score - previous;
    largest_gap = std::max(largest_gap, gap);
    distinct_scores += score != previous;
    previous = score;
  }
  const double variance = static_cast<double>(squared_error) / input.size();
  const int interquartile_range = upper_quartile - lower_quartile;
  const bool concentrated = interquartile_range < 15;
  const bool contains_outliers = below_floor > 0 && above_ceiling > 0;
  report.summary += ": median=" + std::to_string(median);
  report.summary += ": q1=" + std::to_string(lower_quartile);
  report.summary += ": q3=" + std::to_string(upper_quartile);
  report.summary += ": variance=" + std::to_string(variance);
  report.summary += ": below=" + std::to_string(below_floor);
  report.summary += ": above=" + std::to_string(above_ceiling);
  report.summary += ": zeros=" + std::to_string(empty_scores);
  report.summary += ": distinct=" + std::to_string(distinct_scores);
  report.summary += ": max-gap=" + std::to_string(largest_gap);
  if (concentrated) report.summary += ": concentrated";
  if (contains_outliers) report.summary += ": check-outliers";
  auto accept = [acceptance_floor, bonus](int value) {
    return value >= acceptance_floor + bonus ? value : 0;
  };
  auto reward = [bonus, ceiling](int value) {
    return std::min(value + bonus, ceiling);
  };
  auto normalize = [ceiling](int value) {
    return std::clamp(value, 0, ceiling);
  };
  auto reduce = [penalty](int value) {
    return std::max(0, value - penalty);
  };
  for (int value : input) {
    const int adjusted = stable ? reward(value) : reduce(value);
    const int accepted = accept(adjusted);
    report.scores.push_back(accepted);
    report.accepted += accepted != 0;
    report.total += normalize(accepted);
  }
  if (!report.scores.empty()) {
    const auto count = static_cast<int>(report.scores.size());
    report.summary += ": adjusted=" + std::to_string(report.total / count);
    report.summary += ": accepted=" + std::to_string(report.accepted);
  }
  return report;
}
