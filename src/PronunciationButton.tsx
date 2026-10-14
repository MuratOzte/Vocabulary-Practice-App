import { useEffect, useRef, useState } from "react";
import { Square, Volume2 } from "lucide-react";
import { useLanguage, type Language } from "./language";

export function PronunciationButton({ text, language: override }: { text: string; language?: Language }) {
  const contextLanguage = useLanguage();
  const language = override ?? contextLanguage;
  const languageName = language === "ja" ? "Japonca" : "İngilizce";
  const supported = typeof window !== "undefined" &&
    "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;
  const active = useRef<SpeechSynthesisUtterance | null>(null);
  const [speaking, setSpeaking] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setSpeaking(false);
    setError("");
    if (supported) window.speechSynthesis.getVoices();
    return () => {
      if (active.current) {
        active.current = null;
        window.speechSynthesis.cancel();
      }
    };
  }, [text, supported, language]);

  function play() {
    if (!supported) return;
    const synth = window.speechSynthesis;
    if (active.current) {
      active.current = null;
      synth.cancel();
      setSpeaking(false);
      return;
    }
    setError("");
    try {
      synth.cancel();
      const utterance = new SpeechSynthesisUtterance(text.trim());
      const voices = synth.getVoices();
      const preferred = language === "ja" ? "ja-JP" : "en-US";
      const voice = voices.find(v => v.lang.replace("_", "-").toLowerCase() === preferred.toLowerCase()) ??
        voices.find(v => new RegExp(`^${language}([-_]|$)`, "i").test(v.lang));
      utterance.lang = voice?.lang ?? preferred;
      if (voice) utterance.voice = voice;
      utterance.rate = 0.85;
      const finish = () => {
        if (active.current !== utterance) return;
        active.current = null;
        setSpeaking(false);
      };
      utterance.onend = finish;
      utterance.onerror = event => {
        if (active.current !== utterance) return;
        finish();
        if (event.error !== "canceled" && event.error !== "interrupted") {
          setError(`Ses oynatılamadı. Yeniden dene veya cihazındaki ${languageName} sesleri kontrol et.`);
        }
      };
      active.current = utterance;
      setSpeaking(true);
      synth.speak(utterance);
    } catch {
      active.current = null;
      setSpeaking(false);
      setError("Ses oynatılamadı. Yeniden dene.");
    }
  }

  return (
    <span className="pronunciation-control">
      <button
        type="button"
        className="pronunciation-button"
        disabled={!supported || !text.trim()}
        aria-label={`${text}: ${speaking ? "seslendirmeyi durdur" : `${languageName} telaffuzu dinle`}`}
        title={supported ? `${languageName} telaffuzu dinle` : "Bu tarayıcı sesli telaffuzu desteklemiyor"}
        onClick={play}
      >
        {speaking ? <Square size={16} /> : <Volume2 size={18} />}
      </button>
      {error && <span className="pronunciation-error" role="alert">{error}</span>}
    </span>
  );
}
