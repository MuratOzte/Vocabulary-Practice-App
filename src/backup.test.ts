import { describe, expect, it, vi } from "vitest";
import { MAX_BACKUP_BYTES, readBackupFile, validateBackup } from "./backup";

const backup = {
  version: 1,
  exportedAt: "2026-10-17T00:00:00.000Z",
  words: [{ id: "apple", english: "apple", turkish: "elma", alternatives: [] }],
  progress: [],
};
const file = (text: string) => ({ size: new TextEncoder().encode(text).length, text: async () => text });

describe("backup file boundary", () => {
  it("accepts legacy English backups and empty collections", async () => {
    await expect(readBackupFile(file(JSON.stringify(backup)))).resolves.toEqual(backup);
    const empty = { ...backup, words: [] };
    await expect(readBackupFile(file(JSON.stringify(empty)))).resolves.toEqual(empty);
  });

  it("rejects oversized files before reading their contents", async () => {
    const text = vi.fn();
    await expect(readBackupFile({ size: MAX_BACKUP_BYTES + 1, text })).rejects.toThrow("10 MB");
    expect(text).not.toHaveBeenCalled();
  });

  it("allows the exact size limit to proceed to schema validation", async () => {
    await expect(readBackupFile({ size: MAX_BACKUP_BYTES, text: async () => JSON.stringify(backup) }))
      .resolves.toEqual(backup);
  });

  it("provides a readable error for malformed JSON", async () => {
    await expect(readBackupFile(file("{broken"))).rejects.toThrow("Dosya geçerli JSON içermiyor");
  });

  it("rejects wrong-language and unsupported payloads", async () => {
    await expect(readBackupFile(file(JSON.stringify(backup)), "ja")).rejects.toThrow("farklı bir dile");
    await expect(readBackupFile(file('{"version":2}'))).rejects.toThrow("desteklenmiyor");
  });

  it("rejects excess progress entries before inspecting their fields", () => {
    expect(() => validateBackup({ ...backup, progress: [null, null] }))
      .toThrow("Bu yedek biçimi desteklenmiyor.");
  });
});
