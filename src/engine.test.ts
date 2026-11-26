import { describe, it, expect } from "vitest";
import {
  grade,
  DAY,
  dueWords,
  reviewedWords,
  weight,
  isAnswer,
  choices,
  createSession,
  recordAnswer,
  nextWord,
  distinctWords,
  matchingBatch,
  type RecordWord,
} from "./engine";
const word = (id: string, turkish = id): RecordWord => ({
  id,
  english: id,
  turkish,
  alternatives: [],
});
describe("review scheduling", () => {
  it("reviews marked words in every status without waiting for their due date", () => {
    const marked = (["known", "uncertain", "unknown"] as const).map(status => ({
      ...word(status), progress: grade(status, undefined, status, Date.now()),
    }));
    const words = [word("new"), ...marked];
    expect(dueWords(words)).toEqual([]);
    expect(reviewedWords(words)).toEqual(marked);
    for (const status of ["known", "uncertain", "unknown"] as const)
      expect(reviewedWords(words, status).map(w => w.id)).toEqual([status]);
    expect(reviewedWords([word("new")])).toEqual([]);
  });
  it("increases successful intervals and caps at 30 days", () => {
    let p;
    const now = 100000;
    for (const days of [3, 7, 14, 30, 30]) {
      p = grade("a", p, "known", now);
      expect(p.nextReview).toBe(now + days * DAY);
    }
    expect(p?.streak).toBe(5);
  });
  it("resets the streak for uncertain and failed answers", () => {
    const old = grade("a", undefined, "known", 0);
    const bad = grade("a", old, "unknown", 10);
    expect(bad.streak).toBe(0);
    expect(bad.nextReview).toBe(600010);
    const uncertain = grade("a", old, "uncertain", 10);
    expect(uncertain.nextReview).toBe(DAY + 10);
    expect(uncertain.streak).toBe(0);
    expect(grade("a", bad, "known", 10).nextReview).toBe(3 * DAY + 10);
  });
  it("selects only due words, ordered by oldest due timestamp", () => {
    const a = { ...word("a"), progress: grade("a", undefined, "unknown", 0) },
      b = { ...word("b"), progress: grade("b", undefined, "unknown", 20) };
    expect(dueWords([b, word("new"), a], 600020).map((w) => w.id)).toEqual([
      "a",
      "b",
    ]);
    expect(dueWords([a, b], 599999)).toEqual([]);
  });
});
describe("question generation and input", () => {
  it("accepts normalized words and explicit alternatives but not misspellings", () => {
    const w = { ...word("no longer"), alternatives: ["not anymore"] };
    expect(isAnswer(w, "  NO   LONGER ")).toBe(true);
    expect(isAnswer(w, "Not Anymore")).toBe(true);
    expect(isAnswer(w, "no longerr")).toBe(false);
  });
  it("excludes distractors sharing any supplied meaning", () => {
    const w = word("a", "azalmak, küçülmek"),
      b = word("b", "daralmak, küçülmek");
    const options = choices(
      w,
      [w, b, word("c", "başlamak"), word("d", "başlamak"), word("e", "bitmek")],
      () => 0.5,
    );
    expect(options.some((o) => o.id === "b")).toBe(false);
    expect(options.length).toBe(3);
    expect(options.filter((o) => o.turkish === "başlamak")).toHaveLength(1);
    expect(distinctWords([w, b], 5)).toHaveLength(1);
  });
  it("supports a one-word collection", () =>
    expect(choices(word("a"), [word("a")])).toHaveLength(1));
  it("returns no distinct words for a non-positive maximum", () => {
    const words = [word("a"), word("b")];
    expect(distinctWords(words, 0)).toEqual([]);
    expect(distinctWords(words, -1)).toEqual([]);
    expect(distinctWords(words, 1)).toEqual([words[0]]);
  });
});
describe("bounded sessions", () => {
  const pool = Array.from({ length: 12 }, (_, i) => word(String(i)));
  it("reviews every selected word once even when all answers are unknown", () => {
    let session = createSession("cards", "review", pool, "all");
    while (session.history.length < session.limit) {
      const current = nextWord(session)!;
      expect(current).toBeDefined();
      session = recordAnswer(session, current, grade(current.id, current.progress, "unknown", 0));
    }
    expect(new Set(session.history).size).toBe(pool.length);
    expect(session.scheduled).toEqual([]);
    expect(nextWord(session)).toBeUndefined();
    expect(createSession("cards", "review", pool, 10).limit).toBe(10);
  });
  it("spaces failed retries after at least three other answers", () => {
    let s = createSession("cards", "new", pool, 10);
    let w = nextWord(s)!;
    s = recordAnswer(s, w, grade(w.id, w.progress, "unknown", 0));
    for (let i = 0; i < 3; i++) {
      w = nextWord(s)!;
      expect(w.id).not.toBe("0");
      s = recordAnswer(s, w, grade(w.id, w.progress, "known", 0));
    }
    expect(nextWord(s)?.id).toBe("0");
  });
  it("ends precisely at the answer limit including repeated words", () => {
    let s = createSession("cards", "free", pool, 10);
    while (s.history.length < 10) {
      const w = nextWord(s, () => 0)!;
      s = recordAnswer(s, w, grade(w.id, w.progress, "unknown", 0));
    }
    expect(nextWord(s)).toBeUndefined();
    expect(s.results).toHaveLength(10);
    expect(new Set(s.history).size).toBeLessThan(10);
  });
  it("caps all at initial collection size and ends safely when empty", () => {
    expect(createSession("quiz", "free", pool, "all").limit).toBe(12);
    expect(nextWord(createSession("quiz", "due", [], 10))).toBeUndefined();
  });
  it("does not repeat adjacent words when an alternative is available", () => {
    let s = createSession("quiz", "free", [word("a"), word("b")], 10);
    s.limit = 10;
    for (let i = 0; i < 10; i++) {
      const w = nextWord(s, () => 0)!;
      expect(w.id).not.toBe(s.history.at(-1));
      s = recordAnswer(s, w, grade(w.id, w.progress, "known", 0));
    }
  });
  it("uses 5/3/1 selection weights", () => {
    const unknown = word("a"),
      uncertain = {
        ...word("b"),
        progress: grade("b", undefined, "uncertain", 0),
      },
      known = { ...word("c"), progress: grade("c", undefined, "known", 0) };
    expect([unknown, uncertain, known].map(weight)).toEqual([5, 3, 1]);
    const s = createSession("quiz", "free", [unknown, uncertain, known], 10);
    expect(nextWord(s, () => 0.5)?.id).toBe("a");
    expect(nextWord(s, () => 0.7)?.id).toBe("b");
    expect(nextWord(s, () => 0.95)?.id).toBe("c");
  });
  it("does not immediately retry a single failed word", () => {
    let s = createSession("cards", "new", [word("a")], 10);
    s.limit = 10;
    s = recordAnswer(s, s.pool[0], grade("a", undefined, "unknown", 0));
    expect(nextWord(s)).toBeUndefined();
  });
  it("matching respects priority and keeps batches distinct and bounded", () => {
    const s = createSession("match", "due", pool, 10);
    expect(matchingBatch(s).map((w) => w.id)).toEqual([
      "0",
      "1",
      "2",
      "3",
      "4",
    ]);
    s.limit = 2;
    expect(matchingBatch(s)).toHaveLength(2);
    expect(
      matchingBatch(
        createSession(
          "match",
          "free",
          [word("a", "same"), word("b", "same")],
          10,
        ),
      ),
    ).toHaveLength(1);
  });
  it("matching excludes a failed retry that is not eligible at batch start", () => {
    let s = createSession("match", "due", pool, 10);
    s = recordAnswer(s, pool[0], grade("0", undefined, "unknown", 0));
    s = recordAnswer(s, pool[1], grade("1", undefined, "known", 0));
    expect(matchingBatch(s).some((w) => w.id === "0")).toBe(false);
    s = recordAnswer(s, pool[2], grade("2", undefined, "known", 0));
    s = recordAnswer(s, pool[3], grade("3", undefined, "known", 0));
    expect(matchingBatch(s)[0].id).toBe("0");
    expect(matchingBatch(s)).toHaveLength(5);
  });
});
