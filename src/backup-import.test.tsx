// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import App from "./App";
import { restoreBackup } from "./db";

vi.mock("./db", () => ({
  loadWords: vi.fn().mockResolvedValue([]),
  saveProgress: vi.fn(),
  saveWord: vi.fn(),
  makeBackup: vi.fn(),
  restoreBackup: vi.fn(),
}));
afterEach(() => { cleanup(); vi.clearAllMocks(); });

it("explains import checks and rejects malformed files without restoring data", async () => {
  const { container } = render(<App />);
  fireEvent.change(await screen.findByLabelText("Mod seç"), { target: { value: "settings" } });
  expect(screen.getByText(/En fazla 10 MB JSON/)).toBeTruthy();
  const input = container.querySelector('input[type="file"]')!;
  fireEvent.change(input, { target: { files: [{ size: 7, text: async () => "{broken" }] } });
  expect(await screen.findByRole("alert")).toHaveProperty("textContent", expect.stringContaining("Dosya geçerli JSON içermiyor"));
  expect(screen.queryByRole("button", { name: /Onayla ve geri yükle/ })).toBeNull();
  expect(restoreBackup).not.toHaveBeenCalled();
});
