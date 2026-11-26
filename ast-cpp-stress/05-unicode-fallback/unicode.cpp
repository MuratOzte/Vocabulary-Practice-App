#include <algorithm>
#include <string_view>
// A localized help catalog consumed by the console training client.
static constexpr std::string_view help_catalog = R"help(
[welcome] Welcome to the daily vocabulary session 🌍
tr: Türkçe öğrenme: ığüşöç İĞÜŞÖÇ — welcome 🌍
ja: 日本語の語彙と発音 — welcome 🌍
ar: مراجعة المفردات اليومية — welcome 🌍
el: Ελληνικό λεξιλόγιο — welcome 🌍
ru: Проверка словаря — welcome 🌍
hi: दैनिक शब्दावली अभ्यास — welcome 🌍
ko: 한국어 어휘 연습 — welcome 🌍
zh: 每日词汇复习 — welcome 🌍
he: תרגול אוצר מילים — welcome 🌍
fr: Révision des mots déjà étudiés — welcome 🌍
es: Práctica de vocabulario y comprensión — welcome 🌍
de: Wörter und Aussprache üben — welcome 🌍
th: ทบทวนคำศัพท์ประจำวัน — welcome 🌍
vi: Luyện từ vựng hằng ngày — welcome 🌍
uk: Щоденна перевірка словника — welcome 🌍
pl: Ćwiczenie słownictwa — welcome 🌍
pt: Revisão de vocabulário — welcome 🌍
sv: Öva ordförråd — welcome 🌍
fi: Päivittäinen sanastoharjoitus — welcome 🌍
id: Latihan kosakata harian — welcome 🌍
[listen] Listen before revealing the answer 🎧
tr: Türkçe öğrenme: ığüşöç İĞÜŞÖÇ — listen 🎧
ja: 日本語の語彙と発音 — listen 🎧
ar: مراجعة المفردات اليومية — listen 🎧
el: Ελληνικό λεξιλόγιο — listen 🎧
ru: Проверка словаря — listen 🎧
hi: दैनिक शब्दावली अभ्यास — listen 🎧
ko: 한국어 어휘 연습 — listen 🎧
zh: 每日词汇复习 — listen 🎧
he: תרגול אוצר מילים — listen 🎧
fr: Révision des mots déjà étudiés — listen 🎧
es: Práctica de vocabulario y comprensión — listen 🎧
de: Wörter und Aussprache üben — listen 🎧
th: ทบทวนคำศัพท์ประจำวัน — listen 🎧
vi: Luyện từ vựng hằng ngày — listen 🎧
uk: Щоденна перевірка словника — listen 🎧
pl: Ćwiczenie słownictwa — listen 🎧
pt: Revisão de vocabulário — listen 🎧
sv: Öva ordförråd — listen 🎧
fi: Päivittäinen sanastoharjoitus — listen 🎧
id: Latihan kosakata harian — listen 🎧
[speak] Read the word aloud and compare pronunciation 🗣️
tr: Türkçe öğrenme: ığüşöç İĞÜŞÖÇ — speak 🗣️
ja: 日本語の語彙と発音 — speak 🗣️
ar: مراجعة المفردات اليومية — speak 🗣️
el: Ελληνικό λεξιλόγιο — speak 🗣️
ru: Проверка словаря — speak 🗣️
hi: दैनिक शब्दावली अभ्यास — speak 🗣️
ko: 한국어 어휘 연습 — speak 🗣️
zh: 每日词汇复习 — speak 🗣️
he: תרגול אוצר מילים — speak 🗣️
fr: Révision des mots déjà étudiés — speak 🗣️
es: Práctica de vocabulario y comprensión — speak 🗣️
de: Wörter und Aussprache üben — speak 🗣️
th: ทบทวนคำศัพท์ประจำวัน — speak 🗣️
vi: Luyện từ vựng hằng ngày — speak 🗣️
uk: Щоденна перевірка словника — speak 🗣️
pl: Ćwiczenie słownictwa — speak 🗣️
pt: Revisão de vocabulário — speak 🗣️
sv: Öva ordförråd — speak 🗣️
fi: Päivittäinen sanastoharjoitus — speak 🗣️
id: Latihan kosakata harian — speak 🗣️
[recall] Recall the meaning without looking at hints 🧠
tr: Türkçe öğrenme: ığüşöç İĞÜŞÖÇ — recall 🧠
ja: 日本語の語彙と発音 — recall 🧠
ar: مراجعة المفردات اليومية — recall 🧠
el: Ελληνικό λεξιλόγιο — recall 🧠
ru: Проверка словаря — recall 🧠
hi: दैनिक शब्दावली अभ्यास — recall 🧠
ko: 한국어 어휘 연습 — recall 🧠
zh: 每日词汇复习 — recall 🧠
he: תרגול אוצר מילים — recall 🧠
fr: Révision des mots déjà étudiés — recall 🧠
es: Práctica de vocabulario y comprensión — recall 🧠
de: Wörter und Aussprache üben — recall 🧠
th: ทบทวนคำศัพท์ประจำวัน — recall 🧠
vi: Luyện từ vựng hằng ngày — recall 🧠
uk: Щоденна перевірка словника — recall 🧠
pl: Ćwiczenie słownictwa — recall 🧠
pt: Revisão de vocabulário — recall 🧠
sv: Öva ordförråd — recall 🧠
fi: Päivittäinen sanastoharjoitus — recall 🧠
id: Latihan kosakata harian — recall 🧠
[retry] Retry difficult words after a short break 🔁
tr: Türkçe öğrenme: ığüşöç İĞÜŞÖÇ — retry 🔁
ja: 日本語の語彙と発音 — retry 🔁
ar: مراجعة المفردات اليومية — retry 🔁
el: Ελληνικό λεξιλόγιο — retry 🔁
ru: Проверка словаря — retry 🔁
hi: दैनिक शब्दावली अभ्यास — retry 🔁
ko: 한국어 어휘 연습 — retry 🔁
zh: 每日词汇复习 — retry 🔁
he: תרגול אוצר מילים — retry 🔁
fr: Révision des mots déjà étudiés — retry 🔁
es: Práctica de vocabulario y comprensión — retry 🔁
de: Wörter und Aussprache üben — retry 🔁
th: ทบทวนคำศัพท์ประจำวัน — retry 🔁
vi: Luyện từ vựng hằng ngày — retry 🔁
uk: Щоденна перевірка словника — retry 🔁
pl: Ćwiczenie słownictwa — retry 🔁
pt: Revisão de vocabulário — retry 🔁
sv: Öva ordförråd — retry 🔁
fi: Päivittäinen sanastoharjoitus — retry 🔁
id: Latihan kosakata harian — retry 🔁
[finish] Review your progress and save this session ✅
tr: Türkçe öğrenme: ığüşöç İĞÜŞÖÇ — finish ✅
ja: 日本語の語彙と発音 — finish ✅
ar: مراجعة المفردات اليومية — finish ✅
el: Ελληνικό λεξιλόγιο — finish ✅
ru: Проверка словаря — finish ✅
hi: दैनिक शब्दावली अभ्यास — finish ✅
ko: 한국어 어휘 연습 — finish ✅
zh: 每日词汇复习 — finish ✅
he: תרגול אוצר מילים — finish ✅
fr: Révision des mots déjà étudiés — finish ✅
es: Práctica de vocabulario y comprensión — finish ✅
de: Wörter und Aussprache üben — finish ✅
th: ทบทวนคำศัพท์ประจำวัน — finish ✅
vi: Luyện từ vựng hằng ngày — finish ✅
uk: Щоденна перевірка словника — finish ✅
pl: Ćwiczenie słownictwa — finish ✅
pt: Revisão de vocabulário — finish ✅
sv: Öva ordförråd — finish ✅
fi: Päivittäinen sanastoharjoitus — finish ✅
id: Latihan kosakata harian — finish ✅
namespace Fake { class Phantom {}; template<typename T> T ghost(T); }
)help";
struct Progress { int attempts; int correct; };
int completion_percent(Progress progress) {
  if (progress.attempts <= 0) return 0;
  return std::clamp((progress.correct + 1) * 100 / progress.attempts, 0, 100);
}
std::string_view localized_help() {
  return help_catalog;
}
int next_review_minutes(int streak) {
  return std::clamp(streak * 20, 15, 1440);
}
