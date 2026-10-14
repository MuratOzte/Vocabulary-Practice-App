import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./style.css";
import { LanguageProvider, languageAtPath } from "./language";
const language = languageAtPath(window.location.pathname);
document.title = language === "ja" ? "kelime — Japonca çalış" : "kelime — İngilizce çalış";
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <LanguageProvider language={language}><App /></LanguageProvider>
  </React.StrictMode>,
);
