import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { PronunciationButton } from "./PronunciationButton";
import { exampleFor } from "./examples";
import { isGapAnswer, trackPhraseReview } from "./phrases";
import { useLanguage, primaryText, WordReading, isAlphabet, AlphabetGuide, sectionNames, type JapaneseSection } from "./language";
import {
  ArrowRight,
  ArrowLeft,
  Plus,
  Search,
  X,
  Check,
  RotateCcw,
  Download,
  Upload,
  CheckCheck,
  ChevronRight,
  HardDrive,
} from "lucide-react";
import {
  createSession,
  dueWords,
  reviewedWords,
  grade,
  labels,
  choices,
  isAnswer,
  nextWord,
  recordAnswer,
  shuffle,
  matchingBatch,
  normalize,
  type Mode,
  type Session,
  type RecordWord,
  type Rating,
  type Word,
  type Status,
  type Progress,
} from "./engine";
import {
  loadWords,
  saveProgress,
  saveWord,
  makeBackup,
  validateBackup,
  restoreBackup,
  type Backup,
} from "./db";
import { readBackupFile } from "./backup";

const PhraseLearning = lazy(() => import("./PhraseLearning").then(module => ({ default: module.PhraseLearning })));
const modeNames = {
  cards: "Ezberle",
  quiz: "Anlam testi",
  write: "Yazarak hatırla",
  match: "Eşleştir",
  gap: "Boşluk doldur",
};
function PhraseNotes({ word }: { word: Word }) {
  return word.phrase ? <div className="phrase-notes"><p lang="tr">{word.phrase.translation}</p><p>{word.phrase.explanation}</p>{word.phrase.commonMistake && <p className="small"><strong>Yaygın hata:</strong> <span lang="en">{word.phrase.commonMistake}</span></p>}</div> : null;
}
function ExampleSentence({ word }: { word: Word }) {
  const example = exampleFor(word);
  if (!example) return null;
  if (word.language === "ja") return <div className="japanese-example">
    <p className="example-sentence" lang="ja">{example}</p>
    {word.exampleRomaji && <p lang="ja-Latn">{word.exampleRomaji}</p>}
    {word.exampleTurkish && <p lang="tr">{word.exampleTurkish}</p>}
  </div>;
  const vocabulary = word.english.trim();
  const escaped = vocabulary.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const parts = vocabulary
    ? example.split(new RegExp(`(?<![\\p{L}\\p{N}_])(${escaped})(?![\\p{L}\\p{N}_])`, "giu"))
    : [example];
  return (
    <p className="example-sentence" lang="en">
      {parts.map((part, index) => index % 2 === 1 ? <strong key={index}>{part}</strong> : part)}
    </p>
  );
}
const dateText = (value: number) =>
  new Intl.DateTimeFormat("tr", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(value);

export default function App() {
  const language = useLanguage();
  const japanese = language === "ja";
  const languageName = japanese ? "Japonca" : "İngilizce";
  const sizeKey = japanese ? "kelime-ja-session-size" : "kelime-session-size";
  const [section, setSection] = useState<JapaneseSection>("vocabulary");
  const [words, setWords] = useState<RecordWord[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [page, setPage] = useState<"study" | "words" | "settings" | "phrases">("study");
  const [phraseSessionActive, setPhraseSessionActive] = useState(false);
  const [size, setSize] = useState<number | "all">(() => {
    try {
      const saved = localStorage.getItem(sizeKey);
      return saved === "20" ? 20 : saved === "all" ? "all" : 10;
    } catch {
      return 10;
    }
  });
  const [mode, setMode] = useState<Mode>("cards");
  const [kind, setKind] = useState<Session["kind"]>("new");
  const [reviewStatus, setReviewStatus] = useState<Rating | "all">("all");
  const [session, setSession] = useState<Session | null>(null);
  const [editor, setEditor] = useState<Word | "new" | null>(null);
  const [notice, setNotice] = useState("");
  const [clock, setClock] = useState(Date.now());
  async function load() {
    setLoading(true);
    setLoadError(false);
    try {
      setWords(await loadWords(language));
    } catch {
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    void load();
    const timer = window.setInterval(() => setClock(Date.now()), 30000);
    return () => clearInterval(timer);
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem(sizeKey, String(size));
    } catch {
      /* Core study records remain in IndexedDB. */
    }
  }, [size]);
  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(""), 4500);
    return () => clearTimeout(timer);
  }, [notice]);
  const studyWords = japanese ? words.filter(w => w.section === section) : words;
  const due = dueWords(studyWords, clock);
  const fresh = studyWords.filter((w) => !w.progress);
  const counts = Object.fromEntries(
    (["new", "unknown", "uncertain", "known"] as Status[]).map((s) => [
      s,
      studyWords.filter((w) => (w.progress?.status ?? "new") === s).length,
    ]),
  ) as Record<Status, number>;
  function pool(kind: Session["kind"]) {
    return kind === "review" ? reviewedWords(studyWords, reviewStatus) : kind === "due" ? due : kind === "new" ? fresh : studyWords;
  }
  const effectiveKind = mode === "cards" && kind === "new" && !fresh.length ? "free" : kind;
  const selectedWords = pool(effectiveKind);
  function start() {
    if (selectedWords.length) setSession(createSession(mode, effectiveKind, selectedWords, size));
  }
  function selectView(value: string) {
    if (value === "words" || value === "settings" || (value === "phrases" && !japanese)) setPage(value);
    else {
      setPage("study");
      setMode(value === "review" ? "cards" : value as Mode);
      setKind(value === "review" ? "review" : value === "cards" && fresh.length ? "new" : "free");
    }
  }
  function updateWord(word: RecordWord) {
    setWords((all) => all.map((w) => (w.id === word.id ? word : w)));
  }
  return (
    <div className="app-shell">
      <nav className="language-nav" aria-label="Çalışma dili">
        <a href="/" className={!japanese ? "current-language" : ""} aria-current={!japanese ? "page" : undefined}>İngilizce</a>
        <a href="/japonca" className={japanese ? "current-language" : ""} aria-current={japanese ? "page" : undefined}>
          Japonca
        </a>
      </nav>
      <div className="mode-picker">
        <select aria-label="Mod seç" value={page === "study" ? ((session?.kind ?? kind) === "review" ? "review" : (session?.mode ?? mode)) : page} onChange={e => selectView(e.target.value)} disabled={!!session || phraseSessionActive}>
          <optgroup label="Çalışma modları">
            {Object.entries(modeNames).filter(([id]) => id !== "gap").map(([id, name]) => <option key={id} value={id}>{name}</option>)}
            <option value="review">Gördüğüm kelimeler</option>
          </optgroup>
          <optgroup label="Koleksiyon">
            <option value="words">Kelimeler</option>
            {!japanese && <option value="phrases">Kalıplar · Edatlar</option>}
            <option value="settings">Ayarlar</option>
          </optgroup>
        </select>
      </div>
      {page === "phrases" && !japanese ? <Suspense fallback={<main className="loading"><p>Kalıplar hazırlanıyor…</p></main>}><PhraseLearning onSessionChange={setPhraseSessionActive} /></Suspense> : loading ? (
        <main className="loading">
          <div className="loader" />
          <p>Kelimeler hazırlanıyor…</p>
        </main>
      ) : loadError ? (
        <main className="loading">
          <HardDrive size={32} />
          <h2>Kayıtlara ulaşılamadı</h2>
          <p>Tarayıcının yerel depolamaya izin verdiğinden emin ol.</p>
          <button className="primary" onClick={() => void load()}>
            Yeniden dene <RotateCcw size={17} />
          </button>
        </main>
      ) : session ? (
        <StudySession
          key={`${session.mode}-${session.kind}`}
          initial={session}
          allWords={studyWords}
          onUpdate={updateWord}
          onExit={() => setSession(null)}
        />
      ) : (
        <main className="main">
          {page === "study" && (
            <section className="simple-study">
              {japanese && <>
                <label className="section-picker">Çalışma bölümü
                  <select aria-label="Çalışma bölümü" value={section} onChange={e => setSection(e.target.value as JapaneseSection)}>
                    {Object.entries(sectionNames).map(([id, name]) => <option key={id} value={id}>{name} ({words.filter(w => w.section === id).length})</option>)}
                  </select>
                </label>
                <AlphabetGuide />
              </>}
              {effectiveKind === "review" && (
                <div className="simple-mode-intro">
                  <h1>Gördüğüm kelimeler</h1>
                  <p className="muted">İşaretlediğin kelimeleri tekrar tarihini beklemeden hatırla.</p>
                </div>
              )}
              {mode === "cards" ? (
                <div className="simple-card">
                  <span className="small muted">{languageName}</span>
                  <strong lang={language}>{selectedWords[0] ? primaryText(selectedWords[0]) : "Kelime yok"}</strong>
                  {selectedWords[0] && <><WordReading word={selectedWords[0]} reveal={!isAlphabet(selectedWords[0])} /><PronunciationButton text={primaryText(selectedWords[0])} /></>}
                </div>
              ) : (
                <div className="simple-mode-intro">
                  <h1>{modeNames[mode]}</h1>
                  <p className="muted">{mode === "quiz" ? "Doğru anlamı veya okunuşu seç." : mode === "write" ? japanese ? "Kelimeyi Japonca ya da romajiyle yaz; alfabede kana karakterini yaz." : "İngilizce karşılığını yaz." : "Kelimeleri anlamlarıyla, karakterleri okunuşlarıyla eşleştir."}</p>
                </div>
              )}
              <div className="study-options">
                {effectiveKind === "review" ? (
                  <label>Kelime durumu
                    <select aria-label="Tekrar edilecek kelime durumu" value={reviewStatus} onChange={e => setReviewStatus(e.target.value as Rating | "all")}>
                      <option value="all">Gördüğüm tüm kelimeler ({reviewedWords(studyWords).length})</option>
                      {(["known", "uncertain", "unknown"] as const).map(status => <option key={status} value={status}>{labels[status]} ({counts[status]})</option>)}
                    </select>
                  </label>
                ) : <label>Kelimeler
                  <select aria-label="Çalışılacak kelimeler" value={effectiveKind} onChange={e => setKind(e.target.value as Session["kind"])}>
                    {mode === "cards" && <option value="new" disabled={!fresh.length}>Yeni kelimeler</option>}
                    <option value="due">Günlük tekrar</option>
                    <option value="free">Serbest pratik</option>
                  </select>
                </label>}
                <label>Oturum
                  <select aria-label="Oturum uzunluğu" value={size} onChange={e => setSize(e.target.value === "all" ? "all" : Number(e.target.value))}>
                    <option value="10">10 soru</option><option value="20">20 soru</option><option value="all">Tümü</option>
                  </select>
                </label>
              </div>
              <button className="primary wide" onClick={start} disabled={!selectedWords.length}>Başla <ArrowRight size={18}/></button>
              <p className="study-count muted">{selectedWords.length ? `${selectedWords.length} kelime` : effectiveKind === "review" ? reviewStatus === "all" ? "Henüz işaretlediğin kelime yok. Ezberle modunda kelimeleri işaretleyerek başlayabilirsin." : "Bu durumda işaretlediğin kelime yok. Başka bir durum seçebilirsin." : effectiveKind === "due" ? "Şu an tekrar zamanı gelen kelime yok." : "Henüz kelime yok. Mod seçicisinden kelime ekleyebilirsin."}</p>
            </section>
          )}
          {page === "words" && (
            <WordList
              words={words}
              counts={Object.fromEntries((["new", "unknown", "uncertain", "known"] as Status[]).map(s => [s, words.filter(w => (w.progress?.status ?? "new") === s).length])) as Record<Status, number>}
              onEdit={setEditor}
              now={clock}
            />
          )}
          {page === "settings" && (
            <Settings
              words={words}
              onRestored={async () => {
                await load();
                setNotice("Yedek geri yüklendi.");
              }}
              size={size}
              setSize={setSize}
              notify={setNotice}
            />
          )}
        </main>
      )}
      {editor && (
        <WordEditor
          word={editor}
          words={words}
          onClose={() => setEditor(null)}
          onSaved={(word) => {
            setWords((all) =>
              all.some((w) => w.id === word.id)
                ? all.map((w) =>
                    w.id === word.id ? { ...word, progress: w.progress } : w,
                  )
                : [...all, word],
            );
            setEditor(null);
            setNotice("Kelime kaydedildi.");
          }}
        />
      )}
      {notice && (
        <div className="toast" role="status">
          <Check size={17} />
          {notice}
        </div>
      )}
    </div>
  );
}
function SizeSelector({
  size,
  setSize,
}: {
  size: number | "all";
  setSize: (size: number | "all") => void;
}) {
  return (
    <div className="segment">
      {([10, 20, "all"] as const).map((value) => (
        <button
          className={size === value ? "selected" : ""}
          key={value}
          onClick={() => setSize(value)}
        >
          {value === "all" ? "Tümü" : `${value} soru`}
        </button>
      ))}
    </div>
  );
}
function Modal({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  useEffect(() => {
    const old = document.activeElement as HTMLElement | null;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    ref.current?.focus();
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeRef.current();
      if (e.key === "Tab") {
        const elements = Array.from(
          ref.current?.querySelectorAll<HTMLElement>(
            "button:not(:disabled),input,textarea,select,a[href]",
          ) ?? [],
        );
        const first = elements[0],
          last = elements.at(-1);
        if (
          e.shiftKey &&
          (document.activeElement === first ||
            document.activeElement === ref.current)
        ) {
          e.preventDefault();
          last?.focus();
        } else if (
          !e.shiftKey &&
          (document.activeElement === last ||
            document.activeElement === ref.current)
        ) {
          e.preventDefault();
          first?.focus();
        }
      }
    };
    document.addEventListener("keydown", handler);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", handler);
      old?.focus();
    };
  }, []);
  return (
    <div
      className="modal-overlay"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        tabIndex={-1}
        ref={ref}
      >
        <div className="modal-header">
          <h2 id="modal-title">{title}</h2>
          <button className="icon-button" aria-label="Kapat" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function WordList({
  words,
  counts,
  onEdit,
  now,
}: {
  words: RecordWord[];
  counts: Record<Status, number>;
  onEdit: (word: Word | "new") => void;
  now: number;
}) {
  const language = useLanguage();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Status | "all">("all");
  const [section, setSection] = useState<JapaneseSection | "all">("all");
  const sectionWords = words.filter(w => section === "all" || w.section === section);
  const filtered = words
    .filter(
      (w) =>
        (section === "all" || w.section === section) &&
        (filter === "all" || (w.progress?.status ?? "new") === filter) &&
        `${primaryText(w)} ${w.kana ?? ""} ${w.romaji ?? ""} ${w.turkish} ${w.alternatives.join(" ")}`
          .toLocaleLowerCase("tr")
          .includes(search.toLocaleLowerCase("tr")),
    )
    .sort((a, b) => primaryText(a).localeCompare(primaryText(b), language));
  return (
    <>
      <div className="page-heading">
        <div>
          <p className="eyebrow">KENDİ KOLEKSİYONUN</p>
          <h1>Kelimelerin.</h1>
          <p className="muted lead">
            {words.length} kelime. İlerlemeni takip et, koleksiyonunu düzenle.
          </p>
        </div>
        <button className="primary" onClick={() => onEdit("new")}>
          <Plus size={18} /> Kelime ekle
        </button>
      </div>
      {language === "ja" && <label className="section-picker">Koleksiyon bölümü
        <select aria-label="Koleksiyon bölümü" value={section} onChange={e => setSection(e.target.value as JapaneseSection | "all")}>
          <option value="all">Tüm bölümler</option>
          {Object.entries(sectionNames).map(([id, name]) => <option key={id} value={id}>{name}</option>)}
        </select>
      </label>}
      <div className="search-box">
        <Search size={19} />
        <input
          aria-label="Kelime veya anlam ara"
          placeholder="Kelime veya anlam ara…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {search && (
          <button
            className="icon-button"
            aria-label="Aramayı temizle"
            onClick={() => setSearch("")}
          >
            <X size={17} />
          </button>
        )}
      </div>
      <div className="filter-tabs">
        {(["all", "new", "unknown", "uncertain", "known"] as const).map((s) => (
          <button
            key={s}
            className={filter === s ? "active" : ""}
            onClick={() => setFilter(s)}
          >
            {s === "all" ? "Tümü" : labels[s]}{" "}
            <span>{s === "all" ? sectionWords.length : language === "ja" ? sectionWords.filter(w => (w.progress?.status ?? "new") === s).length : counts[s]}</span>
          </button>
        ))}
      </div>
      <div className="list-heading">
        <span>KELİME / ANLAM</span>
        <span>DURUM</span>
      </div>
      <div className="word-list">
        {filtered.map((w) => (
          <div key={w.id} className="word-row-container">
          <button className="word-row" onClick={() => onEdit(w)}>
            <div>
              <strong lang={language}>{primaryText(w)}</strong>
              <WordReading word={w} />
              <p>{w.turkish}</p>
              <ExampleSentence word={w} />
            </div>
            <div className="word-state">
              <span className={`status-label ${w.progress?.status ?? "new"}`}>
                {labels[w.progress?.status ?? "new"]}
              </span>
              {w.progress && (
                <span className="review-date">
                  {w.progress.nextReview <= now
                    ? "Tekrar zamanı"
                    : dateText(w.progress.nextReview)}
                </span>
              )}
            </div>
            <ChevronRight size={17} className="row-chevron" />
          </button>
          <PronunciationButton text={primaryText(w)} />
          </div>
        ))}
      </div>
      {!filtered.length && (
        <div className="empty-state">
          <Search size={28} />
          <h3>Burada henüz kelime yok</h3>
          <p className="muted">
            Aramanı veya seçtiğin filtreyi değiştirebilirsin.
          </p>
        </div>
      )}
      <p className="list-count muted small">
        {filtered.length} kelime gösteriliyor · Düzenlemek için bir kelimeye
        dokun.
      </p>
    </>
  );
}
function WordEditor({
  word,
  words,
  onClose,
  onSaved,
}: {
  word: Word | "new";
  words: RecordWord[];
  onClose: () => void;
  onSaved: (word: Word) => void;
}) {
  const language = useLanguage();
  const japanese = language === "ja";
  const [kana, setKana] = useState(word === "new" ? "" : word.kana ?? "");
  const [romaji, setRomaji] = useState(word === "new" ? "" : word.romaji ?? "");
  const [section, setSection] = useState<JapaneseSection>(word === "new" ? "vocabulary" : word.section ?? "vocabulary");
  const [exampleRomaji, setExampleRomaji] = useState(word === "new" ? "" : word.exampleRomaji ?? "");
  const [exampleTurkish, setExampleTurkish] = useState(word === "new" ? "" : word.exampleTurkish ?? "");
  const [english, setEnglish] = useState(word === "new" ? "" : word.english),
    [turkish, setTurkish] = useState(word === "new" ? "" : word.turkish),
    [example, setExample] = useState(word === "new" ? "" : exampleFor(word) ?? ""),
    [alternatives, setAlternatives] = useState(
      word === "new" ? "" : word.alternatives.join(", "),
    );
  const [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  const lock = useRef(false);
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (lock.current) return;
    setError("");
    if (!english.trim() || ((!japanese || section === "vocabulary") && !turkish.trim()) ||
        (japanese && (!kana.trim() || !romaji.trim()))) {
      setError(japanese ? "Japonca yazım, kana, romaji ve kelimeler için Türkçe anlam alanlarını doldur." : "Kelime ve anlam alanlarını doldur.");
      return;
    }
    if (alternatives.split(",").some((a) => a.trim().length > 200)) {
      setError("Alternatif cevaplar en fazla 200 karakter olabilir.");
      return;
    }
    if (
      words.some(
        (w) =>
          w.id !== (word === "new" ? "" : word.id) &&
          normalize(w.english) === normalize(english),
      )
    ) {
      setError(
        "Bu kelime koleksiyonunda zaten var. Mevcut kaydı düzenleyebilirsin.",
      );
      return;
    }
    lock.current = true;
    setBusy(true);
    try {
      const value: Word = {
        ...(word === "new"
          ? { id: crypto.randomUUID(), source: "Kişisel" }
          : word),
        english: english.trim(),
        turkish: japanese && section !== "vocabulary" ? romaji.trim() : turkish.trim(),
        ...(japanese ? { language: "ja" as const, japanese: english.trim(), kana: kana.trim(), romaji: romaji.trim(), section, exampleRomaji: exampleRomaji.trim() || undefined, exampleTurkish: exampleTurkish.trim() || undefined } : {}),
        example: example.trim() || undefined,
        alternatives: alternatives
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      };
      const { progress: _, ...clean } = value as RecordWord;
      validateBackup({ version: 1, language, exportedAt: new Date().toISOString(), words: [clean], progress: [] }, language);
      await saveWord(clean, language);
      onSaved(clean);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Kelime kaydedilemedi. Yeniden dene.");
    } finally {
      lock.current = false;
      setBusy(false);
    }
  }
  return (
    <Modal
      title={word === "new" ? "Yeni kelime" : "Kelimeyi düzenle"}
      onClose={() => !busy && onClose()}
    >
      <form onSubmit={submit}>
        <label className="field">
          {japanese ? "Japonca yazım" : "İngilizce kelime"}
          <input
            required
            maxLength={200}
            value={english}
            onChange={(e) => setEnglish(e.target.value)}
            placeholder={japanese ? "Örn. 猫" : "Örn. flourish"}
            lang={language}
            autoComplete="off"
          />
        </label>
        {japanese && <>
          <label className="field">Bölüm<select value={section} onChange={e => setSection(e.target.value as JapaneseSection)}>{Object.entries(sectionNames).map(([id, name]) => <option key={id} value={id}>{name}</option>)}</select></label>
          <label className="field">Kana okunuşu<input required maxLength={200} lang="ja" value={kana} onChange={e => setKana(e.target.value)} placeholder="Örn. ねこ" /></label>
          <label className="field">Romaji<input required maxLength={200} value={romaji} onChange={e => setRomaji(e.target.value)} placeholder="Örn. neko" /></label>
        </>}
        <label className="field">
          {japanese && section !== "vocabulary" ? "Okunuş (romaji alanından kaydedilir)" : "Türkçe anlamı"}
          <textarea
            required={!japanese || section === "vocabulary"}
            disabled={japanese && section !== "vocabulary"}
            maxLength={2000}
            value={japanese && section !== "vocabulary" ? romaji : turkish}
            onChange={(e) => setTurkish(e.target.value)}
            placeholder="Örn. gelişmek, büyümek"
            rows={3}
          />
        </label>
        <label className="field">
          {japanese ? "Japonca örnek cümle" : "İngilizce örnek cümle"} <span className="muted small">İsteğe bağlı</span>
          <textarea
            maxLength={1000}
            value={example}
            onChange={(e) => setExample(e.target.value)}
            placeholder={japanese ? "Örn. 猫がいます。" : "Örn. Plants flourish when they receive enough light and water."}
            rows={3}
            lang={language}
          />
        </label>
        {japanese && <>
          <label className="field">Örnek cümle romajisi<input maxLength={1000} value={exampleRomaji} onChange={e => setExampleRomaji(e.target.value)} placeholder="Örn. Neko ga imasu." /></label>
          <label className="field">Örnek cümle Türkçe çevirisi<textarea maxLength={1000} value={exampleTurkish} onChange={e => setExampleTurkish(e.target.value)} placeholder="Örn. Bir kedi var." rows={2} /></label>
        </>}
        {(!japanese || section === "vocabulary") && <label className="field">
          {japanese ? "Alternatif kabul edilen cevaplar" : "Alternatif İngilizce cevaplar"}{" "}
          <span className="muted small">İsteğe bağlı</span>
          <input
            maxLength={1000}
            value={alternatives}
            onChange={(e) => setAlternatives(e.target.value)}
            placeholder={japanese ? "Virgülle ayır: gakkou" : "Virgülle ayır: nevertheless, nonetheless"}
          />
        </label>}
        {word !== "new" && word.originalEnglish && (
          <details className="source-details">
            <summary>PDF’deki özgün kayıt</summary>
            <p>
              {word.originalEnglish}: {word.originalTurkish}
            </p>
          </details>
        )}
        {error && (
          <p className="error" role="alert">
            {error}
          </p>
        )}
        <button className="primary wide" disabled={busy} type="submit">
          {busy ? "Kaydediliyor…" : "Kaydet"}
          <Check size={18} />
        </button>
      </form>
    </Modal>
  );
}

