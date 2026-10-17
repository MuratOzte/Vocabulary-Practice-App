import { describe, expect, it } from "vitest";
import { phrases } from "./data/phrases";
import { createSession, DAY, dueWords, grade, nextWord, recordAnswer } from "./engine";
import { categoryNames, isGapAnswer, localDay, phraseSummary, trackPhraseReview } from "./phrases";

describe("phrase curriculum", () => {
  it("contains at least 500 unique, complete records across all seven categories and four levels", () => {
    expect(phrases.length).toBeGreaterThanOrEqual(500);
    expect(new Set(phrases.map(w => w.id)).size).toBe(phrases.length);
    expect(new Set(phrases.map(w => w.english.toLowerCase())).size).toBe(phrases.length);
    expect(new Set(phrases.map(w => w.example)).size).toBe(phrases.length);
    expect([...new Set(phrases.map(w => w.phrase!.category))].sort()).toEqual(Object.keys(categoryNames).sort());
    expect([...new Set(phrases.map(w => w.phrase!.level))].sort()).toEqual(["A1", "A2", "B1", "B2"]);
    for (const word of phrases) {
      const p = word.phrase!;
      expect(word.turkish.length).toBeGreaterThan(2);
      expect(p.translation.length).toBeGreaterThan(5);
      expect(p.explanation.length).toBeGreaterThan(15);
      expect(p.priority).toBeGreaterThanOrEqual(1);
      expect(p.priority).toBeLessThanOrEqual(4);
      expect(p.gap.sentence.split("___")).toHaveLength(2);
      expect(p.gap.sentence.replace("___", p.gap.answer)).toBe(word.example);
      expect(p.gap.answer).toMatch(/^[a-z]+(?:'[a-z]+)?$/i);
      expect(word.example).not.toMatch(/[\[\]|]/);
    }
    for (const target of ["a", "an", "the", "to", "for", "at", "in", "on", "of"]) {
      expect(phrases.some(w => w.phrase!.gap.answer === target)).toBe(true);
    }
  });
  it("uses explicit targets rather than removing the first occurrence of a preposition", () => {
    const word = phrases.find(w => w.english === "the end of the road")!;
    expect(word.phrase!.gap.sentence).toBe("The shop is at the end ___ the road.");
    expect(isGapAnswer(word, " OF ")).toBe(true);
    expect(isGapAnswer(word, "at")).toBe(false);
    expect(isGapAnswer(phrases.find(w => w.english === "at the weekend")!, "on")).toBe(true);
    expect(isGapAnswer(phrases.find(w => w.english === "speak to someone")!, "with")).toBe(true);
  });
});

describe("shared review engine and phrase statistics", () => {
  it("schedules unknown phrases after three intervening answers and uses existing spaced intervals", () => {
    const pool = phrases.slice(0, 7);
    let session = createSession("gap", "new", pool, 7);
    const first = nextWord(session)!;
    session = recordAnswer(session, first, grade(first.id, undefined, "unknown", 0));
    for (let i = 0; i < 3; i++) {
      const word = nextWord(session)!;
      expect(word.id).not.toBe(first.id);
      session = recordAnswer(session, word, grade(word.id, undefined, "known", 0));
    }
    expect(nextWord(session)?.id).toBe(first.id);
    expect(grade(first.id, undefined, "unknown", 0).nextReview).toBe(600000);
    const known = grade(first.id, undefined, "known", 0);
    expect(known.nextReview).toBe(3 * DAY);
    expect(grade(first.id, known, "known", 0).nextReview).toBe(7 * DAY);
    expect(dueWords([{ ...first, progress: known }], DAY)).toHaveLength(0);
  });
  it("preserves error history across successful reviews, separates gap mistakes and resets the daily count", () => {
    const word = phrases[0];
    const now = new Date(2026, 9, 17, 12).getTime();
    let progress = trackPhraseReview(undefined, grade(word.id, undefined, "unknown", now), true);
    progress = trackPhraseReview(progress, grade(word.id, progress, "known", now + 1000), false);
    let summary = phraseSummary([{ ...word, progress }], now);
    expect(summary.today).toBe(2);
    expect(summary.learned).toBe(1);
    expect(summary.targets[0]).toEqual({ name: "for", mistakes: 1, attempts: 1 });
    expect(summary.categories[0]).toMatchObject({ mistakes: 1, attempts: 2 });
    expect(localDay(now)).toBe("2026-10-17");
    expect(phraseSummary([{ ...word, progress }], now + DAY).today).toBe(0);
    progress = trackPhraseReview(progress, grade(word.id, progress, "known", now + DAY), true);
    expect(progress.phraseStats).toMatchObject({ attempts: 3, mistakes: 1, gapAttempts: 2, gapMistakes: 1, dailyReviews: 1 });
    summary = phraseSummary([{ ...word, progress }], now + DAY);
    expect(summary.today).toBe(1);
  });
});
