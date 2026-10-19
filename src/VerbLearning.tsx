import { useEffect, useState } from "react";
import { ArrowRight, RotateCcw } from "lucide-react";
import { StudySession } from "./App";
import { createSession, dueWords, labels, type RecordWord, type Session } from "./engine";
import { loadVerbs, saveVerbProgress } from "./verb-db";

export function VerbLearning({ onSessionChange }: { onSessionChange: (active: boolean) => void }) {
  const [words, setWords] = useState<RecordWord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [kind, setKind] = useState<"all" | "regular" | "irregular">("all");
  const [mode, setMode] = useState<"write" | "cards">("write");
  const [poolKind, setPoolKind] = useState<"new" | "due" | "free">("new");
  const [size, setSize] = useState<number | "all">(10);
  const [session, setSession] = useState<Session | null>(null);
  const [now, setNow] = useState(Date.now());
  const [showCollection, setShowCollection] = useState(false);

  async function load() {
    setLoading(true); setError(false);
    try { setWords(await loadVerbs()); }
    catch { setError(true); }
    finally { setLoading(false); }
  }
  useEffect(() => {
    void load();
    const timer = window.setInterval(() => setNow(Date.now()), 30000);
    return () => clearInterval(timer);
  }, []);

  const filtered = words.filter(word => kind === "all" || word.verb!.kind === kind);
  const pool = poolKind === "due" ? dueWords(filtered, now) : poolKind === "new" ? filtered.filter(word => !word.progress) : filtered;
  if (loading || error) return <main className="loading">
    {loading ? <p>Fiiller hazırlanıyor…</p> : <><h2>Fiil kayıtlarına ulaşılamadı</h2><p>Tarayıcının yerel depolama iznini kontrol et.</p><button className="secondary" onClick={() => void load()}><RotateCcw size={17} /> Yeniden dene</button></>}
  </main>;
  if (session) return <StudySession initial={session} allWords={filtered} saveReview={saveVerbProgress}
    onUpdate={word => setWords(all => all.map(w => w.id === word.id ? word : w))}
    onExit={() => { setSession(null); setNow(Date.now()); onSessionChange(false); }} />;

  return <main className="main phrase-main">
    <section className="phrase-study" aria-labelledby="verb-title">
      <div className="simple-mode-intro">
        <p className="eyebrow">İNGİLİZCE · PAST SIMPLE</p>
        <h1 id="verb-title">Fiillerin ikinci hâli</h1>
        <p className="muted">Günlük hayatta sık kullanılan 100 fiille geçmiş zamana çalış. Yalın hâli gör, ikinci hâlini hatırla: go → went.</p>
      </div>
      <div className="phrase-progress" aria-label="Fiil ilerlemesi">
        <span><strong>{words.filter(w => w.progress?.status === "known").length} / {words.length}</strong> bilinen fiil</span>
        <span><strong>{dueWords(words, now).length}</strong> tekrar bekleyen</span>
      </div>
      <div className="segment phrase-modes" aria-label="Fiil çalışma şekli">
        <button className={mode === "write" ? "selected" : ""} aria-pressed={mode === "write"} onClick={() => setMode("write")}>İkinci hâlini yaz</button>
        <button className={mode === "cards" ? "selected" : ""} aria-pressed={mode === "cards"} onClick={() => setMode("cards")}>Ezber kartları</button>
      </div>
      <div className="study-options phrase-filters">
        <label>Fiil türü<select aria-label="Fiil türü" value={kind} onChange={e => setKind(e.target.value as typeof kind)}><option value="all">Tüm fiiller</option><option value="irregular">Düzensiz fiiller</option><option value="regular">Düzenli fiiller</option></select></label>
        <label>Çalışılacak fiiller<select aria-label="Çalışılacak fiiller" value={poolKind} onChange={e => setPoolKind(e.target.value as typeof poolKind)}><option value="new">Yeni fiiller</option><option value="due">Günlük tekrar</option><option value="free">Serbest pratik</option></select></label>
        <label>Oturum<select aria-label="Fiil oturum uzunluğu" value={size} onChange={e => setSize(e.target.value === "all" ? "all" : Number(e.target.value))}><option value={10}>10 soru</option><option value={20}>20 soru</option><option value="all">Tümü</option></select></label>
      </div>
      <button className="primary wide" disabled={!pool.length} onClick={() => { setSession(createSession(mode, poolKind, pool, size)); onSessionChange(true); }}>Fiillere başla <ArrowRight size={18} /></button>
      <p className="study-count muted" role="status">{pool.length ? `${pool.length} fiil hazır` : poolKind === "due" ? "Bu türde tekrar zamanı gelen fiil yok." : poolKind === "new" ? "Bu türde yeni fiil yok. Serbest pratikle devam edebilirsin." : "Bu türe uygun fiil yok."}</p>
      <details className="phrase-details"><summary>Geçmiş zaman için kısa rehber</summary>
        <p>Düzenli fiiller genellikle -ed alır: work → worked. Sonu -e olanlara -d eklenir: live → lived. Ünsüz + y, -ied olur: study → studied. Bazı fiillerde son ünsüz çiftlenir: stop → stopped.</p>
        <p>Düzensiz fiillerin ikinci hâli ayrıca öğrenilir: go → went, eat → ate. Bazıları değişmez: put → put.</p>
        <p>İkinci hâl olumlu geçmiş zaman cümlelerinde kullanılır: I went home. Soruda ve olumsuzda did/didn't ile yalın hâl kullanılır: Did you go? I didn't go. Be fiili ayrıdır: I was / they were; Was she home? She wasn't home.</p>
        <p>Bu çalışma fiilin ikinci hâlini sorar; üçüncü hâlini değil: go → went (gone değil). Be için was veya were, learn için learned veya learnt, travel için travelled veya traveled kabul edilir.</p>
      </details>
      <details className="phrase-details" onToggle={e => setShowCollection(e.currentTarget.open)}><summary>Fiil koleksiyonu ({filtered.length})</summary>
        {showCollection && <ul className="phrase-list">{filtered.map(word => <li key={word.id}><details>
          <summary><span lang="en">{word.verb!.base} → {[word.english, ...word.alternatives].join(" / ")}</span><span className="small muted">{labels[word.progress?.status ?? "new"]}</span></summary>
          <p>{word.turkish} · {word.verb!.kind === "regular" ? "Düzenli" : "Düzensiz"}</p><p lang="en">{word.example}</p>{word.verb!.note && <p className="small muted">{word.verb!.note}</p>}
        </details></li>)}</ul>}
      </details>
      <p className="small muted">Liste günlük kullanıma yönelik bir seçkidir; ölçülmüş sıklık sıralaması değildir. Örnek cümleler bu uygulama için yazılmıştır. <a href="https://learnenglish.britishcouncil.org/free-resources/grammar/english-grammar-reference/past-simple" target="_blank" rel="noreferrer">British Council: Past simple</a></p>
      <p className="small muted">Fiil ilerlemesi bu tarayıcıda ayrı saklanır. Ayarlar'daki kelime yedekleri fiil ilerlemesini kapsamaz.</p>
    </section>
  </main>;
}
