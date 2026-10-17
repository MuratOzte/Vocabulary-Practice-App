export type Rating = "unknown" | "uncertain" | "known";
export type Status = Rating | "new";
export type Mode = "cards" | "quiz" | "write" | "match" | "gap";
export type PhraseCategory = "verb_preposition" | "adjective_preposition" | "verb_noun" | "noun_phrase" | "common_expression" | "sentence_pattern" | "phrasal_verb";
export interface PhraseDetails {
  level: "A1" | "A2" | "B1" | "B2";
  priority: number;
  category: PhraseCategory;
  translation: string;
  explanation: string;
  commonMistake?: string;
  gap: { sentence: string; answer: string; alternatives?: string[] };
}
export interface Word {
  id: string;
  english: string;
  turkish: string;
  alternatives: string[];
  example?: string;
  source?: string;
  originalEnglish?: string;
  originalTurkish?: string;
  language?: "en" | "ja";
  japanese?: string;
  kana?: string;
  romaji?: string;
  section?: "hiragana" | "katakana" | "vocabulary";
  exampleRomaji?: string;
  exampleTurkish?: string;
  phrase?: PhraseDetails;
}
export interface Progress {
  wordId: string;
  status: Rating;
  streak: number;
  lastStudied: number;
  nextReview: number;
  reviews: number;
  phraseStats?: {
    attempts: number;
    mistakes: number;
    gapAttempts: number;
    gapMistakes: number;
    day: string;
    dailyReviews: number;
  };
}
export interface RecordWord extends Word {
  progress?: Progress;
}
export const labels: Record<Status, string> = {
  new: "Yeni",
  unknown: "Bilmiyorum",
  uncertain: "Unutabilirim",
  known: "Biliyorum",
};
export const DAY = 86400000;
export function grade(
  wordId: string,
  previous: Progress | undefined,
  rating: Rating,
  now = Date.now(),
): Progress {
  const streak = rating === "known" ? (previous?.streak ?? 0) + 1 : 0;
  const interval =
    rating === "unknown"
      ? 600000
      : rating === "uncertain"
        ? DAY
        : [3, 7, 14, 30][Math.min(streak - 1, 3)] * DAY;
  return {
    wordId,
    status: rating,
    streak,
    lastStudied: now,
    nextReview: now + interval,
    reviews: (previous?.reviews ?? 0) + 1,
  };
}
export const normalize = (text: string) =>
  text.normalize("NFKC").toLowerCase().trim().replace(/\s+/g, " ");
