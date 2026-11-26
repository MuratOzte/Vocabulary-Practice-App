#ifndef VOCABULARY_SESSION_HPP
#define VOCABULARY_SESSION_HPP

#include <chrono>
#include <cstddef>
#include <cstdint>
#include <deque>
#include <optional>
#include <string>
#include <unordered_map>
#include <utility>
#include <vector>

namespace vocabulary {

// A single learner's revision queue. Storage and network access belong to the
// caller so that a session can be used offline and checkpointed explicitly.
class Session {
 public:
  using Clock = std::chrono::steady_clock;
  using WordId = std::uint64_t;

  enum class Answer {
    again,
    difficult,
    correct,
    easy
  };

  enum class Phase {
    ready,
    active,
    paused,
    complete
  };

  struct Word {
    WordId id;
    std::string term;
    std::string translation;
    std::string language;
    int interval_minutes = 15;
    int repetitions = 0;
    int failures = 0;
    bool suspended = false;
  };

  struct Result {
    WordId word;
    Answer answer;
    int elapsed_seconds;
    int next_interval;
  };

  struct Statistics {
    std::size_t available = 0;
    std::size_t answered = 0;
    std::size_t correct = 0;
    std::size_t failed = 0;
    int elapsed_seconds = 0;
    double accuracy = 0.0;
  };

  struct Checkpoint {
    std::string learner;
    std::string language;
    std::vector<WordId> pending;
    std::vector<Result> results;
    Phase phase = Phase::ready;
  };

  // The learner key is stable across checkpoint imports.
  explicit Session(std::string learner);
  ~Session();

  // Queue state must have one owner. Callers can export a checkpoint instead
  // of copying partially answered sessions.
  Session(const Session&) = delete;
  Session& operator=(const Session&) = delete;
  Session(Session&&) noexcept = default;
  Session& operator=(Session&&) noexcept = default;

  // Add or replace a word before starting a session. Duplicate identifiers
  // preserve their original position in the pending queue.
  bool upsert(Word word);
  bool remove(WordId id);
  bool contains(WordId id) const;
  const Word* find(WordId id) const;

  // A suspended word is retained in storage and omitted from the next queue.
  bool suspend(WordId id);
  bool resume(WordId id);
  std::size_t suspended_count() const;

  // The language filter is applied when start() builds the pending queue.
  void set_language(std::string language);
  const std::string& language() const;
  const std::string& learner() const;

  // Starting an empty queue completes immediately. Resuming a paused session
  // keeps the same current word and its already recorded results.
  bool start();
  bool pause();
  bool continue_session();
  void finish();
  void reset();

  Phase phase() const;
  bool is_active() const;
  bool is_complete() const;

  // Reading the current word never consumes it. A successful answer records
  // exactly one result and advances to the next word.
  const Word* current() const;
  bool answer(Answer value, int elapsed_seconds);
  bool skip();

  std::size_t pending_count() const;
  std::size_t result_count() const;
  const std::vector<Result>& results() const;
  Statistics statistics() const;

  // Intervals are expressed in minutes; elapsed answer time is in seconds.
  int next_interval(const Word& word, Answer value) const;
  int daily_target() const;
  void set_daily_target(int count);
  bool target_reached() const;

  // Exported checkpoints carry identifiers, not copies of the dictionary.
  // Import fails if any pending identifier is absent from this session.
  Checkpoint checkpoint() const;
  bool restore(const Checkpoint& saved);

  // Deterministic ordering makes an offline report comparable with a later
  // server result without requiring a stable unordered_map iteration order.
  std::vector<WordId> word_ids() const;
  std::vector<WordId> difficult_words() const;
  std::vector<WordId> search(const std::string& prefix) const;

  // Projection avoids exposing mutable dictionary entries to the caller.
  template<typename Projection>
  auto project_pending(Projection projection) const {
    using Value = decltype(projection(std::declval<const Word&>()));
    std::vector<Value> values;
    values.reserve(pending_.size());
    for (WordId id : pending_) {
      const auto found = words_.find(id);
      if (found != words_.end()) values.push_back(projection(found->second));
    }
    return values;
  }

  // Visit completed answers without allocating another result vector.
  template<typename Visitor>
  void visit_results(Visitor visitor) const {
    for (const auto& result : results_) visitor(result);
  }

  // A caller can compute a report with an application-specific accumulator.
  template<typename Accumulator, typename Fold>
  Accumulator fold_results(Accumulator initial, Fold fold) const {
    for (const auto& result : results_) initial = fold(std::move(initial), result);
    return initial;
  }

 protected:
  // Protected policy helpers keep reporting and scheduling consistent.
  static bool is_correct(Answer value);
  bool accepts(const Word& word) const;
  void rebuild_pending();
  void update_phase();

 private:
  // These defaults are part of the scheduling policy, not display settings.
  // minimum_interval_ prevents immediate retries from monopolizing the queue.
  int minimum_interval_ = 15;
  int maximum_interval_ = 60 * 24 * 30;
  int easy_multiplier_ = 3;
  int correct_multiplier_ = 2;
  int difficult_divisor_ = 2;

  // Target and response limits govern statistics and input normalization.
  int daily_target_ = 20;
  int maximum_answer_seconds_ = 600;
  int difficult_failure_threshold_ = 3;

  // Identity and filters survive reset(); only progress is cleared.
  std::string learner_;
  std::string language_;
  Phase phase_ = Phase::ready;

  // The dictionary owns strings; the queue and result log store stable IDs.
  std::unordered_map<WordId, Word> words_;
  std::deque<WordId> pending_;
  std::vector<Result> results_;

  // The clock is retained for UI timers; answer durations arrive explicitly
  // so restored sessions do not depend on the original machine's epoch.
  Clock::time_point started_at_{};
  Clock::time_point paused_at_{};
};

}  // namespace vocabulary
#endif
