import { describe, expect, it } from "vitest";
import words from "./data/words.json";
import { exampleFor } from "./examples";

describe("English example sentences", () => {
  it("provides a sentence containing the vocabulary for every bundled word", () => {
    for (const word of words) {
      const example = exampleFor(word);
      expect(example, word.english).toBeTruthy();
      expect(example!.toLowerCase(), word.english).toContain(word.english.toLowerCase());
    }
  });

  it("prefers personal examples and does not reuse an unrelated example after an edit", () => {
    expect(exampleFor({ ...words[0], example: "  Her acquisition surprised everyone.  " }))
      .toBe("Her acquisition surprised everyone.");
    expect(exampleFor({ ...words[0], english: "another word" })).toBeUndefined();
  });
});
