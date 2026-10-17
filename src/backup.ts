import type { Word, Progress, RecordWord } from "./engine";
import { exampleFor } from "./examples";
import type { Language } from "./language";

export const MAX_BACKUP_BYTES = 10_000_000;

export async function readBackupFile(
  file: Pick<File, "size" | "text">,
  language: Language = "en",
): Promise<Backup> {
  if (file.size > MAX_BACKUP_BYTES)
    throw new Error("Dosya en fazla 10 MB olabilir.");
  const text = await file.text();
  let value: unknown;
  try {
    value = JSON.parse(text);
  } catch {
    throw new Error("Dosya geçerli JSON içermiyor. Uygulamadan indirdiğin yedeği seç.");
  }
  return validateBackup(value, language);
}

export interface Backup {
  version: 1;
  exportedAt: string;
  words: Word[];
  progress: Progress[];
  language?: Language;
}
export function makeBackup(words: RecordWord[], language: Language = "en"): Backup {
  return {
    version: 1,
    language,
    exportedAt: new Date().toISOString(),
    words: words.map(({ progress: _, ...word }) => ({ ...word, example: exampleFor(word) })),
    progress: words.flatMap((w) => (w.progress ? [w.progress] : [])),
  };
}
export function validateBackup(value: unknown, language: Language = "en"): Backup {
  if (!value || typeof value !== "object")
    throw new Error("Geçersiz yedek dosyası.");
  const b = value as Backup;
  if ((b.language ?? "en") !== language) throw new Error("Bu yedek farklı bir dile ait. Doğru dilin sayfasından yükle.");
  if (
    b.version !== 1 ||
    typeof b.exportedAt !== "string" ||
    !Number.isFinite(Date.parse(b.exportedAt)) ||
    !Array.isArray(b.words) ||
    !Array.isArray(b.progress) ||
    b.words.length > 10000 ||
    b.progress.length > b.words.length
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
    if (language === "ja") {
      if (w.language !== "ja" || !string(w.japanese, 200) || w.english !== w.japanese ||
          !string(w.kana, 200) || !string(w.romaji, 200) ||
          !["hiragana", "katakana", "vocabulary"].includes(w.section ?? ""))
        throw new Error("Geçersiz Japonca kelime, okunuş veya bölüm bilgisi.");
      if ((w.section === "hiragana" || w.section === "katakana") &&
          ([...w.japanese!].length !== 1 || w.turkish !== w.romaji ||
           !new RegExp(w.section === "hiragana" ? "^[ぁ-ゖ]$" : "^[ァ-ヺ]$").test(w.japanese!)))
        throw new Error("Alfabe kaydı tek kana karakteri ve romaji okunuşu içermeli.");
    } else if (w.language === "ja" || w.japanese !== undefined) {
      throw new Error("İngilizce koleksiyonuna Japonca kayıt yüklenemez.");
    }
    for (const k of ["exampleRomaji", "exampleTurkish"] as const)
      if (w[k] !== undefined && !string(w[k], 1000)) throw new Error("Geçersiz örnek cümle okunuşu veya çevirisi.");
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