export function isAnswer(word: Word, answer: string) {
  const alphabet = word.section === "hiragana" || word.section === "katakana";
  const accepted = alphabet
    ? [word.japanese ?? word.english]
    : [word.japanese ?? word.english, word.kana, word.romaji, ...word.alternatives];
  return accepted.some(text => text && normalize(text) === normalize(answer));
}
export function meanings(word: Word) {
  return word.turkish
    .toLocaleLowerCase("tr")
    .replace(/\([^)]*\)/g, "")
    .split(/[,;/]/)
    .map((x) => x.trim())
    .filter(Boolean);
}
export function overlaps(a: Word, b: Word) {
  return meanings(a).some((x) => meanings(b).includes(x));
}
export function shuffle<T>(list: T[], random = Math.random): T[] {
  const result = [...list];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
export function distinctWords(
  list: RecordWord[],
  maximum: number,
): RecordWord[] {
  const result: RecordWord[] = [];
  for (const word of list)
    if (
      !result.some(
        (other) =>
          overlaps(word, other) ||
          normalize(word.english) === normalize(other.english),
      )
    ) {
      result.push(word);
      if (result.length === maximum) break;
    }
  return result;
}
export function choices(
  word: Word,
  all: RecordWord[],
  random = Math.random,
): Word[] {
  const options: Word[] = [word];
  for (const candidate of shuffle(all, random)) {
    if (
      candidate.id !== word.id &&
      !options.some(
        (other) =>
          overlaps(candidate, other) ||
          normalize(candidate.english) === normalize(other.english),
      )
    )
      options.push(candidate);
    if (options.length === 4) break;
  }
  return shuffle(options, random);
}
export const dueWords = (words: RecordWord[], now = Date.now()) =>
  words
    .filter((w) => w.progress && w.progress.nextReview <= now)
    .sort((a, b) => a.progress!.nextReview - b.progress!.nextReview);
export const reviewedWords = (words: RecordWord[], status: Rating | "all" = "all") =>
  words.filter((word) => word.progress && (status === "all" || word.progress.status === status));
export const weight = (word: RecordWord) =>
  word.progress?.status === "known"
    ? 1
    : word.progress?.status === "uncertain"
      ? 3
      : 5;
export interface Session {
  mode: Mode;
  kind: "new" | "due" | "free" | "review";
  pool: RecordWord[];
  limit: number;
  history: string[];
  scheduled: { id: string; at: number }[];
  results: Rating[];
  current?: string;
}
export function createSession(
  mode: Mode,
  kind: Session["kind"],
  pool: RecordWord[],
  size: number | "all",
): Session {
  return {
    mode,
    kind,
    pool: kind === "review" ? shuffle(pool) : [...pool],
    limit: size === "all" ? pool.length : Math.min(size, pool.length),
    history: [],
    scheduled: [],
    results: [],
  };
}
export function nextWord(
  session: Session,
  random = Math.random,
): RecordWord | undefined {
  if (session.history.length >= session.limit) return undefined;
  const recent = session.history.slice(-3);
  const retry = session.scheduled.find(
    (s) =>
      s.at <= session.history.length &&
      !recent.includes(s.id) &&
      session.pool.some((w) => w.id === s.id),
  );
  if (retry) return session.pool.find((w) => w.id === retry.id);
  let candidates = session.pool.filter((w) => !session.history.includes(w.id));
  if (session.kind === "free") {
    candidates = session.pool.filter((w) => !recent.includes(w.id));
    if (!candidates.length)
      candidates = session.pool.filter(
        (w) =>
          w.id !== session.history.at(-1) &&
          !session.scheduled.some((s) => s.id === w.id),
      );
    if (!candidates.length)
      candidates = session.pool.filter(
        (w) => !session.scheduled.some((s) => s.id === w.id),
      );
  }
  if (!candidates.length) return undefined;
  if (session.kind !== "free") return candidates[0];
  let pick = random() * candidates.reduce((sum, w) => sum + weight(w), 0);
  return candidates.find((w) => (pick -= weight(w)) < 0) ?? candidates.at(-1);
}
export function recordAnswer(
  session: Session,
  word: RecordWord,
  progress: Progress,
): Session {
  const history = [...session.history, word.id];
  const scheduled = session.scheduled.filter((s) => s.id !== word.id);
  if (progress.status === "unknown" && session.kind !== "review")
    scheduled.push({ id: word.id, at: history.length + 3 });
  return {
    ...session,
    history,
    results: [...session.results, progress.status],
    scheduled,
    pool: session.pool.map((w) => (w.id === word.id ? { ...w, progress } : w)),
    current: undefined,
  };
}
export function matchingBatch(
  session: Session,
  random = Math.random,
): RecordWord[] {
  const result: RecordWord[] = [];
  const remaining = Math.min(5, session.limit - session.history.length);
  // Do not make future retries eligible by simulating answers: pairs can be solved in any order.
  let available = [...session.pool];
  while (available.length && result.length < remaining) {
    const candidate = nextWord({ ...session, pool: available }, random);
    if (!candidate) break;
    available = available.filter((w) => w.id !== candidate.id);
    if (
      !result.some(
        (w) =>
          overlaps(w, candidate) ||
          normalize(w.english) === normalize(candidate.english),
      )
    )
      result.push(candidate);
  }
  return result;
}
