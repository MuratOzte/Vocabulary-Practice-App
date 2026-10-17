import { normalize, type PhraseCategory, type Progress, type RecordWord } from "./engine";

export const categoryNames: Record<PhraseCategory, string> = {
  verb_preposition: "Fiil + Edat",
  adjective_preposition: "Sıfat + Edat",
  verb_noun: "Fiil + İsim",
  noun_phrase: "İsim Grupları",
  common_expression: "Günlük İfadeler",
  sentence_pattern: "Cümle Kalıpları",
  phrasal_verb: "Phrasal Verbs",
};
export function localDay(now = Date.now()) {
  const date = new Date(now);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
export function trackPhraseReview(previous: Progress | undefined, progress: Progress, gap: boolean): Progress {
  const old = previous?.phraseStats;
  const day = localDay(progress.lastStudied);
  const wrong = progress.status === "unknown" ? 1 : 0;
  return { ...progress, phraseStats: {
    attempts: (old?.attempts ?? 0) + 1,
    mistakes: (old?.mistakes ?? 0) + wrong,
    gapAttempts: (old?.gapAttempts ?? 0) + Number(gap),
    gapMistakes: (old?.gapMistakes ?? 0) + (gap ? wrong : 0),
    day,
    dailyReviews: (old?.day === day ? old.dailyReviews : 0) + 1,
  } };
}
export const isGapAnswer = (word: RecordWord, input: string) =>
  !!word.phrase && [word.phrase.gap.answer, ...(word.phrase.gap.alternatives ?? [])].some(answer => normalize(answer) === normalize(input));

export function phraseSummary(words: RecordWord[], now = Date.now()) {
  const day = localDay(now);
  const categories = new Map<string, { attempts: number; mistakes: number }>();
  const targets = new Map<string, { attempts: number; mistakes: number }>();
  let today = 0;
  for (const word of words) {
    const stats = word.progress?.phraseStats;
    if (!stats || !word.phrase) continue;
    if (stats.day === day) today += stats.dailyReviews;
    const key = categoryNames[word.phrase.category];
    const cat = categories.get(key) ?? { attempts: 0, mistakes: 0 };
    categories.set(key, { attempts: cat.attempts + stats.attempts, mistakes: cat.mistakes + stats.mistakes });
    if (stats.gapAttempts) {
      const key = word.phrase.gap.answer;
      const target = targets.get(key) ?? { attempts: 0, mistakes: 0 };
      targets.set(key, { attempts: target.attempts + stats.gapAttempts, mistakes: target.mistakes + stats.gapMistakes });
    }
  }
  const rank = (map: Map<string, { attempts: number; mistakes: number }>) =>
    [...map].map(([name, stats]) => ({ name, ...stats })).filter(x => x.mistakes > 0)
      .sort((a, b) => b.mistakes - a.mistakes || b.mistakes / b.attempts - a.mistakes / a.attempts).slice(0, 5);
  return { today, learned: words.filter(w => w.progress?.status === "known").length, categories: rank(categories), targets: rank(targets) };
}
