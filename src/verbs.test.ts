import { describe, expect, it } from "vitest";
import { verbs } from "./data/verbs";
import { isAnswer } from "./engine";

describe("past simple collection", () => {
  it("contains 100 distinct English verbs with examples and both verb kinds", () => {
    expect(verbs).toHaveLength(100);
    expect(new Set(verbs.map(word => word.id)).size).toBe(100);
    expect(new Set(verbs.map(word => word.verb!.base)).size).toBe(100);
    expect(verbs.some(word => word.verb!.kind === "regular")).toBe(true);
    expect(verbs.some(word => word.verb!.kind === "irregular")).toBe(true);
    for (const word of verbs) {
      expect(word.language).toBe("en");
      expect(word.turkish).toBeTruthy();
      expect(word.example).toBeTruthy();
      expect([word.english, ...word.alternatives].some(form => new RegExp(`\\b${form}\\b`).test(word.example!.toLowerCase()))).toBe(true);
    }
  });
  it.each([
    ["go", " WENT ", true], ["go", "go", false], ["go", "gone", false],
    ["write", "written", false], ["eat", "eaten", false], ["get", "gotten", false],
    ["be", "was", true], ["be", "were", true], ["be", "been", false],
    ["learn", "learnt", true], ["learn", "learned", true],
    ["travel", "travelled", true], ["travel", "traveled", true],
    ["study", "studied", true], ["study", "studyed", false],
    ["stop", "stopped", true], ["read", "read", true], ["put", "put", true],
  ])("checks %s → %s as %s", (base, answer, expected) => {
    expect(isAnswer(verbs.find(word => word.verb!.base === base)!, answer)).toBe(expected);
  });
});
