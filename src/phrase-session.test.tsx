// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import App, { StudySession } from "./App";
import { PhraseLearning } from "./PhraseLearning";
import { phrases } from "./data/phrases";
import { createSession, grade } from "./engine";
import { loadPhrases, savePhraseProgress } from "./phrase-db";
import { loadWords, saveProgress } from "./db";
import { LanguageProvider } from "./language";

vi.mock("./phrase-db", () => ({ loadPhrases: vi.fn(), savePhraseProgress: vi.fn() }));
vi.mock("./db", () => ({ loadWords: vi.fn(), saveProgress: vi.fn() }));
const wait = phrases.find(w => w.english === "wait for someone")!;
const good = phrases.find(w => w.english === "be good at something")!;
const glass = phrases.find(w => w.english === "a glass of water")!;
beforeEach(() => {
  vi.mocked(loadPhrases).mockResolvedValue([wait, good, glass]);
  vi.mocked(savePhraseProgress).mockReset().mockResolvedValue(undefined);
  vi.mocked(loadWords).mockResolvedValue([{ id: "vocab", english: "apple", turkish: "elma", alternatives: [] }]);
  vi.mocked(saveProgress).mockReset().mockResolvedValue(undefined);
});
afterEach(cleanup);

describe("English-only phrase workspace", () => {
  it("offers phrases only in English and leaves the vocabulary selection intact", async () => {
    const view = render(<App />);
    await screen.findByRole("button", { name: "Başla" });
    expect(screen.getByRole("option", { name: "Kalıplar · Edatlar" })).toBeTruthy();
    fireEvent.change(screen.getByLabelText("Mod seç"), { target: { value: "phrases" } });
    await screen.findByText("3 kalıp hazır");
    fireEvent.change(screen.getByLabelText("Mod seç"), { target: { value: "cards" } });
    expect(screen.getByText("apple")).toBeTruthy();
    expect(screen.getByText("1 kelime")).toBeTruthy();
    view.unmount();
    render(<LanguageProvider language="ja"><App /></LanguageProvider>);
    await screen.findByRole("button", { name: "Başla" });
    expect(screen.queryByRole("option", { name: "Kalıplar · Edatlar" })).toBeNull();
  });
  it("combines level, category, status and due filters and handles empty results", async () => {
    const studied = { ...wait, progress: grade(wait.id, undefined, "known", Date.now()) };
    vi.mocked(loadPhrases).mockResolvedValue([studied, good, glass]);
    render(<PhraseLearning onSessionChange={() => {}} />);
    await screen.findByText("2 kalıp hazır");
    fireEvent.change(screen.getByLabelText("Çalışılacak kalıplar"), { target: { value: "free" } });
    expect(screen.getByText("3 kalıp hazır")).toBeTruthy();
    fireEvent.change(screen.getByLabelText("Kalıp kategorisi"), { target: { value: "verb_preposition" } });
    expect(screen.getByText("1 kalıp hazır")).toBeTruthy();
    fireEvent.change(screen.getByLabelText("Kalıp durumu"), { target: { value: "new" } });
    expect((screen.getByRole("button", { name: "Kalıplara başla" }) as HTMLButtonElement).disabled).toBe(true);
    fireEvent.change(screen.getByLabelText("Kalıp durumu"), { target: { value: "known" } });
    fireEvent.change(screen.getByLabelText("Kalıp seviyesi"), { target: { value: "B2" } });
    expect(screen.queryByText("1 kalıp hazır")).toBeNull();
    fireEvent.change(screen.getByLabelText("Kalıp seviyesi"), { target: { value: "A1" } });
    expect(screen.getByText("1 kalıp hazır")).toBeTruthy();
    fireEvent.change(screen.getByLabelText("Çalışılacak kalıplar"), { target: { value: "due" } });
    expect(screen.getByText("Bu filtrelerde tekrar zamanı gelen kalıp yok.")).toBeTruthy();
  });
  it("shows Turkish first, reveals the phrase, grades and updates daily progress", async () => {
    vi.mocked(loadPhrases).mockResolvedValue([wait]);
    const active = vi.fn();
    render(<PhraseLearning onSessionChange={active} />);
    fireEvent.click(await screen.findByRole("button", { name: "Kalıplara başla" }));
    expect(active).toHaveBeenCalledWith(true);
    expect(screen.queryByText(wait.english)).toBeNull();
    expect(screen.queryByText(wait.example!)).toBeNull();
    expect((screen.getByRole("button", { name: "Biliyorum" }) as HTMLButtonElement).disabled).toBe(true);
    fireEvent.click(screen.getByRole("button", { name: "İngilizce kalıbı göster" }));
    expect(screen.getByText(wait.english)).toBeTruthy();
    expect(screen.getByText(wait.phrase!.explanation)).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Biliyorum" }));
    await screen.findByText("Güzel bir tekrar.");
    expect(savePhraseProgress).toHaveBeenCalledTimes(1);
    expect(vi.mocked(savePhraseProgress).mock.calls[0][0]).toMatchObject({ wordId: wait.id, status: "known", phraseStats: { attempts: 1, mistakes: 0, dailyReviews: 1 } });
    expect(saveProgress).not.toHaveBeenCalled();
    fireEvent.click(screen.getAllByRole("button", { name: "Çalışmaya dön" })[0]);
    expect(active).toHaveBeenLastCalledWith(false);
    expect(screen.getByText("Yeni kalıplar", { selector: "option" })).toBeTruthy();
    expect(screen.getByText("öğrenilen kalıp").textContent).toContain("1 / 1");
  });
});

