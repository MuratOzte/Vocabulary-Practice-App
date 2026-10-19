import "fake-indexeddb/auto";
import { afterEach, expect, it } from "vitest";
import { loadVerbs, saveVerbProgress } from "./verb-db";
import { loadWords, makeBackup, restoreBackup } from "./db";
import { grade } from "./engine";

afterEach(async () => {
  for (const name of ["kelime-verbs-local", "kelime-local", "kelime-japanese-local"]) {
    await new Promise<void>((resolve, reject) => {
      const request = indexedDB.deleteDatabase(name);
      request.onsuccess = () => resolve(); request.onerror = () => reject(request.error);
    });
  }
});

it("persists verb reviews independently of vocabulary, Japanese and vocabulary restores", async () => {
  const english = await loadWords();
  const japanese = await loadWords("ja");
  const [verb] = await loadVerbs();
  const progress = grade(verb.id, undefined, "known", 1000);
  await saveVerbProgress(progress);
  expect((await loadVerbs())[0].progress).toEqual(progress);
  expect(await loadWords()).toEqual(english);
  expect(await loadWords("ja")).toEqual(japanese);
  await restoreBackup(makeBackup(english));
  expect((await loadVerbs())[0].progress).toEqual(progress);
});
