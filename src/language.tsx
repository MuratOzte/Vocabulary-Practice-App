import { createContext, useContext, type ReactNode } from "react";
import type { Word } from "./engine";

export type Language = "en" | "ja";
export type JapaneseSection = "hiragana" | "katakana" | "vocabulary";
export const sectionNames: Record<JapaneseSection, string> = {
  hiragana: "Hiragana", katakana: "Katakana", vocabulary: "Temel kelimeler ve ifadeler",
};
const LanguageContext = createContext<Language>("en");
export function LanguageProvider({ language, children }: { language: Language; children: ReactNode }) {
  return <LanguageContext.Provider value={language}>{children}</LanguageContext.Provider>;
}
export const useLanguage = () => useContext(LanguageContext);
export const languageAtPath = (path: string): Language => /^\/japonca\/?$/.test(path) ? "ja" : "en";
export const primaryText = (word: Word) => word.japanese ?? word.english;
export const isAlphabet = (word: Word) => word.section === "hiragana" || word.section === "katakana";
export function WordReading({ word, reveal = true }: { word: Word; reveal?: boolean }) {
  if (!word.japanese || !reveal) return null;
  return <span className="word-reading">
    {word.kana && word.kana !== word.japanese && <span lang="ja">{word.kana}</span>}
    <span lang="ja-Latn">{word.romaji}</span>
  </span>;
}

export function AlphabetGuide() {
  return <details className="alphabet-guide">
    <summary>Japonca yazım ve okunuş rehberi</summary>
    <p><strong>İki hece alfabesi:</strong> Hiragana Japonca sözcük ve eklerde, katakana çoğunlukla yabancı kökenli sözcüklerde kullanılır. Her bölümde 46 temel karakteri çalışabilirsin.</p>
    <p><strong>Ses işaretleri:</strong> Dakuten (゛) sesi değiştirir: か → が (ka → ga), し → じ (shi → ji). Handakuten (゜) h sesini p yapar: は → ぱ (ha → pa).</p>
    <p><strong>Birleşik heceler:</strong> Küçük ゃ・ゅ・ょ ile きゃ (kya), しゅ (shu), ちょ (cho) oluşur; katakanada キャ・シュ・チョ. きや (kiya) ile きゃ (kya) farklıdır.</p>
    <p><strong>Küçük っ / ッ:</strong> Sonraki ünsüzü uzatır: きって (kitte, pul). Büyük つ (tsu) ayrı bir hecedir.</p>
    <p><strong>Uzun ünlüler:</strong> おう / おお genellikle ō, うう ise ū yazılır: 学校・がっこう (gakkō), 空港・くうこう (kūkō). Katakanada çizgi kullanılır: コーヒー (kōhī). Uzun ünlü anlamı değiştirebilir.</p>
    <p><strong>Romaji:</strong> Hepburn okunuşu kullanılır (shi, chi, tsu, fu). Kelime cevaplarında kayıtlı ō/ou/oo ve ū/uu karşılıkları kabul edilir. は, へ, を parçacıkları örnek cümlelerde wa, e, o okunur; karakter olarak ha, he, o çalışılır.</p>
  </details>;
}
