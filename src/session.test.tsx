// @vitest-environment jsdom
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { StudySession } from "./App";
import { createSession, type RecordWord } from "./engine";
import { saveProgress } from "./db";
vi.mock("./db", () => ({
  saveProgress: vi.fn(),
  loadWords: vi.fn(),
  saveWord: vi.fn(),
  makeBackup: vi.fn(),
  validateBackup: vi.fn(),
  restoreBackup: vi.fn(),
}));
const save = vi.mocked(saveProgress);
const pool: RecordWord[] = [
  { id: "a", english: "apple", turkish: "elma", alternatives: [] },
  { id: "b", english: "book", turkish: "kitap", alternatives: [] },
];
beforeEach(() => {
  save.mockReset();
  save.mockResolvedValue(undefined);
});
afterEach(cleanup);
describe("study flows", () => {
  it("cards require a flip, lock double clicks, and advance only after storage succeeds", async () => {
    let complete!: () => void;
    save.mockImplementation(
      () =>
        new Promise<void>((resolve) => {
          complete = resolve;
        }),
    );
    render(
      <StudySession
        initial={createSession("cards", "new", pool, 10)}
        allWords={pool}
        onUpdate={() => {}}
        onExit={() => {}}
      />,
    );
    const rating = screen.getByRole("button", {
      name: "Biliyorum",
    });
    expect((rating as HTMLButtonElement).disabled).toBe(true);
    fireEvent.click(
      screen.getByRole("button", { name: "Türkçe anlamı göster" }),
    );
    fireEvent.click(rating);
    fireEvent.click(rating);
    expect(save).toHaveBeenCalledTimes(1);
    expect(screen.getByText("0 / 2")).toBeTruthy();
    await act(async () => complete());
    expect(screen.getByText("1 / 2")).toBeTruthy();
    expect(screen.getAllByText("book").length).toBeGreaterThan(0);
  });
  it("a failed save stays on the same card and retries once successfully", async () => {
    save.mockRejectedValueOnce(new Error("Quota exceeded"));
    render(
      <StudySession
        initial={createSession("cards", "new", pool, 10)}
        allWords={pool}
        onUpdate={() => {}}
        onExit={() => {}}
      />,
    );
    fireEvent.click(
      screen.getByRole("button", { name: "Türkçe anlamı göster" }),
    );
    fireEvent.click(
      screen.getByRole("button", { name: "Bilmiyorum" }),
    );
    await screen.findByRole("alert");
    expect(screen.getByText("0 / 2")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Yeniden dene" }));
    await screen.findByText("1 / 2");
    expect(save).toHaveBeenCalledTimes(2);
    expect(save.mock.calls[1][0].status).toBe("unknown");
  });
  it("quiz saves once and waits for Continue before the next question", async () => {
    render(
      <StudySession
        initial={createSession("quiz", "due", pool, 10)}
        allWords={pool}
        onUpdate={() => {}}
        onExit={() => {}}
      />,
    );
    const correct = screen.getByRole("button", { name: /elma/ });
    fireEvent.click(correct);
    fireEvent.click(correct);
    await screen.findByText("Doğru, hatırladın.");
    expect(save).toHaveBeenCalledTimes(1);
    expect(save.mock.calls[0][0].status).toBe("known");
    fireEvent.click(screen.getByRole("button", { name: "Devam" }));
    expect(screen.getByText("book")).toBeTruthy();
  });
  it("writing normalizes the answer, saves automatically and ends at the limit", async () => {
    const initial = createSession("write", "new", [pool[0]], 10);
    render(
      <StudySession
        initial={initial}
        allWords={pool}
        onUpdate={() => {}}
        onExit={() => {}}
      />,
    );
    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "  APPLE  " },
    });
    fireEvent.click(screen.getByRole("button", { name: "Kontrol et" }));
    await screen.findByText("Doğru, hatırladın.");
    expect(save.mock.calls[0][0].status).toBe("known");
    fireEvent.click(screen.getByRole("button", { name: "Devam" }));
    expect(screen.getByText("Güzel bir tekrar.")).toBeTruthy();
    expect(save).toHaveBeenCalledTimes(1);
  });
  it("writing records misspellings as unknown", async () => {
    render(
      <StudySession
        initial={createSession("write", "new", pool, 10)}
        allWords={pool}
        onUpdate={() => {}}
        onExit={() => {}}
      />,
    );
    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "appl" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Kontrol et" }));
    await screen.findByText("Bir sonraki tekrarda hatırlarsın.");
    expect(save.mock.calls[0][0].status).toBe("unknown");
  });
  it("matching records a previously mismatched word as unknown exactly once", async () => {
    render(
      <StudySession
        initial={createSession("match", "new", pool, 10)}
        allWords={pool}
        onUpdate={() => {}}
        onExit={() => {}}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: "apple" }));
    fireEvent.click(screen.getByRole("button", { name: "kitap" }));
    expect(save).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole("button", { name: "apple" }));
    fireEvent.click(screen.getByRole("button", { name: "elma" }));
    await waitFor(() => expect(screen.getByText("1 / 2")).toBeTruthy());
    expect(save).toHaveBeenCalledTimes(1);
    expect(save.mock.calls[0][0].status).toBe("unknown");
    fireEvent.click(screen.getByRole("button", { name: "book" }));
    fireEvent.click(screen.getByRole("button", { name: "kitap" }));
    await screen.findByRole("button", { name: "Sonuçları gör" });
    expect(save).toHaveBeenCalledTimes(2);
    fireEvent.click(screen.getByRole("button", { name: "Sonuçları gör" }));
    expect(screen.getByText("Güzel bir tekrar.")).toBeTruthy();
  });
  it("empty daily sessions show a safe summary", () => {
    render(
      <StudySession
        initial={createSession("cards", "due", [], 10)}
        allWords={pool}
        onUpdate={() => {}}
        onExit={() => {}}
      />,
    );
    expect(screen.getByText("Güzel bir tekrar.")).toBeTruthy();
    expect(save).not.toHaveBeenCalled();
  });
});