describe("gap exercise in the existing study session", () => {
  it.each([["for", "known"], ["to", "unknown"]] as const)("grades %s as %s and records the missing-word result", async (input, status) => {
    render(<StudySession initial={createSession("gap", "new", [wait], 10)} allWords={[wait]} onUpdate={() => {}} onExit={() => {}} saveReview={savePhraseProgress} />);
    expect(screen.getByText("I'm waiting ___ my friend.")).toBeTruthy();
    expect(screen.queryByText(wait.english)).toBeNull();
    fireEvent.change(screen.getByLabelText("Eksik kelime cevabın"), { target: { value: input } });
    fireEvent.click(screen.getByRole("button", { name: "Kontrol et" }));
    await screen.findByText(/Doğru cevap:/);
    expect(vi.mocked(savePhraseProgress).mock.calls[0][0]).toMatchObject({ wordId: wait.id, status, phraseStats: { gapAttempts: 1, gapMistakes: status === "unknown" ? 1 : 0 } });
    fireEvent.click(screen.getByRole("button", { name: "Devam" }));
    await screen.findByText("Güzel bir tekrar.");
  });
  it("keeps a failed answer pending, retries once and does not double-count attempts", async () => {
    vi.mocked(savePhraseProgress).mockRejectedValueOnce(new Error("Quota"));
    render(<StudySession initial={createSession("gap", "new", [glass], 10)} allWords={[glass]} onUpdate={() => {}} onExit={() => {}} saveReview={savePhraseProgress} />);
    fireEvent.change(screen.getByLabelText("Eksik kelime cevabın"), { target: { value: "an" } });
    fireEvent.click(screen.getByRole("button", { name: "Kontrol et" }));
    await screen.findByRole("alert");
    expect(screen.getByText("0 / 1")).toBeTruthy();
    expect(screen.queryByText(/Doğru cevap:/)).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Yeniden dene" }));
    await screen.findByText(/Doğru cevap:/);
    await waitFor(() => expect(savePhraseProgress).toHaveBeenCalledTimes(2));
    expect(vi.mocked(savePhraseProgress).mock.calls[1][0]).toMatchObject({ reviews: 1, phraseStats: { attempts: 1, mistakes: 1, gapAttempts: 1, gapMistakes: 1 } });
  });
});
