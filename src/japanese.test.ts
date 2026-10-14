import "fake-indexeddb/auto";
import { afterEach, describe, expect, it } from "vitest";
import { japaneseWords, japaneseVocabulary } from "./data/japanese";
import { grade, isAnswer } from "./engine";
import { loadWords, makeBackup, restoreBackup, saveProgress, saveWord, validateBackup } from "./db";
import { languageAtPath } from "./language";

afterEach(async () => {
  for (const name of ["kelime-local", "kelime-japanese-local"]) {
    await new Promise<void>((resolve, reject) => {
      const request = indexedDB.deleteDatabase(name);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }
});

describe("Japanese collection and answers", () => {
  it("contains 200 complete vocabulary entries and 46 characters in each alphabet", () => {
    expect(japaneseVocabulary).toHaveLength(200);
    expect(japaneseWords).toHaveLength(292);
    expect(new Set(japaneseWords.map(w => w.id)).size).toBe(292);
    for (const section of ["hiragana", "katakana"]) {
      const alphabet = japaneseWords.filter(w => w.section === section);
      expect(alphabet).toHaveLength(46);
      expect(new Set(alphabet.map(w => w.japanese)).size).toBe(46);
    }
    for (const word of japaneseVocabulary) {
      for (const field of ["japanese", "kana", "romaji", "turkish", "example", "exampleRomaji", "exampleTurkish"] as const)
        expect(word[field]?.trim(), `${word.id}: ${field}`).toBeTruthy();
    }
    expect(() => validateBackup(makeBackup(japaneseWords, "ja"), "ja")).not.toThrow();
  });
  it("accepts Japanese, kana, romaji and explicit long vowels without dropping vowel length", () => {
    const cat = japaneseVocabulary.find(w => w.japanese === "猫")!;
    for (const answer of ["猫", "ねこ", "neko", " NEKO "]) expect(isAnswer(cat, answer)).toBe(true);
    const school = japaneseVocabulary.find(w => w.japanese === "学校")!;
    for (const answer of ["学校", "がっこう", "gakkō", "gakkou"]) expect(isAnswer(school, answer)).toBe(true);
    for (const answer of ["gakko", "gakou", "がつこう", "ガッコウ"]) expect(isAnswer(school, answer)).toBe(false);
    expect(isAnswer(japaneseVocabulary.find(w => w.japanese === "大きい")!, "ookii")).toBe(true);
    expect(isAnswer(japaneseVocabulary.find(w => w.japanese === "空港")!, "kuukou")).toBe(true);
    expect(isAnswer(japaneseVocabulary.find(w => w.japanese === "コーヒー")!, "koohii")).toBe(true);
  });
  it("requires the requested alphabet character in writing mode", () => {
    const a = japaneseWords.find(w => w.japanese === "あ")!;
    expect(isAnswer(a, "あ")).toBe(true);
    for (const answer of ["a", "ア", "ぁ"]) expect(isAnswer(a, answer)).toBe(false);
  });
  it("resolves both direct Japanese paths while leaving the root English", () => {
    expect(languageAtPath("/")).toBe("en");
    expect(languageAtPath("/japonca")).toBe("ja");
    expect(languageAtPath("/japonca/")).toBe("ja");
  });
});

describe("separate Japanese storage", () => {
  it("preserves independent edits and ratings across reloads and backup restoration", async () => {
    const english = await loadWords();
    const japanese = await loadWords("ja");
    await saveProgress(grade(japanese[0].id, undefined, "known", 0), "ja");
    await saveWord({ ...japanese[0], exampleTurkish: "Kişisel çeviri" }, "ja");
    const backup = makeBackup(await loadWords("ja"), "ja");
    await restoreBackup(validateBackup(JSON.parse(JSON.stringify(backup)), "ja"), "ja");
    const reloaded = await loadWords("ja");
    expect(reloaded).toHaveLength(292);
    expect(reloaded.find(w => w.id === japanese[0].id)?.progress?.status).toBe("known");
    expect(reloaded.find(w => w.id === japanese[0].id)?.exampleTurkish).toBe("Kişisel çeviri");
    expect(await loadWords()).toEqual(english);
  });
  it("rejects cross-language and malformed backups before replacing records", async () => {
    const ja = await loadWords("ja");
    const en = await loadWords();
    await expect(restoreBackup(makeBackup(en), "ja")).rejects.toThrow("farklı bir dile");
    await expect(restoreBackup(makeBackup(ja, "ja"))).rejects.toThrow("farklı bir dile");
    const invalid = { ...makeBackup(ja, "ja"), words: [{ ...ja[0], romaji: "" }] };
    await expect(restoreBackup(invalid, "ja")).rejects.toThrow("Geçersiz Japonca");
    expect(await loadWords("ja")).toEqual(ja);
    expect(() => validateBackup({ ...makeBackup(en), language: undefined })).not.toThrow();
    expect(() => validateBackup({ ...makeBackup(ja, "ja"), language: "en" })).toThrow();
  });
});
