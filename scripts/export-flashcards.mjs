import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

function escapeHtml(text) {
  return text.replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

export function renderFlashcards(words) {
  const cards = words.map(({ english, turkish, alternatives }) => `
<article>
  <h2 lang="en">${escapeHtml(english)}</h2>
  <p lang="tr">${escapeHtml(turkish)}</p>${
    alternatives.length ? `\n  <p lang="en">${alternatives.map(escapeHtml).join(" · ")}</p>` : ""
  }
</article>`).join("\n");

  return `<!doctype html>
<html lang="tr">
<meta charset="utf-8">
<title>İngilizce çalışma kartları</title>

<h1>İngilizce çalışma kartları</h1>
<main>${cards}
</main>
</html>
`;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const [output, extra] = process.argv.slice(2);
  if (!output || extra !== undefined) {
    console.error("Usage: node scripts/export-flashcards.mjs <output.html>");
    process.exitCode = 2;
  } else {
    const source = new URL("../src/data/words.json", import.meta.url);
    const words = JSON.parse(await readFile(source, "utf8"));
    await writeFile(output, renderFlashcards(words), "utf8");
  }
}
