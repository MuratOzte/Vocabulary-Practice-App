import { openDB, type DBSchema } from "idb";
import initialWords from "./data/words.json";
import type { Word, Progress, RecordWord } from "./engine";
import { validateBackup, type Backup } from "./backup";
export { makeBackup, validateBackup, type Backup } from "./backup";
import { japaneseWords } from "./data/japanese";
import type { Language } from "./language";
interface Database extends DBSchema {
  words: { key: string; value: Word };
  progress: { key: string; value: Progress };
  meta: { key: string; value: boolean };
}
const database = (language: Language = "en") =>
  openDB<Database>(language === "ja" ? "kelime-japanese-local" : "kelime-local", 1, {
    upgrade(db) {
      db.createObjectStore("words", { keyPath: "id" });
      db.createObjectStore("progress", { keyPath: "wordId" });
      db.createObjectStore("meta");
    },
  });
export async function loadWords(language: Language = "en"): Promise<RecordWord[]> {
  const db = await database(language);
  const tx = db.transaction(["words", "meta"], "readwrite");
  if (!(await tx.objectStore("meta").get("seeded"))) {
    for (const word of language === "ja" ? japaneseWords : initialWords) await tx.objectStore("words").put(word);
    await tx.objectStore("meta").put(true, "seeded");
  }
  await tx.done;
  const [words, progress] = await Promise.all([
    db.getAll("words"),
    db.getAll("progress"),
  ]);
  db.close();
  const map = new Map(progress.map((p) => [p.wordId, p]));
  return words.map((w) => ({ ...w, progress: map.get(w.id) }));
}
export async function saveProgress(progress: Progress, language: Language = "en") {
  const db = await database(language);
  try {
    await db.put("progress", progress);
  } finally {
    db.close();
  }
}
export async function saveWord(word: Word, language: Language = "en") {
  validateBackup({ version: 1, language, exportedAt: new Date().toISOString(), words: [word], progress: [] }, language);
  const db = await database(language);
  try {
    await db.put("words", word);
  } finally {
    db.close();
  }
}
export async function restoreBackup(backup: Backup, language: Language = "en") {
  validateBackup(backup, language);
  const db = await database(language);
  try {
    const tx = db.transaction(["words", "progress", "meta"], "readwrite");
    await tx.objectStore("words").clear();
    await tx.objectStore("progress").clear();
    for (const w of backup.words) await tx.objectStore("words").put(w);
    for (const p of backup.progress) await tx.objectStore("progress").put(p);
    await tx.objectStore("meta").put(true, "seeded");
    await tx.done;
  } finally {
    db.close();
  }
}
