// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { PronunciationButton } from "./PronunciationButton";

const speak = vi.fn();
const cancel = vi.fn();
const englishVoice = { lang: "en-US", name: "English" };
const getVoices = vi.fn();
class Utterance {
  constructor(public text: string) {}
  lang = "";
  rate = 1;
  voice: unknown = null;
  onend: (() => void) | null = null;
  onerror: ((event: { error: string }) => void) | null = null;
}
beforeEach(() => {
  vi.clearAllMocks();
  getVoices.mockReturnValue([{ lang: "tr-TR" }, englishVoice]);
  vi.stubGlobal("speechSynthesis", { speak, cancel, getVoices });
  vi.stubGlobal("SpeechSynthesisUtterance", Utterance);
});
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe("pronunciation", () => {
  it("speaks only on click with an English voice and lets the user stop", () => {
    render(<PronunciationButton text="apple" />);
    expect(speak).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole("button"));
    const utterance = speak.mock.calls[0][0] as Utterance;
    expect(utterance.text).toBe("apple");
    expect(utterance.voice).toBe(englishVoice);
    expect(utterance.lang).toBe("en-US");
    fireEvent.click(screen.getByRole("button", { name: /durdur/ }));
    expect(cancel).toHaveBeenCalledTimes(2);
    expect(speak).toHaveBeenCalledTimes(1);
  });
  it("uses voices loaded later and stops when the word changes or view closes", () => {
    getVoices.mockReturnValueOnce([]);
    const view = render(<PronunciationButton text="apple" />);
    fireEvent.click(screen.getByRole("button"));
    expect(speak.mock.calls[0][0].voice).toBe(englishVoice);
    view.rerender(<PronunciationButton text="book" />);
    expect(cancel).toHaveBeenCalledTimes(2);
    fireEvent.click(screen.getByRole("button", { name: /book/ }));
    view.unmount();
    expect(cancel).toHaveBeenCalledTimes(4);
  });
  it("falls back to the English language when no voice is loaded", () => {
    getVoices.mockReturnValue([]);
    render(<PronunciationButton text="book" />);
    fireEvent.click(screen.getByRole("button"));
    expect(speak.mock.calls[0][0].lang).toBe("en-US");
    expect(speak.mock.calls[0][0].voice).toBeNull();
  });
  it("shows a recoverable playback error", () => {
    speak.mockImplementationOnce(() => { throw new Error("Unavailable"); });
    render(<PronunciationButton text="apple" />);
    fireEvent.click(screen.getByRole("button"));
    expect(screen.getByRole("alert")).toBeTruthy();
    fireEvent.click(screen.getByRole("button"));
    expect(screen.queryByRole("alert")).toBeNull();
    expect(speak).toHaveBeenCalledTimes(2);
  });
  it("disables playback in unsupported browsers", () => {
    vi.stubGlobal("speechSynthesis", undefined);
    // An absent API is different from an available property with no value.
    Reflect.deleteProperty(window, "speechSynthesis");
    render(<PronunciationButton text="apple" />);
    expect((screen.getByRole("button") as HTMLButtonElement).disabled).toBe(true);
  });
});
