import { useEffect, useState } from "react";
import { ArrowRight, RotateCcw } from "lucide-react";
import { StudySession } from "./App";
import { createSession, dueWords, labels, type PhraseCategory, type RecordWord, type Session, type Status } from "./engine";
import { loadPhrases, savePhraseProgress } from "./phrase-db";
import { categoryNames, phraseSummary } from "./phrases";

export function PhraseLearning({ onSessionChange }: { onSessionChange: (active: boolean) => void }) {
  const [words, setWords] = useState<RecordWord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [level, setLevel] = useState("all");
  const [category, setCategory] = useState<PhraseCategory | "all">("all");
  const [status, setStatus] = useState<Status | "all">("all");
  const [mode, setMode] = useState<"cards" | "gap">("cards");
  const [kind, setKind] = useState<"new" | "due" | "free">("new");
  const [size, setSize] = useState(10);
  const [session, setSession] = useState<Session | null>(null);
  const [showCollection, setShowCollection] = useState(false);
  const [now, setNow] = useState(Date.now());
  async function load() {
    setLoading(true); setError(false);
    try { setWords(await loadPhrases()); }
    catch { setError(true); }
    finally { setLoading(false); }
  }
  useEffect(() => {
    void load();
    const timer = window.setInterval(() => setNow(Date.now()), 30000);
    return () => clearInterval(timer);
  }, []);
  const filtered = words.filter(w => (level === "all" || w.phrase!.level === level)
    && (category === "all" || w.phrase!.category === category)
    && (status === "all" || (w.progress?.status ?? "new") === status));
  const pool = kind === "due" ? dueWords(filtered, now) : kind === "new" ? filtered.filter(w => !w.progress) : filtered;
  const summary = phraseSummary(words, now);
  const breakdowns = [{ title: "Edatlar ve eksik kelimeler", rows: summary.targets }, { title: "Kategoriler", rows: summary.categories }];
  if (loading || error) return <main className="loading">
    {loading ? <p>Kalıplar hazırlanıyor…</p> : <><h2>Kalıp kayıtlarına ulaşılamadı</h2><p>Tarayıcının yerel depolama iznini kontrol et.</p><button className="secondary" onClick={() => void load()}><RotateCcw size={17} /> Yeniden dene</button></>}
  </main>;
  if (session) return <StudySession initial={session} allWords={filtered} saveReview={savePhraseProgress}
    onUpdate={word => setWords(all => all.map(w => w.id === word.id ? word : w))}
    onExit={() => { setSession(null); setNow(Date.now()); onSessionChange(false); }} />;
  return <main className="main phrase-main">
    <section className="phrase-study" aria-labelledby="phrase-title">
      <div className="simple-mode-intro">
        <p className="eyebrow">İNGİLİZCE · EDATLAR VE KALIPLAR</p>
        <h1 id="phrase-title">Kalıplar</h1>
        <p className="muted">Kelimeleri birlikte hatırla. Edatları ve a, an, the kullanımını cümle içinde çalış.</p>
      </div>
      <div className="phrase-progress" aria-label="Kalıp ilerlemesi">
        <span><strong>{summary.learned} / {words.length}</strong> öğrenilen kalıp</span>
        <span><strong>{summary.today}</strong> bugün verilen cevap</span>
        <span><strong>{dueWords(words, now).length}</strong> tekrar bekleyen</span>
      </div>
      <div className="phrase-filters study-options">
        <label>Seviye<select value={level} onChange={e => setLevel(e.target.value)} aria-label="Kalıp seviyesi"><option value="all">Tüm seviyeler</option>{["A1", "A2", "B1", "B2"].map(l => <option key={l}>{l}</option>)}</select></label>
        <label>Kategori<select value={category} onChange={e => setCategory(e.target.value as typeof category)} aria-label="Kalıp kategorisi"><option value="all">Tüm kategoriler</option>{Object.entries(categoryNames).map(([id, label]) => <option key={id} value={id}>{label}</option>)}</select></label>
        <label>Öğrenilme durumu<select value={status} onChange={e => setStatus(e.target.value as typeof status)} aria-label="Kalıp durumu"><option value="all">Tüm durumlar</option>{Object.entries(labels).map(([id, label]) => <option key={id} value={id}>{label}</option>)}</select></label>
      </div>
      <div className="segment phrase-modes" aria-label="Kalıp çalışma şekli">
        <button className={mode === "cards" ? "selected" : ""} aria-pressed={mode === "cards"} onClick={() => setMode("cards")}>Kalıp kartları</button>
        <button className={mode === "gap" ? "selected" : ""} aria-pressed={mode === "gap"} onClick={() => setMode("gap")}>Boşluk doldur</button>
      </div>
      <div className="study-options">
        <label>Çalışılacak kalıplar<select aria-label="Çalışılacak kalıplar" value={kind} onChange={e => setKind(e.target.value as typeof kind)}><option value="new">Yeni kalıplar</option><option value="due">Günlük tekrar</option><option value="free">Serbest pratik</option></select></label>
        <label>Oturum<select aria-label="Kalıp oturum uzunluğu" value={size} onChange={e => setSize(Number(e.target.value))}><option value={10}>10 soru</option><option value={20}>20 soru</option></select></label>
      </div>
      <button className="primary wide" disabled={!pool.length} onClick={() => { setSession(createSession(mode, kind, pool, size)); onSessionChange(true); }}>Kalıplara başla <ArrowRight size={18} /></button>
      <p className="study-count muted" role="status">{pool.length ? `${pool.length} kalıp hazır` : kind === "due" ? "Bu filtrelerde tekrar zamanı gelen kalıp yok." : kind === "new" ? "Bu filtrelerde yeni kalıp yok. Serbest pratiği seçebilir veya filtreleri değiştirebilirsin." : "Bu filtrelere uygun kalıp yok."}</p>
      <details className="phrase-details"><summary>Zorlandığım yapılar</summary>
        <p className="muted small">Yanlış cevaplar ve “Bilmiyorum” seçimleri sayılır. Edat / kelime sayıları yalnızca boşluk doldurma cevaplarından gelir.</p>
        {!summary.categories.length && !summary.targets.length && <p className="muted">Henüz hata kaydı yok.</p>}
        {breakdowns.map(({ title, rows }) => <div key={title}><h2>{title}</h2><ul className="phrase-error-list">{rows.map(row => <li key={row.name}><span>{row.name}</span><span>{row.mistakes} / {row.attempts} hata (%{Math.round(row.mistakes / row.attempts * 100)})</span></li>)}</ul></div>)}
      </details>
      <details className="phrase-details" onToggle={e => setShowCollection(e.currentTarget.open)}><summary>Kalıp koleksiyonu ({filtered.length})</summary>
        {showCollection && <ul className="phrase-list">{filtered.map(w => <li key={w.id}><details><summary><span lang="en">{w.english}</span><span className="small muted">{w.phrase!.level} · {labels[w.progress?.status ?? "new"]}</span></summary><p>{w.turkish}</p><p lang="en">{w.example}</p><p className="muted">{w.phrase!.translation}</p><p>{w.phrase!.explanation}</p>{w.phrase!.commonMistake && <p className="small">Yaygın hata: <span lang="en">{w.phrase!.commonMistake}</span></p>}</details></li>)}</ul>}
      </details>
      <details className="phrase-details"><summary>Seviye ve öncelik hakkında</summary><p className="small muted">Seviyeler A1–B2 öğretim tahminleridir. Öncelik 1–4, temel günlük kullanımdan daha ileri yapılara uzanan bir öğrenme sırasıdır; ölçülmüş sıklık veya resmî CEFR sınıflandırması değildir. Örnekler bu uygulama için yazılmıştır.</p><p className="small"><a href="https://learnenglish.britishcouncil.org/free-resources/grammar/a1-a2/adjectives-prepositions" target="_blank" rel="noreferrer">British Council: sıfatlar ve edatlar</a> · <a href="https://learnenglish.britishcouncil.org/free-resources/grammar/b1-b2/verbs-prepositions" target="_blank" rel="noreferrer">fiiller ve edatlar</a></p><p className="small muted">Kalıp ilerlemesi bu tarayıcıda ayrı saklanır. Kelimeler bölümündeki yedekler yalnızca kelime koleksiyonunu kapsar.</p></details>
    </section>
  </main>;
}
