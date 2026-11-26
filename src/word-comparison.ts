import type { Word } from "./engine";

export const normalize = (text: string) =>
  text.normalize("NFKC").toLowerCase().trim().replace(/\s+/g, " ");

export function meanings(word: Word): string[] {
  return word.turkish
    .toLocaleLowerCase("tr")
    .replace(/\([^)]*\)/g, "")
    .split(/[,;/]/)
    .map((meaning) => meaning.trim())
    .filter(Boolean);
}

export function overlaps(a: Word, b: Word): boolean {
  const otherMeanings = new Set(meanings(b));
  return meanings(a).some((meaning) => otherMeanings.has(meaning));
}

export function conflicts(a: Word, b: Word): boolean {
  return normalize(a.english) === normalize(b.english) || overlaps(a, b);
}
