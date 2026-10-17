import "fake-indexeddb/auto";
import { beforeEach, describe, expect, it } from "vitest";
import { loadPhrases, savePhraseProgress } from "./phrase-db";
import { loadWords, makeBackup, restoreBackup, saveProgress } from "./db";
import { grade } from "./engine";
import { trackPhraseReview } from "./phrases";

beforeEach(async () => {
  for (const name of ["kelime-phrases-local", "kelime-local", "kelime-japanese-local"]) {
    await new Promise<void>((resolve, reject) => {
      const request = indexedDB.deleteDatabase(name);
      request.onsuccess = () => resolve(); request.onerror = () => reject(request.error);
    });
  }
});
describe("isolated phrase persistence", () => {
  it("persists progress and mistakes without changing words, Japanese or vocabulary backups", async () => {
    const words = await loadWords();
    const japanese = await loadWords("ja");
    const original = makeBackup(words);
    await saveProgress(grade(words[0].id, undefined, "known", 0));
    const [phrase] = await loadPhrases();
    const progress = trackPhraseReview(undefined, grade(phrase.id, undefined, "unknown", 1000), true);
    await savePhraseProgress(progress);
    expect((await loadPhrases()).find(w => w.id === phrase.id)?.progress).toEqual(progress);
    expect((await loadWords()).find(w => w.id === words[0].id)?.progress?.status).toBe("known");
    expect(await loadWords("ja")).toEqual(japanese);
    await restoreBackup(original);
    expect((await loadPhrases()).find(w => w.id === phrase.id)?.progress).toEqual(progress);
    expect(makeBackup(await loadWords()).words).toEqual(original.words);
    expect((await loadWords()).every(w => !w.progress)).toBe(true);
    expect(makeBackup(await loadWords()).words).toHaveLength(300);
  });
});