function Settings({
  words,
  onRestored,
  size,
  setSize,
  notify,
}: {
  words: RecordWord[];
  onRestored: () => Promise<void>;
  size: number | "all";
  setSize: (v: number | "all") => void;
  notify: (s: string) => void;
}) {
  const language = useLanguage();
  const [backup, setBackup] = useState<Backup | null>(null),
    [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  const file = useRef<HTMLInputElement>(null);
  function download() {
    const url = URL.createObjectURL(
      new Blob([JSON.stringify(makeBackup(words, language), null, 2)], {
        type: "application/json",
      }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = `kelime-${language}-yedek-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    notify("Yedek dosyan hazır.");
  }
  async function readFile(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0];
    e.target.value = "";
    if (!selected) return;
    setError("");
    setBackup(null);
    try {
      setBackup(await readBackupFile(selected, language));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Dosya okunamadı.");
    }
  }
  async function restore() {
    if (!backup || busy) return;
    setBusy(true);
    setError("");
    try {
      await restoreBackup(backup, language);
      setBackup(null);
      await onRestored();
    } catch {
      setError(
        "Geri yükleme tamamlanamadı. Mevcut kayıtların korundu; yeniden deneyebilirsin.",
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <div className="page-heading">
        <div>
          <p className="eyebrow">SANA GÖRE</p>
          <h1>Ayarlar.</h1>
          <p className="muted lead">Küçük tercihler, rahat bir çalışma.</p>
        </div>
      </div>
      <div className="settings-content">
        <section className="settings-section">
          <div>
            <h2>Oturum uzunluğu</h2>
            <p className="muted">Bir seferde kaç soru çalışmak istersin?</p>
          </div>
          <SizeSelector size={size} setSize={setSize} />
        </section>
        <section className="settings-section">
          <div>
            <h2>Verilerin sende.</h2>
            <p className="muted">
              {words.length} kelime ve ilerlemen bu tarayıcıda saklanıyor. Başka
              bir cihaza taşımak için yedek al.
            </p>
            <p className="muted small">
              En fazla 10 MB JSON dosyası yükleyebilirsin. Dosyanın biçimi ve dili
              kontrol edilir; kayıtların yalnızca onayından sonra değiştirilir.
            </p>
          </div>
          <div className="backup-actions">
            <button className="secondary" onClick={download}>
              <Download size={18} /> Yedek indir
            </button>
            <button
              className="secondary"
              onClick={() => {
                setError("");
                file.current?.click();
              }}
            >
              <Upload size={18} /> Yedek yükle
            </button>
            <input
              ref={file}
              type="file"
              accept=".json,application/json"
              onChange={readFile}
              hidden
            />
          </div>
          {error && (
            <p className="error" role="alert">
              {error}
            </p>
          )}
          <div className="storage-note">
            <HardDrive size={19} />
            <p>
              Tarayıcı verileri silinirse kayıtların da silinir. Yedek dosyan
              kelimelerini ve ilerlemeni geri getirir.
            </p>
          </div>
        </section>
        <section className="settings-section">
          <h2>Tekrar nasıl çalışır?</h2>
          <div className="schedule-table">
            <div>
              <span>Bilmiyorum</span>
              <strong>10 dakika</strong>
            </div>
            <div>
              <span>Unutabilirim</span>
              <strong>1 gün</strong>
            </div>
            <div>
              <span>Biliyorum</span>
              <strong>3 → 7 → 14 → 30 gün</strong>
            </div>
          </div>
          <p className="muted small">
            Başarılı cevaplarla aralık uzar. Yanlış cevapta yeniden başlar.
            Serbest pratikte zorlandığın kelimeler daha sık gelir.
          </p>
        </section>
      </div>
      {backup && (
        <Modal
          title="Yedeği geri yükle"
          onClose={() => !busy && setBackup(null)}
        >
          <p className="muted">
            Bu dosyadaki <strong>{backup.words.length} kelime</strong> ve{" "}
            <strong>{backup.progress.length} ilerleme kaydı</strong>, bu
            cihazdaki mevcut koleksiyonunun yerine geçecek.
          </p>
          <p className="small muted">
            Mevcut verilerini korumak için önce yedek indirebilirsin.
          </p>
          {error && (
            <p className="error" role="alert">
              {error}
            </p>
          )}
          <button className="secondary wide" onClick={download} disabled={busy}>
            <Download size={18} /> Mevcut verileri indir
          </button>
          <button
            className="primary wide"
            onClick={() => void restore()}
            disabled={busy}
          >
            {busy ? "Geri yükleniyor…" : "Onayla ve geri yükle"}
            <Upload size={17} />
          </button>
        </Modal>
      )}
    </>
  );
}

export function StudySession({
  initial,
  allWords,
  onUpdate,
  onExit,
  saveReview,
}: {
  initial: Session;
  allWords: RecordWord[];
  onUpdate: (w: RecordWord) => void;
  onExit: () => void;
  saveReview?: (progress: Progress) => Promise<void>;
}) {
  const language = useLanguage();
  const languageName = language === "ja" ? "Japonca" : "İngilizce";
  const [session, setSession] = useState(initial);
  const sessionRef = useRef(initial);
  const [current, setCurrent] = useState<RecordWord | undefined>(() =>
    nextWord(initial),
  );
  const [flipped, setFlipped] = useState(false),
    [input, setInput] = useState("");
  const [feedback, setFeedback] = useState<{
    rating: Rating;
    word: RecordWord;
  } | null>(null);
  const [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [confirmExit, setConfirmExit] = useState(false);
  const [options, setOptions] = useState<Word[]>(() =>
    initial.mode === "quiz" && current ? choices(current, allWords) : [],
  );
  const [batch, setBatch] = useState<RecordWord[]>(() =>
    initial.mode === "match" ? matchingBatch(initial) : [],
  );
  const [right, setRight] = useState<RecordWord[]>(() => shuffle(batch));
  const [selected, setSelected] = useState<string | null>(null),
    [matched, setMatched] = useState<string[]>([]),
    [wrong, setWrong] = useState<string[]>([]),
    [wrongPair, setWrongPair] = useState<string[]>([]);
  const [pending, setPending] = useState<{
    word: RecordWord;
    rating: Rating;
  } | null>(null);
  const lock = useRef(false);
  const finished = initial.mode === "match" ? batch.length === 0 : !current;
  const count = session.history.length;
  function applyNext(updated: Session) {
    sessionRef.current = updated;
    setSession(updated);
    const word = nextWord(updated);
    setCurrent(word);
    setFlipped(false);
    setInput("");
    setFeedback(null);
    setOptions(word && initial.mode === "quiz" ? choices(word, allWords) : []);
  }
  async function answer(word: RecordWord, rating: Rating) {
    if (
      lock.current ||
      feedback ||
      sessionRef.current.history.length >= sessionRef.current.limit
    )
      return;
    lock.current = true;
    setBusy(true);
    setError("");
    setPending({ word, rating });
    try {
      const latest =
        sessionRef.current.pool.find((w) => w.id === word.id) ?? word;
      const graded = grade(word.id, latest.progress, rating);
      const progress = word.phrase ? trackPhraseReview(latest.progress, graded, initial.mode === "gap") : graded;
      if (saveReview) await saveReview(progress);
      else await saveProgress(progress, language);
      const updated = recordAnswer(sessionRef.current, word, progress);
      onUpdate({ ...latest, progress });
      sessionRef.current = updated;
      setSession(updated);
      setPending(null);
      if (initial.mode === "cards") applyNext(updated);
      else if (initial.mode === "match") {
        setMatched((old) => [...old, word.id]);
        setSelected(null);
        setWrongPair([]);
      } else setFeedback({ rating, word });
    } catch {
      setError(
        "Cevabın kaydedilemedi. Bağlantı gerekmiyor; tarayıcının depolama iznini kontrol edip yeniden dene.",
      );
    } finally {
      lock.current = false;
      setBusy(false);
    }
  }
  function nextBatch() {
    const state = sessionRef.current;
    const value = matchingBatch(state);
    setBatch(value);
    setRight(shuffle(value));
    setMatched([]);
    setWrong([]);
    setWrongPair([]);
    setSelected(null);
  }
  function match(word: RecordWord) {
    if (!selected || busy || pending) return;
    const left = batch.find((w) => w.id === selected)!;
    if (left.id === word.id)
      void answer(left, wrong.includes(left.id) ? "unknown" : "known");
    else {
      setWrong((old) => (old.includes(left.id) ? old : [...old, left.id]));
      setWrongPair([left.id, word.id]);
      setSelected(null);
    }
  }
  return (
    <main className={`session-main ${initial.mode === "cards" && !finished ? "card-session" : ""}`}>
      <div className="session-top">
        <button
          className="text-button"
          onClick={() => (finished ? onExit() : setConfirmExit(true))}
          disabled={busy}
        >
          <ArrowLeft size={18} /> Çalışmaya dön
        </button>
        <span className="small muted">{initial.kind === "review" ? "Gördüğüm kelimeler" : modeNames[initial.mode]}</span>
        <span className="session-counter">
          {count} / {initial.limit}
        </span>
      </div>
      <div className="session-progress">
        <span
          style={{
            width: `${initial.limit ? (count / initial.limit) * 100 : 100}%`,
          }}
        />
      </div>
      {finished ? (
        <div className="session-summary">
          <div className="summary-symbol">
            <CheckCheck size={38} strokeWidth={1.5} />
          </div>
          <p className="eyebrow">BUGÜNLÜK BİR ADIM DAHA</p>
          <h1>Güzel bir tekrar.</h1>
          <p className="muted">
            {count} cevap kaydedildi.
            {count < initial.limit
              ? " Tekrarlar arasında yeterli soru kalmadığı için oturum tamamlandı."
              : ""}
          </p>
          <div className="summary-counts">
            {(["known", "uncertain", "unknown"] as Rating[]).map((r) => (
              <div key={r}>
                <strong>{session.results.filter((s) => s === r).length}</strong>
                <span>{labels[r]}</span>
              </div>
            ))}
          </div>
          <p className="muted small">
            Bir sonraki tekrar zamanı cevaplarına göre güncellendi.
          </p>
          <button className="primary" onClick={onExit}>
            Çalışmaya dön <ArrowRight size={18} />
          </button>
        </div>
      ) : (
        <>
          {initial.mode !== "cards" && (
            <p className="session-instruction muted">
              {initial.mode === "gap" ? "Cümledeki eksik kelimeyi yaz." : initial.mode === "quiz" ? current && isAlphabet(current) ? "Doğru romaji okunuşunu seç." : "Doğru Türkçe karşılığını seç." : initial.mode === "write" ? current && isAlphabet(current) ? "Okunuşun kana karakterini yaz." : language === "ja" ? "Japonca veya romaji karşılığını yaz." : "İngilizce karşılığını yaz." : "Önce kelimeyi, sonra anlamını veya okunuşunu seç."}
            </p>
          )}
          {initial.mode === "cards" && current && (
            <div className="cards-workspace">
              <button
                className={`flashcard ${current.phrase ? "phrase-flashcard" : ""} ${flipped ? "flipped" : ""}`}
                aria-describedby={flipped ? "flash-meaning" : "flash-word"}
                aria-label={
                  current.phrase ? flipped ? "Türkçe ipucunu göster" : "İngilizce kalıbı göster" : flipped ? `${languageName} kelimeyi göster` : isAlphabet(current) ? "Romaji okunuşunu göster" : "Türkçe anlamı göster"
                }
                onClick={() => !busy && !pending && setFlipped((v) => !v)}
              >
                <div className="flashcard-inner">
                  <div className="flash-face flash-front" aria-hidden={flipped}>
                    <span className="card-caption">{current.phrase ? "TÜRKÇE" : languageName.toLocaleUpperCase("tr")}</span>
                    <strong id="flash-word" lang={current.phrase ? "tr" : language}>{current.phrase ? current.turkish : primaryText(current)}</strong>
                    <WordReading word={current} reveal={!isAlphabet(current)} />
                    <span className="flip-hint">
                      <RotateCcw size={15} /> Çevir
                    </span>
                  </div>
                  <div className="flash-face flash-back" aria-hidden={!flipped}>
                    <span className="card-caption">{current.phrase ? "İNGİLİZCE KALIP" : isAlphabet(current) ? "ROMAJİ" : "TÜRKÇE"}</span>
                    <strong id="flash-meaning" lang={current.phrase ? "en" : undefined}>{current.phrase ? flipped ? primaryText(current) : "" : !isAlphabet(current) || flipped ? current.turkish : ""}</strong>
                    {!current.phrase && <span className="small muted" lang={language}>{primaryText(current)}</span>}
                    {flipped && <WordReading word={current} />}
                    {flipped && <ExampleSentence word={current} />}
                    {flipped && <PhraseNotes word={current} />}
                  </div>
                </div>
              </button>
              <div className="card-pronunciation">{(!current.phrase || flipped) && <PronunciationButton text={primaryText(current)} />}</div>
              <div className={`rating-buttons ${flipped ? "revealed" : ""}`}>
                {(["unknown", "uncertain", "known"] as Rating[]).map((r) => (
                  <button
                    key={r}
                    disabled={!flipped || busy || !!pending}
                    onClick={() => void answer(current, r)}
                    className={r === "known" ? "primary" : "secondary"}
                  >
                    {r === "unknown" ? (
                      <X size={17} />
                    ) : r === "uncertain" ? (
                      <RotateCcw size={17} />
                    ) : (
                      <Check size={17} />
                    )}
                    <span>{labels[r]}</span>
                  </button>
                ))}
              </div>

            </div>
          )}
          {initial.mode === "quiz" && current && (
            <div className="quiz-workspace" key={current.id + "-" + count}>
              <div className="question-word"><span lang={language}>{primaryText(current)}<WordReading word={current} reveal={!isAlphabet(current) || !!feedback} /></span> <PronunciationButton text={primaryText(current)} /></div>
              <div className="answer-options">
                {options.map((w, i) => (
                  <button
                    key={w.id}
                    className={`answer-option ${feedback && w.id === current.id ? "correct" : ""}`}
                    disabled={busy || !!feedback || !!pending}
                    onClick={() =>
                      void answer(
                        current,
                        w.id === current.id ? "known" : "unknown",
                      )
                    }
                  >
                    <span className="option-letter">
                      {String.fromCharCode(65 + i)}
                    </span>
                    <span>{w.turkish}</span>
                    {feedback && w.id === current.id && <Check size={19} />}
                  </button>
                ))}
              </div>
              {options.length < 4 && (
                <p className="muted small">
                  Benzer anlamları elemek için daha az seçenek gösteriliyor.
                </p>
              )}
            </div>
          )}
          {(initial.mode === "write" || initial.mode === "gap") && current && (
            <form
              className="write-workspace"
              onSubmit={(e) => {
                e.preventDefault();
                if (input.trim() && !pending)
                  void answer(
                    current,
                    (initial.mode === "gap" ? isGapAnswer(current, input) : isAnswer(current, input)) ? "known" : "unknown",
                  );
              }}
            >
              <div className="writing-prompt">
                <span className="card-caption">{initial.mode === "gap" ? "EKSİK KELİME" : isAlphabet(current) ? "ROMAJİ" : "TÜRKÇE"}</span>
                <h2 lang={initial.mode === "gap" ? "en" : "tr"}>{initial.mode === "gap" ? current.phrase?.gap.sentence : current.turkish}</h2>
                {initial.mode === "gap" && <p className="muted">{current.phrase?.translation}</p>}
                {isAlphabet(current) && current.romaji === "o" && <p className="small muted">{primaryText(current) === "を" || primaryText(current) === "ヲ" ? "Nesne parçacığı olarak kullanılan karakter." : "Beş temel ünlüden biri."}</p>}
                {initial.mode !== "gap" && language !== "ja" && allWords.some(
                  (w) =>
                    w.id !== current.id &&
                    normalize(w.turkish) === normalize(current.turkish),
                ) && (
                  <p className="small muted">
                    {current.english[0].toUpperCase()} ile başlıyor ·{" "}
                    {current.english.replace(/\s/g, "").length} harf
                  </p>
                )}
              </div>
              <label className="field">
                {initial.mode === "gap" ? "Eksik kelime" : isAlphabet(current) ? "Kana karakteri" : `${languageName} karşılığı${language === "ja" ? " veya romaji" : ""}`}
                <input
                  aria-label={initial.mode === "gap" ? "Eksik kelime cevabın" : `${languageName} cevabın`}
                  placeholder={initial.mode === "gap" ? "Eksik kelimeyi yaz…" : isAlphabet(current) ? "Kana karakterini yaz…" : language === "ja" ? "Japonca veya romaji yaz…" : "Kelimeyi buraya yaz…"}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={busy || !!feedback || !!pending}
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck={false}
                  autoComplete="off"
                  maxLength={200}
                />
              </label>
              {!feedback && (
                <button
                  className="primary wide"
                  type="submit"
                  disabled={!input.trim() || busy || !!pending}
                >
                  Kontrol et <ArrowRight size={18} />
                </button>
              )}
            </form>
          )}
          {initial.mode === "match" && (
            <div className="match-workspace">
              <div className="matching-columns">
                <div>
                  {batch.map((w) => (
                    <div key={w.id} className="match-word">
                    <button
                      className={`match-item ${selected === w.id ? "selected" : ""} ${matched.includes(w.id) ? "matched" : ""} ${wrongPair.includes(w.id) ? "incorrect" : ""}`}
                      disabled={busy || !!pending || matched.includes(w.id)}
                      onClick={() => {
                        setSelected(selected === w.id ? null : w.id);
                        setWrongPair([]);
                      }}
                    >
                      <span lang={language}>{primaryText(w)}<WordReading word={w} reveal={!isAlphabet(w) || matched.includes(w.id)} /></span>
                      {matched.includes(w.id) && <Check size={16} />}
                    </button>
                    <PronunciationButton text={primaryText(w)} />
                    </div>
                  ))}
                </div>
                <div>
                  {right.map((w) => (
                    <button
                      key={w.id}
                      className={`match-item ${matched.includes(w.id) ? "matched" : ""} ${wrongPair.includes(w.id) ? "incorrect" : ""}`}
                      disabled={
                        !selected || busy || !!pending || matched.includes(w.id)
                      }
                      onClick={() => match(w)}
                    >
                      {w.turkish}
                      {matched.includes(w.id) && <Check size={16} />}
                    </button>
                  ))}
                </div>
              </div>
              {wrongPair.length > 0 && (
                <p className="error" role="status">
                  Bu çift eşleşmedi. Kelimeyi yeniden seçip dene.
                </p>
              )}
              {matched.length === batch.length && (
                <button className="primary wide" onClick={nextBatch}>
                  {count >= session.limit
                    ? "Sonuçları gör"
                    : "Sonraki kelimeler"}
                  <ArrowRight size={18} />
                </button>
              )}
            </div>
          )}
          {feedback && (
            <div
              className={`feedback ${feedback.rating === "known" ? "success" : "failure"}`}
              role="status"
            >
              <div>
                <strong>
                  {feedback.rating === "known"
                    ? "Doğru, hatırladın."
                    : "Bir sonraki tekrarda hatırlarsın."}
                </strong>
                {initial.mode === "gap" && <p>Doğru cevap: <strong lang="en">{[feedback.word.phrase?.gap.answer, ...(feedback.word.phrase?.gap.alternatives ?? [])].join(" / ")}</strong></p>}
                <p>
                  {primaryText(feedback.word)}
                  {feedback.word.alternatives.length
                    ? ` / ${feedback.word.alternatives.join(" / ")}`
                    : ""}{" "}
                  — {feedback.word.turkish}
                </p>
                <WordReading word={feedback.word} />
                {initial.mode === "write" && <PronunciationButton text={primaryText(feedback.word)} />}
                <ExampleSentence word={feedback.word} />
                <PhraseNotes word={feedback.word} />
              </div>
              <button
                className="primary"
                onClick={() => applyNext(sessionRef.current)}
              >
                Devam <ArrowRight size={17} />
              </button>
            </div>
          )}
          {error && (
            <div className="save-error" role="alert">
              <p>{error}</p>
              <button
                className="secondary"
                disabled={busy}
                onClick={() =>
                  pending && void answer(pending.word, pending.rating)
                }
              >
                <RotateCcw size={17} /> Yeniden dene
              </button>
            </div>
          )}
          {busy && (
            <p className="small muted centered" role="status">
              Kaydediliyor…
            </p>
          )}
        </>
      )}
      {confirmExit && (
        <Modal title="Oturumdan ayrıl?" onClose={() => setConfirmExit(false)}>
          <p className="muted">
            Şimdiye kadar verdiğin {count} cevap kaydedildi. Kalan sorular
            kapanacak.
          </p>
          <button className="primary wide" onClick={onExit}>
            Çalışmaya dön
            <ArrowLeft size={17} />
          </button>
          <button
            className="secondary wide"
            onClick={() => setConfirmExit(false)}
          >
            Oturuma devam et
          </button>
        </Modal>
      )}
    </main>
  );
}
