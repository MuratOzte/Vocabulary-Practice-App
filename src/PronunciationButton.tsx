import { useEffect, useRef, useState } from "react";
import { Square, Volume2 } from "lucide-react";

export function PronunciationButton({ text }: { text: string }) {
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
  }, [text, supported]);

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
      const voice = voices.find(v => /^en[-_]US$/i.test(v.lang)) ??
        voices.find(v => /^en([-_]|$)/i.test(v.lang));
      utterance.lang = voice?.lang ?? "en-US";
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
          setError("Ses oynatılamadı. Yeniden dene veya cihazındaki İngilizce sesleri kontrol et.");
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
        aria-label={`${text}: ${speaking ? "seslendirmeyi durdur" : "İngilizce telaffuzu dinle"}`}
        title={supported ? "İngilizce telaffuzu dinle" : "Bu tarayıcı sesli telaffuzu desteklemiyor"}
        onClick={play}
      >
        {speaking ? <Square size={16} /> : <Volume2 size={18} />}
      </button>
      {error && <span className="pronunciation-error" role="alert">{error}</span>}
    </span>
  );
}
