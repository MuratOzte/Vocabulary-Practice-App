import "fake-indexeddb/auto";
import { beforeEach, describe, it, expect, vi } from "vitest";
import {
  loadWords,
  saveWord,
  saveProgress,
  makeBackup,
  restoreBackup,
  validateBackup,
} from "./db";
import { grade } from "./engine";
beforeEach(async () => {
  await new Promise<void>((resolve, reject) => {
    const r = indexedDB.deleteDatabase("kelime-local");
    r.onsuccess = () => resolve();
    r.onerror = () => reject(r.error);
  });
});
describe("local storage and backups", () => {
  it("preserves custom examples through saving and backup restoration", async () => {
    const [word] = await loadWords();
    await saveWord({ ...word, example: "The acquisition was completed yesterday." });
    const backup = makeBackup(await loadWords());
    await restoreBackup(validateBackup(JSON.parse(JSON.stringify(backup))));
    expect((await loadWords()).find((w) => w.id === word.id)?.example)
      .toBe("The acquisition was completed yesterday.");
    expect(() => validateBackup({ ...backup, words: [{ ...word, example: 123 }] }))
      .toThrow("Geçersiz örnek cümle.");
  });
  it("seeds exactly once and preserves edits and progress across reloads", async () => {
    const words = await loadWords();
    expect(words).toHaveLength(300);
    const w = words[0];
    await saveWord({ ...w, english: "edited" });
    await saveProgress(grade(w.id, undefined, "known", 0));
    const reloaded = await loadWords();
    expect(reloaded).toHaveLength(300);
    expect(reloaded.find((x) => x.id === w.id)?.english).toBe("edited");
    expect(reloaded.find((x) => x.id === w.id)?.progress?.status).toBe("known");
  });
  it("round trips words and progress without storing progress inside words", async () => {
    const initial = await loadWords();
    await saveProgress(grade(initial[0].id, undefined, "uncertain", 5));
    const all = await loadWords();
    const backup = makeBackup(all);
    expect(backup.words[0]).not.toHaveProperty("progress");
    await restoreBackup(validateBackup(JSON.parse(JSON.stringify(backup))));
    expect(makeBackup(await loadWords()).progress).toEqual(backup.progress);
  });
  it("rejects invalid backups before replacing any records", async () => {
    const original = await loadWords();
    const bad = makeBackup(original);
    bad.progress = [{ ...grade("missing", undefined, "known", 0) }];
    await expect(restoreBackup(bad)).rejects.toThrow();
    expect(await loadWords()).toEqual(original);
  });
  it("validates duplicate IDs, missing fields, impossible progress and unsupported versions", async () => {
    const original = makeBackup(await loadWords());
    expect(() => validateBackup({ ...original, version: 2 })).toThrow();
    expect(() =>
      validateBackup({
        ...original,
        words: [original.words[0], original.words[0]],
      }),
    ).toThrow();
    expect(() =>
      validateBackup({ ...original, words: [{ id: "a" }] }),
    ).toThrow();
    expect(() =>
      validateBackup({
        ...original,
        progress: [
          { ...grade(original.words[0].id, undefined, "known", 0), streak: -1 },
        ],
      }),
    ).toThrow();
  });
  it("keeps intentionally restored empty collections empty", async () => {
    await loadWords();
    await restoreBackup({
      version: 1,
      exportedAt: new Date().toISOString(),
      words: [],
      progress: [],
    });
    expect(await loadWords()).toEqual([]);
  });
  it("reports failed writes and leaves saved progress intact", async () => {
    const all = await loadWords();
    const good = grade(all[0].id, undefined, "known", 0);
    await saveProgress(good);
    const spy = vi
      .spyOn(IDBObjectStore.prototype, "put")
      .mockImplementationOnce(() => {
        throw new DOMException("Quota exceeded", "QuotaExceededError");
      });
    await expect(
      saveProgress(grade(all[0].id, good, "unknown", 0)),
    ).rejects.toThrow("Quota exceeded");
    spy.mockRestore();
    expect((await loadWords())[0].progress).toEqual(good);
  });
});
