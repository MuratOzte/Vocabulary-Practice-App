import { openDB, type DBSchema } from "idb";
import { phrases } from "./data/phrases";
import type { Progress, RecordWord } from "./engine";

interface PhraseDatabase extends DBSchema {
  progress: { key: string; value: Progress };
}
// Separate store: word seeding, custom words and vocabulary backups stay untouched.
const database = () => openDB<PhraseDatabase>("kelime-phrases-local", 1, {
  upgrade(db) { db.createObjectStore("progress", { keyPath: "wordId" }); },
});
export async function loadPhrases(): Promise<RecordWord[]> {
  const db = await database();
  try {
    const records = new Map((await db.getAll("progress")).map(p => [p.wordId, p]));
    return phrases.map(w => ({ ...w, progress: records.get(w.id) })).sort((a, b) => a.phrase!.priority - b.phrase!.priority);
  } finally { db.close(); }
}
export async function savePhraseProgress(progress: Progress) {
  const db = await database();
  try { await db.put("progress", progress); }
  finally { db.close(); }
}
