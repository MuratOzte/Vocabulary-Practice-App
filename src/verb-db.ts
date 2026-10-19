import { openDB, type DBSchema } from "idb";
import { verbs } from "./data/verbs";
import type { Progress, RecordWord } from "./engine";

interface VerbDatabase extends DBSchema {
  progress: { key: string; value: Progress };
}
const database = () => openDB<VerbDatabase>("kelime-verbs-local", 1, {
  upgrade(db) { db.createObjectStore("progress", { keyPath: "wordId" }); },
});

export async function loadVerbs(): Promise<RecordWord[]> {
  const db = await database();
  try {
    const records = new Map((await db.getAll("progress")).map(p => [p.wordId, p]));
    return verbs.map(word => ({ ...word, progress: records.get(word.id) }));
  } finally { db.close(); }
}

export async function saveVerbProgress(progress: Progress) {
  const db = await database();
  try { await db.put("progress", progress); }
  finally { db.close(); }
}
