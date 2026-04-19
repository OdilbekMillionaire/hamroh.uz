"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { Copy, Mic, MicOff, Loader2, Upload } from "lucide-react";

const LANG_PAIRS = [
  { from: "uz", to: "ru", label: "O'zbek → Русский" },
  { from: "ru", to: "uz", label: "Русский → O'zbek" },
  { from: "uz", to: "en", label: "O'zbek → English" },
  { from: "en", to: "uz", label: "English → O'zbek" },
  { from: "ru", to: "en", label: "Русский → English" },
  { from: "en", to: "ru", label: "English → Русский" },
  { from: "uz", to: "uz-cyrl", label: "O'zbek → Ўзбек" },
];

export default function TranslatorTabs() {
  const t = useTranslations("translator");
  const [activeTab, setActiveTab] = useState<"text" | "doc" | "live">("text");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [langPair, setLangPair] = useState(LANG_PAIRS[0]);
  const [loading, setLoading] = useState(false);
  const [liveActive, setLiveActive] = useState(false);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const translate = useCallback(async (text: string) => {
    if (!text.trim()) { setOutput(""); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, from: langPair.from, to: langPair.to }),
      });
      if (res.ok) {
        const data = await res.json();
        setOutput(data.translation || "");
      }
    } catch {
      setOutput("Translation error. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [langPair]);

  function handleInputChange(v: string) {
    setInput(v);
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      void translate(v);
    }, 500);
  }

  useEffect(() => {
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, []);

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-6" style={{ fontFamily: "var(--font-jakarta)" }}>
        {t("title")}
      </h1>

      <div className="flex gap-2 mb-6 bg-[var(--bg-subtle)] p-1 rounded-xl w-fit">
        {(["text", "doc", "live"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab ? "bg-white shadow-sm text-[var(--primary)]" : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
            }`}
          >
            {t(`${tab}Tab`)}
          </button>
        ))}
      </div>

      {activeTab === "text" && (
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <select
              value={`${langPair.from}-${langPair.to}`}
              onChange={(e) => {
                const pair = LANG_PAIRS.find((p) => `${p.from}-${p.to}` === e.target.value);
                if (pair) { setLangPair(pair); setOutput(""); }
              }}
              className="px-3 py-2 border border-[var(--border)] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            >
              {LANG_PAIRS.map((p) => (
                <option key={`${p.from}-${p.to}`} value={`${p.from}-${p.to}`}>{p.label}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <textarea
                value={input}
                onChange={(e) => handleInputChange(e.target.value)}
                placeholder={t("inputPlaceholder")}
                rows={8}
                className="w-full px-4 py-3 border border-[var(--border)] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] resize-none"
              />
            </div>
            <div className="relative">
              {loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-[var(--bg-subtle)] rounded-xl">
                  <Loader2 className="w-5 h-5 animate-spin text-[var(--primary)]" />
                </div>
              )}
              <textarea
                value={output}
                readOnly
                placeholder={t("outputPlaceholder")}
                rows={8}
                className="w-full px-4 py-3 border border-[var(--border)] rounded-xl text-sm bg-[var(--bg-subtle)] resize-none text-[var(--text-primary)]"
              />
              {output && (
                <div className="absolute bottom-3 right-3 flex gap-2">
                  <button
                    onClick={() => navigator.clipboard.writeText(output)}
                    className="p-1.5 bg-white rounded-lg border border-[var(--border)] hover:bg-[var(--primary-light)] transition-colors"
                    title={t("copyBtn")}
                  >
                    <Copy className="w-3 h-3 text-[var(--text-secondary)]" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === "doc" && (
        <div className="card">
          <h2 className="font-semibold text-[var(--text-primary)] mb-4">Document Translator</h2>
          <div className="border-2 border-dashed border-[var(--border)] rounded-xl p-10 text-center hover:border-[var(--primary)] transition-colors cursor-pointer">
            <Upload className="w-8 h-8 mx-auto mb-3 text-[var(--text-muted)]" />
            <p className="text-sm font-medium text-[var(--text-secondary)]">Upload document to translate</p>
            <p className="text-xs text-[var(--text-muted)] mt-1">PDF or image files, max 10MB</p>
            <button className="mt-4 btn-primary text-sm px-5 py-2">{t("downloadBtn")}</button>
          </div>
        </div>
      )}

      {activeTab === "live" && (
        <div className="card text-center py-12">
          <div className={`w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center transition-all ${
            liveActive ? "bg-red-50 animate-pulse" : "bg-[var(--primary-light)]"
          }`}>
            {liveActive ? (
              <MicOff className="w-8 h-8 text-red-500" />
            ) : (
              <Mic className="w-8 h-8 text-[var(--primary)]" />
            )}
          </div>
          <h2 className="text-xl font-bold text-[var(--text-primary)] mb-2" style={{ fontFamily: "var(--font-jakarta)" }}>
            Live Translator
          </h2>
          <p className="text-sm text-[var(--text-secondary)] mb-6">Real-time spoken translation powered by Gemini Live</p>
          <button
            onClick={() => setLiveActive(!liveActive)}
            className={`px-8 py-3 rounded-xl font-semibold text-sm transition-all ${
              liveActive
                ? "bg-red-500 text-white hover:bg-red-600"
                : "bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)]"
            }`}
          >
            {liveActive ? t("liveStop") : t("liveStart")}
          </button>
          {liveActive && (
            <div className="mt-6 p-4 bg-[var(--bg-subtle)] rounded-xl text-left">
              <p className="text-xs text-[var(--text-muted)] mb-2">Live transcript...</p>
              <div className="h-16 flex items-center justify-center">
                <div className="flex gap-1">
                  {[0, 0.1, 0.2, 0.3, 0.4].map((d, i) => (
                    <div
                      key={i}
                      className="w-1 bg-[var(--primary)] rounded-full animate-bounce"
                      style={{ height: `${16 + (i % 3) * 8}px`, animationDelay: `${d}s` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
