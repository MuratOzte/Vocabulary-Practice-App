import { openDB, type DBSchema } from "idb";
import initialWords from "./data/words.json";
import type { Word, Progress, RecordWord } from "./engine";
import { exampleFor } from "./examples";
interface Database extends DBSchema {
  words: { key: string; value: Word };
  progress: { key: string; value: Progress };
  meta: { key: string; value: boolean };
}
const database = () =>
  openDB<Database>("kelime-local", 1, {
    upgrade(db) {
      db.createObjectStore("words", { keyPath: "id" });
      db.createObjectStore("progress", { keyPath: "wordId" });
      db.createObjectStore("meta");
    },
  });
export async function loadWords(): Promise<RecordWord[]> {
  const db = await database();
  const tx = db.transaction(["words", "meta"], "readwrite");
  if (!(await tx.objectStore("meta").get("seeded"))) {
    for (const word of initialWords) await tx.objectStore("words").put(word);
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
export async function saveProgress(progress: Progress) {
  const db = await database();
  try {
    await db.put("progress", progress);
  } finally {
    db.close();
  }
}
export async function saveWord(word: Word) {
  const db = await database();
  try {
    await db.put("words", word);
  } finally {
    db.close();
  }
}
export interface Backup {
  version: 1;
  exportedAt: string;
  words: Word[];
  progress: Progress[];
}
export function makeBackup(words: RecordWord[]): Backup {
  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    words: words.map(({ progress: _, ...word }) => ({ ...word, example: exampleFor(word) })),
    progress: words.flatMap((w) => (w.progress ? [w.progress] : [])),
  };
}
export function validateBackup(value: unknown): Backup {
  if (!value || typeof value !== "object")
    throw new Error("Geçersiz yedek dosyası.");
  const b = value as Backup;
  if (
    b.version !== 1 ||
    typeof b.exportedAt !== "string" ||
    !Number.isFinite(Date.parse(b.exportedAt)) ||
    !Array.isArray(b.words) ||
    !Array.isArray(b.progress) ||
    b.words.length > 10000
  )
    throw new Error("Bu yedek biçimi desteklenmiyor.");
  const ids = new Set<string>();
  const string = (v: unknown, max: number) =>
    typeof v === "string" && v.trim().length > 0 && v.length <= max;
  for (const w of b.words) {
    if (
      !w ||
      !string(w.id, 200) ||
      !string(w.english, 200) ||
      !string(w.turkish, 2000) ||
      !Array.isArray(w.alternatives) ||
      !w.alternatives.every((a) => string(a, 200)) ||
      ids.has(w.id)
    )
      throw new Error("Yedekte geçersiz veya yinelenen kelime var.");
    for (const k of ["source", "originalEnglish", "originalTurkish"] as const)
      if (w[k] !== undefined && typeof w[k] !== "string")
        throw new Error("Geçersiz kaynak bilgisi.");
    if (w.example !== undefined && !string(w.example, 1000))
      throw new Error("Geçersiz örnek cümle.");
    ids.add(w.id);
  }
  const progressIds = new Set<string>();
  for (const p of b.progress) {
    if (
      !p ||
      !ids.has(p.wordId) ||
      progressIds.has(p.wordId) ||
      !["known", "uncertain", "unknown"].includes(p.status) ||
      !Number.isInteger(p.streak) ||
      p.streak < 0 ||
      !Number.isInteger(p.reviews) ||
      p.reviews < 1 ||
      !Number.isFinite(p.lastStudied) ||
      p.lastStudied < 0 ||
      !Number.isFinite(p.nextReview) ||
      p.nextReview < p.lastStudied ||
      p.nextReview > 8640000000000000
    )
      throw new Error("Yedekte geçersiz ilerleme kaydı var.");
    progressIds.add(p.wordId);
  }
  return b;
}
export async function restoreBackup(backup: Backup) {
  validateBackup(backup);
  const db = await database();
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
