// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import App, { StudySession } from "./App";
import { VerbLearning } from "./VerbLearning";
import { verbs } from "./data/verbs";
import { createSession, grade } from "./engine";
import { loadVerbs, saveVerbProgress } from "./verb-db";
import { loadWords, saveProgress } from "./db";
import { LanguageProvider } from "./language";

vi.mock("./verb-db", () => ({ loadVerbs: vi.fn(), saveVerbProgress: vi.fn() }));
vi.mock("./db", () => ({ loadWords: vi.fn(), saveProgress: vi.fn() }));
const go = verbs.find(word => word.verb!.base === "go")!;
const work = verbs.find(word => word.verb!.base === "work")!;
beforeEach(() => {
  vi.mocked(loadWords).mockResolvedValue([]);
  vi.mocked(loadVerbs).mockReset().mockResolvedValue([go, work]);
  vi.mocked(saveVerbProgress).mockReset().mockResolvedValue(undefined);
  vi.mocked(saveProgress).mockReset().mockResolvedValue(undefined);
});
afterEach(cleanup);

describe("English verb workspace", () => {
  it("exposes verbs only in English and locks mode switching during a session", async () => {
    const view = render(<App />);
    fireEvent.change(screen.getByLabelText("Mod seç"), { target: { value: "verbs" } });
    fireEvent.click(await screen.findByRole("button", { name: "Fiillere başla" }));
    expect((screen.getByLabelText("Mod seç") as HTMLSelectElement).disabled).toBe(true);
    fireEvent.click(screen.getByRole("button", { name: "Çalışmaya dön" }));
    fireEvent.click(within(screen.getByRole("dialog")).getByRole("button", { name: "Çalışmaya dön" }));
    await screen.findByRole("button", { name: "Fiillere başla" });
    expect((screen.getByLabelText("Mod seç") as HTMLSelectElement).disabled).toBe(false);
    view.unmount();
    render(<LanguageProvider language="ja"><App /></LanguageProvider>);
    expect(screen.queryByRole("option", { name: "Fiiller · Geçmiş zaman" })).toBeNull();
  });
  it("filters regular verbs and due reviews and disables empty sessions", async () => {
    vi.mocked(loadVerbs).mockResolvedValue([go, { ...work, progress: grade(work.id, undefined, "known", Date.now()) }]);
    render(<VerbLearning onSessionChange={() => {}} />);
    await screen.findByText("1 fiil hazır");
    fireEvent.change(screen.getByLabelText("Fiil türü"), { target: { value: "regular" } });
    expect((screen.getByRole("button", { name: "Fiillere başla" }) as HTMLButtonElement).disabled).toBe(true);
    fireEvent.change(screen.getByLabelText("Çalışılacak fiiller"), { target: { value: "free" } });
    expect(screen.getByText("1 fiil hazır")).toBeTruthy();
    fireEvent.change(screen.getByLabelText("Çalışılacak fiiller"), { target: { value: "due" } });
    expect(screen.getByText("Bu türde tekrar zamanı gelen fiil yok.")).toBeTruthy();
  });
  it("recovers from a failed initial load", async () => {
    vi.mocked(loadVerbs).mockRejectedValueOnce(new Error("storage"));
    render(<VerbLearning onSessionChange={() => {}} />);
    fireEvent.click(await screen.findByRole("button", { name: "Yeniden dene" }));
    await screen.findByText("2 fiil hazır");
  });
  it("shows the base before the card answer, saves progress and refreshes the new pool", async () => {
    vi.mocked(loadVerbs).mockResolvedValue([go]);
    render(<VerbLearning onSessionChange={() => {}} />);
    await screen.findByText("1 fiil hazır");
    fireEvent.click(screen.getByRole("button", { name: "Ezber kartları" }));
    fireEvent.click(screen.getByRole("button", { name: "Fiillere başla" }));
    expect(screen.getByText("go")).toBeTruthy();
    expect(screen.queryByText("went")).toBeNull();
    expect(screen.queryByText(go.example!)).toBeNull();
    expect((screen.getByRole("button", { name: "Biliyorum" }) as HTMLButtonElement).disabled).toBe(true);
    fireEvent.click(screen.getByRole("button", { name: "Fiilin ikinci hâlini göster" }));
    expect(document.getElementById("flash-meaning")?.textContent).toBe("went");
    expect(document.querySelector(".example-sentence")?.textContent).toBe(go.example);
    fireEvent.click(screen.getByRole("button", { name: "Biliyorum" }));
    await screen.findByText("Güzel bir tekrar.");
    expect(saveProgress).not.toHaveBeenCalled();
    fireEvent.click(screen.getAllByRole("button", { name: "Çalışmaya dön" })[0]);
    expect(screen.getByText("Bu türde yeni fiil yok. Serbest pratikle devam edebilirsin.")).toBeTruthy();
    expect(screen.getByText("bilinen fiil").textContent).toContain("1 / 1");
  });
});

it.each([["went", "known"], ["gone", "unknown"]] as const)("grades %s as %s and retries failed persistence", async (answer, status) => {
  vi.mocked(saveVerbProgress).mockRejectedValueOnce(new Error("Quota"));
  render(<StudySession initial={createSession("write", "new", [go], 10)} allWords={[go]} onUpdate={() => {}} onExit={() => {}} saveReview={saveVerbProgress} />);
  expect(screen.getByRole("heading", { name: "go" })).toBeTruthy();
  expect(screen.queryByText(go.example!)).toBeNull();
  fireEvent.change(screen.getByLabelText("Fiilin ikinci hâli"), { target: { value: answer } });
  fireEvent.click(screen.getByRole("button", { name: "Kontrol et" }));
  await screen.findByRole("alert");
  fireEvent.click(screen.getByRole("button", { name: /Yeniden dene/ }));
  await waitFor(() => expect(saveVerbProgress).toHaveBeenCalledTimes(2));
  await screen.findByText(/go → went/);
  expect(vi.mocked(saveVerbProgress).mock.calls[1][0]).toMatchObject({ wordId: go.id, status, reviews: 1 });
  expect(saveProgress).not.toHaveBeenCalled();
});
