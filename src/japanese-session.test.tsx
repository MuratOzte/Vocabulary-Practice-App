// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import App, { StudySession } from "./App";
import { createSession, type Mode, type Word } from "./engine";
import { japaneseWords, japaneseVocabulary } from "./data/japanese";
import { LanguageProvider } from "./language";
import { loadWords, saveProgress, saveWord } from "./db";
vi.mock("./db", () => ({ loadWords: vi.fn(), saveProgress: vi.fn(), saveWord: vi.fn(), makeBackup: vi.fn(), validateBackup: vi.fn(), restoreBackup: vi.fn() }));
beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(saveProgress).mockResolvedValue(undefined);
  vi.mocked(loadWords).mockResolvedValue(japaneseWords);
  localStorage.clear();
});
afterEach(cleanup);
const cat = japaneseVocabulary.find(w => w.japanese === "猫")!;
const dog = japaneseVocabulary.find(w => w.japanese === "犬")!;
const a = japaneseWords.find(w => w.japanese === "あ")!;
const i = japaneseWords.find(w => w.japanese === "い")!;
function session(mode: Mode, pool: Word[]) {
  return render(<LanguageProvider language="ja"><StudySession initial={createSession(mode, "new", pool, 10)} allWords={pool} onUpdate={() => {}} onExit={() => {}} /></LanguageProvider>);
}

describe("Japanese study interface", () => {
  it("links both addresses, scopes study sections and keeps session preferences separate", async () => {
    localStorage.setItem("kelime-session-size", "20");
    render(<LanguageProvider language="ja"><App /></LanguageProvider>);
    await screen.findByRole("button", { name: "Başla" });
    expect(vi.mocked(loadWords)).toHaveBeenCalledWith("ja");
    expect(screen.getByRole("link", { name: "日本語 · Japonca" }).getAttribute("href")).toBe("/japonca");
    expect(screen.getByRole("link", { name: "İngilizce" }).getAttribute("href")).toBe("/");
    expect(screen.getByText("200 kelime")).toBeTruthy();
    expect((screen.getByLabelText("Oturum uzunluğu") as HTMLSelectElement).value).toBe("10");
    fireEvent.change(screen.getByLabelText("Çalışma bölümü"), { target: { value: "hiragana" } });
    expect(screen.getByText("46 kelime")).toBeTruthy();
    fireEvent.change(screen.getByLabelText("Oturum uzunluğu"), { target: { value: "all" } });
    expect(localStorage.getItem("kelime-ja-session-size")).toBe("all");
    expect(localStorage.getItem("kelime-session-size")).toBe("20");
  });
  it("shows vocabulary readings and examples on the revealed card", () => {
    session("cards", [cat]);
    expect(screen.getByText("neko")).toBeTruthy();
    expect(screen.queryByText(cat.example!)).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Türkçe anlamı göster" }));
    expect(screen.getByText(cat.example!)).toBeTruthy();
    expect(screen.getByText(cat.exampleRomaji!)).toBeTruthy();
    expect(screen.getByText(cat.exampleTurkish!)).toBeTruthy();
  });
  it("hides the alphabet reading until the card is flipped", () => {
    session("cards", [a]);
    expect(screen.queryByText("a")).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Romaji okunuşunu göster" }));
    expect(screen.getAllByText("a").length).toBeGreaterThan(0);
  });
  it.each(["neko", "ねこ", "猫"])("accepts %s in writing and saves only Japanese progress", async answer => {
    session("write", [cat]);
    expect(screen.queryByText("neko")).toBeNull();
    fireEvent.change(screen.getByLabelText("Japonca cevabın"), { target: { value: answer } });
    fireEvent.click(screen.getByRole("button", { name: "Kontrol et" }));
    await screen.findByText("Doğru, hatırladın.");
    expect(screen.getByText("neko")).toBeTruthy();
    expect(saveProgress).toHaveBeenCalledWith(expect.objectContaining({ wordId: cat.id, status: "known" }), "ja");
  });
  it("asks for kana in alphabet writing and rejects simply copying romaji", async () => {
    session("write", [a]);
    expect(screen.queryByText("あ")).toBeNull();
    fireEvent.change(screen.getByLabelText("Japonca cevabın"), { target: { value: "a" } });
    fireEvent.click(screen.getByRole("button", { name: "Kontrol et" }));
    await screen.findByText("Bir sonraki tekrarda hatırlarsın.");
    expect(saveProgress).toHaveBeenCalledWith(expect.objectContaining({ status: "unknown" }), "ja");
  });
  it("reveals the alphabet reading after answering a quiz", async () => {
    session("quiz", [a, i]);
    expect(screen.queryByText("a", { selector: ".word-reading span" })).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: /^[A-D]\s*a$/ }));
    await screen.findByRole("status");
    expect(screen.getAllByText("a").length).toBeGreaterThan(1);
  });
  it.each([[cat, dog], [a, i]])("matches vocabulary or alphabet entries without leaking alphabet readings", async (first, second) => {
    session("match", [first, second]);
    if (first.section !== "vocabulary") expect(document.querySelector(".match-word .word-reading")).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: first.section === "vocabulary" ? /^猫\s*ねこ\s*neko$/ : "あ" }));
    fireEvent.click(screen.getByRole("button", { name: first.turkish }));
    await waitFor(() => expect(saveProgress).toHaveBeenCalledWith(expect.objectContaining({ wordId: first.id, status: "known" }), "ja"));
  });
  it("searches Japanese vocabulary by romaji and kana", async () => {
    render(<LanguageProvider language="ja"><App /></LanguageProvider>);
    await screen.findByRole("button", { name: "Başla" });
    fireEvent.change(screen.getByLabelText("Mod seç"), { target: { value: "words" } });
    fireEvent.change(screen.getByLabelText("Kelime veya anlam ara"), { target: { value: "neko" } });
    expect(screen.getByText("猫")).toBeTruthy();
    expect(screen.queryByText("犬")).toBeNull();
    fireEvent.change(screen.getByLabelText("Kelime veya anlam ara"), { target: { value: "ねこ" } });
    expect(screen.getByText("猫")).toBeTruthy();
  });
  it("preserves Japanese readings, examples and section when editing a word", async () => {
    render(<LanguageProvider language="ja"><App /></LanguageProvider>);
    await screen.findByRole("button", { name: "Başla" });
    fireEvent.change(screen.getByLabelText("Mod seç"), { target: { value: "words" } });
    fireEvent.change(screen.getByLabelText("Kelime veya anlam ara"), { target: { value: "neko" } });
    fireEvent.click(screen.getByText("猫"));
    expect((screen.getByLabelText("Kana okunuşu") as HTMLInputElement).value).toBe("ねこ");
    expect((screen.getByLabelText("Romaji") as HTMLInputElement).value).toBe("neko");
    fireEvent.change(screen.getByLabelText("Örnek cümle Türkçe çevirisi"), { target: { value: "Burada bir kedi var." } });
    fireEvent.click(screen.getByRole("button", { name: "Kaydet" }));
    await waitFor(() => expect(saveWord).toHaveBeenCalledWith(expect.objectContaining({
      japanese: "猫", kana: "ねこ", romaji: "neko", section: "vocabulary", exampleTurkish: "Burada bir kedi var.",
    }), "ja"));
  });
});
