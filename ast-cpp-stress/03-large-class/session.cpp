#include "session.hpp"
#include <algorithm>
#include <stdexcept>

namespace vocabulary {

Session::Session(std::string learner) : learner_(std::move(learner)) {
  if (learner_.empty()) throw std::invalid_argument("learner is required");
}

Session::~Session() = default;

bool Session::upsert(Word word) {
  if (phase_ == Phase::active || word.term.empty() || word.id == 0) return false;
  const auto id = word.id;
  word.interval_minutes = std::clamp(word.interval_minutes, minimum_interval_, maximum_interval_);
  words_.insert_or_assign(id, std::move(word));
  return true;
}

bool Session::remove(WordId id) {
  if (phase_ == Phase::active) return false;
  pending_.erase(std::remove(pending_.begin(), pending_.end(), id), pending_.end());
  return words_.erase(id) != 0;
}

bool Session::contains(WordId id) const {
  return words_.find(id) != words_.end();
}

const Session::Word* Session::find(WordId id) const {
  const auto found = words_.find(id);
  return found == words_.end() ? nullptr : &found->second;
}

bool Session::suspend(WordId id) {
  auto found = words_.find(id);
  if (found == words_.end() || phase_ == Phase::active) return false;
  found->second.suspended = true;
  return true;
}

bool Session::resume(WordId id) {
  auto found = words_.find(id);
  if (found == words_.end() || phase_ == Phase::active) return false;
  found->second.suspended = false;
  return true;
}

std::size_t Session::suspended_count() const {
  return std::count_if(words_.begin(), words_.end(), [](const auto& entry) {
    return entry.second.suspended;
  });
}

void Session::set_language(std::string language) {
  if (phase_ == Phase::active) throw std::logic_error("session is active");
  language_ = std::move(language);
}

const std::string& Session::language() const {
  return language_;
}

const std::string& Session::learner() const {
  return learner_;
}

bool Session::start() {
  if (phase_ != Phase::ready) return false;
  results_.clear();
  rebuild_pending();
  started_at_ = Clock::now();
  phase_ = pending_.empty() ? Phase::complete : Phase::active;
  return true;
}

bool Session::pause() {
  if (phase_ != Phase::active) return false;
  paused_at_ = Clock::now();
  phase_ = Phase::paused;
  return true;
}

bool Session::continue_session() {
  if (phase_ != Phase::paused) return false;
  started_at_ += Clock::now() - paused_at_;
  phase_ = Phase::active;
  update_phase();
  return true;
}

void Session::finish() {
  pending_.clear();
  phase_ = Phase::complete;
}

void Session::reset() {
  pending_.clear();
  results_.clear();
  phase_ = Phase::ready;
}

Session::Phase Session::phase() const {
  return phase_;
}

bool Session::is_active() const {
  return phase_ == Phase::active;
}

bool Session::is_complete() const {
  return phase_ == Phase::complete;
}

const Session::Word* Session::current() const {
  if (pending_.empty() || phase_ != Phase::active) return nullptr;
  return find(pending_.front());
}

bool Session::answer(Answer value, int elapsed_seconds) {
  const auto* selected = current();
  if (!selected) return false;
  const auto id = selected->id;
  auto& word = words_.at(id);
  const int elapsed = std::clamp(elapsed_seconds, 1, maximum_answer_seconds_);
  const int interval = next_interval(word, value);
  word.interval_minutes = interval;
  word.repetitions += 1;
  if (!is_correct(value)) word.failures += 1;
  results_.push_back({id, value, elapsed, interval});
  pending_.pop_front();
  update_phase();
  return true;
}

bool Session::skip() {
  if (!current()) return false;
  const auto id = pending_.front();
  pending_.pop_front();
  pending_.push_back(id);
  return true;
}

std::size_t Session::pending_count() const {
  return pending_.size();
}

std::size_t Session::result_count() const {
  return results_.size();
}

const std::vector<Session::Result>& Session::results() const {
  return results_;
}

Session::Statistics Session::statistics() const {
  Statistics result;
  result.available = words_.size();
  result.answered = results_.size();
  for (const auto& answer : results_) {
    result.elapsed_seconds += answer.elapsed_seconds;
    if (is_correct(answer.answer)) result.correct += 1;
    else result.failed += 1;
  }
  result.accuracy = result.answered ? 100.0 * result.correct / result.answered : 0.0;
  return result;
}

int Session::next_interval(const Word& word, Answer value) const {
  int interval = word.interval_minutes;
  switch (value) {
    case Answer::again: interval = minimum_interval_; break;
    case Answer::difficult: interval /= difficult_divisor_; break;
    case Answer::correct: interval *= correct_multiplier_; break;
    case Answer::easy: interval *= (easy_multiplier_ + 1); break;
  }
  return std::clamp(interval, minimum_interval_, maximum_interval_);
}

int Session::daily_target() const {
  return daily_target_;
}

void Session::set_daily_target(int count) {
  if (count <= 0) throw std::invalid_argument("target must be positive");
  daily_target_ = count;
}

bool Session::target_reached() const {
  return results_.size() >= static_cast<std::size_t>(daily_target_);
}

Session::Checkpoint Session::checkpoint() const {
  return {learner_, language_, {pending_.begin(), pending_.end()}, results_, phase_};
}

bool Session::restore(const Checkpoint& saved) {
  if (saved.learner != learner_ || phase_ == Phase::active) return false;
  for (WordId id : saved.pending) {
    if (!contains(id)) return false;
  }
  language_ = saved.language;
  pending_.assign(saved.pending.begin(), saved.pending.end());
  results_ = saved.results;
  phase_ = saved.phase;
  started_at_ = Clock::now();
  update_phase();
  return true;
}

std::vector<Session::WordId> Session::word_ids() const {
  std::vector<WordId> result;
  result.reserve(words_.size());
  for (const auto& entry : words_) result.push_back(entry.first);
  std::sort(result.begin(), result.end());
  return result;
}

std::vector<Session::WordId> Session::difficult_words() const {
  std::vector<WordId> result;
  for (const auto& entry : words_) {
    if (entry.second.failures >= difficult_failure_threshold_) result.push_back(entry.first);
  }
  std::sort(result.begin(), result.end());
  return result;
}

std::vector<Session::WordId> Session::search(const std::string& prefix) const {
  std::vector<WordId> result;
  for (const auto& entry : words_) {
    if (entry.second.term.compare(0, prefix.size(), prefix) == 0) result.push_back(entry.first);
  }
  std::sort(result.begin(), result.end());
  return result;
}

bool Session::is_correct(Answer value) {
  return value == Answer::correct || value == Answer::easy;
}

bool Session::accepts(const Word& word) const {
  return !word.suspended && (language_.empty() || word.language == language_);
}

void Session::rebuild_pending() {
  pending_.clear();
  for (WordId id : word_ids()) {
    if (accepts(words_.at(id))) pending_.push_back(id);
    if (pending_.size() >= static_cast<std::size_t>(daily_target_)) break;
  }
}

void Session::update_phase() {
  if (phase_ == Phase::active && pending_.empty()) phase_ = Phase::complete;
}

}  // namespace vocabulary
