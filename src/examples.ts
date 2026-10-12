import sentences from "./data/examples.json";
import type { Word } from "./engine";

export function exampleFor(word: Word): string | undefined {
  return word.example?.trim() || (sentences as Record<string, string>)[word.english.trim().toLowerCase()];
}
