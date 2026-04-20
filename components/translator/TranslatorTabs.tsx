"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useTranslations, useLocale } from "next-intl";
import {
  Copy, Volume2, X, ArrowLeftRight, Upload,
  Loader2, Check, Mic, MicOff, FileText, ChevronDown
} from "lucide-react";

const LANGUAGES = [
  { code: "uz", label: "O'zbek", flag: "🇺🇿" },
  { code: "uz-cyrl", label: "Ўзбек", flag: "🇺🇿" },
  { code: "ru", label: "Русский", flag: "🇷🇺" },
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "de", label: "Deutsch", flag: "🇩🇪" },
  { code: "ko", label: "한국어", flag: "🇰🇷" },
  { code: "tr", label: "Türkçe", flag: "🇹🇷" },
  { code: "ar", label: "العربية", flag: "🇸🇦" },
  { code: "zh", label: "中文", flag: "🇨🇳" },
  { code: "ja", label: "日本語", flag: "🇯🇵" },
  { code: "fr", label: "Français", flag: "🇫🇷" },
  { code: "es", label: "Español", flag: "🇪🇸" },
];

const MAX_CHARS = 5000;

const QUICK_PHRASES = [
  { uz: "Sizga yordam kerakmi?", ru: "Вам нужна помощь?", en: "Do you need help?" },
  { uz: "Men O'zbekistondan kelganman", ru: "Я из Узбекистана", en: "I am from Uzbekistan" },
  { uz: "Menga tarjimon kerak", ru: "Мне нужен переводчик", en: "I need an interpreter" },
  { uz: "Politsiyani chaqiring", ru: "Вызовите полицию", en: "Call the police" },
  { uz: "Menga shifokor kerak", ru: "Мне нужен врач", en: "I need a doctor" },
  { uz: "Elchixonani qo'ng'iroq qiling", ru: "Позвоните в посольство", en: "Call the embassy" },
];

type Tab = "text" | "doc" | "phrases";

export default function TranslatorTabs() {
  const t = useTranslations("translator");
  const locale = useLocale();

  const [activeTab, setActiveTab] = useState<Tab>("text");
  const [fromLang, setFromLang] = useState("uz");
  const [toLang, setToLang] = useState("ru");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [recording, setRecording] = useState(false);
  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showToPicker, setShowToPicker] = useState(false);
  const [docFile, setDocFile] = useState<File | null>(null);
  const [docResult, setDocResult] = useState("");
  const [docLoading, setDocLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fromLangObj = LANGUAGES.find((l) => l.code === fromLang)!;
  const toLangObj = LANGUAGES.find((l) => l.code === toLang)!;

  const translate = useCallback(async (text: string, from: string, to: string) => {
    if (!text.trim()) { setOutput(""); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, from, to }),
      });
      if (res.ok) {
        const data = await res.json() as { translation?: string };
        setOutput(data.translation ?? "");
      }
    } catch {
      setOutput("Translation error. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  function handleInput(v: string) {
    if (v.length > MAX_CHARS) return;
    setInput(v);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => void translate(v, fromLang, toLang), 500);
  }

  function swap() {
    const prevFrom = fromLang;
    const prevTo = toLang;
    const prevInput = input;
    const prevOutput = output;
    setFromLang(prevTo);
    setToLang(prevFrom);
    setInput(prevOutput);
    setOutput(prevInput);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (prevOutput) debounceRef.current = setTimeout(() => void translate(prevOutput, prevTo, prevFrom), 500);
  }

  function copyOutput() {
    void navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  function speak(text: string, lang: string) {
    if (typeof window === "undefined" || !window.speechSynthesis || !text) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = lang === "uz" || lang === "uz-cyrl" ? "uz" : lang === "ko" ? "ko-KR" : lang === "ru" ? "ru-RU" : lang === "de" ? "de-DE" : lang === "tr" ? "tr-TR" : "en-US";
    window.speechSynthesis.speak(utter);
  }

  function toggleRecording() {
    if (recording) {
      recognitionRef.current?.stop();
      setRecording(false);
      return;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) { alert("Voice input is not supported in this browser. Please use Chrome or Edge."); return; }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rec = new SR() as any;
    rec.lang = fromLang === "ru" ? "ru-RU" : fromLang === "ko" ? "ko-KR" : fromLang === "de" ? "de-DE" : fromLang === "tr" ? "tr-TR" : "en-US";
    rec.interimResults = true;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rec.onresult = (e: any) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const transcript = Array.from(e.results).map((r: any) => r[0].transcript).join("");
      handleInput(transcript);
    };
    rec.onend = () => setRecording(false);
    rec.start();
    recognitionRef.current = rec;
    setRecording(true);
  }

  async function handleDocUpload(file: File) {
    setDocFile(file);
    setDocResult("");
    setDocLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("locale", locale);
      const res = await fetch("/api/analyze-document", { method: "POST", body: formData });
      if (res.ok) {
        const data = await res.json() as { analysis?: string };
        setDocResult(data.analysis ?? "Could not analyze document.");
      }
    } catch {
      setDocResult("Error analyzing document. Please try again.");
    } finally {
      setDocLoading(false);
    }
  }

  useEffect(() => () => { if (debounceRef.current) clearTimeout(debounceRef.current); }, []);

  return (
    <div className="max-w-5xl">
      <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-6" style={{ fontFamily: "var(--font-jakarta)" }}>
        {t("title")}
      </h1>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-[var(--bg-subtle)] p-1 rounded-xl w-fit">
        {([
          { id: "text" as Tab, label: t("textTab") },
          { id: "doc" as Tab, label: t("docTab") },
          { id: "phrases" as Tab, label: "Quick Phrases" },
        ]).map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === tab.id ? "bg-white shadow-sm text-[#0E6E7E]" : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── TEXT TAB — Google Translate style ── */}
      {activeTab === "text" && (
        <div className="bg-white border border-[#D8E2E9] rounded-2xl shadow-sm overflow-visible">
          {/* Language selector bar */}
          <div className="flex items-center border-b border-[#D8E2E9] min-h-[56px] flex-wrap gap-y-2 px-2 py-2">
            {/* From language pills */}
            <div className="flex items-center gap-1 flex-1 flex-wrap">
              {["uz", "ru", "en"].map((code) => {
                const lang = LANGUAGES.find((l) => l.code === code)!;
                return (
                  <button
                    key={code}
                    onClick={() => { if (code === toLang) { swap(); } else { setFromLang(code); setOutput(""); if (input) void translate(input, code, toLang); }}}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${fromLang === code ? "text-[#0E6E7E] font-bold border-b-2 border-[#0E6E7E]" : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"}`}
                  >
                    {lang.label}
                  </button>
                );
              })}
              {/* More languages picker */}
              <div className="relative">
                <button
                  onClick={() => setShowFromPicker(!showFromPicker)}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${!["uz","ru","en"].includes(fromLang) ? "text-[#0E6E7E] font-bold" : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"}`}
                >
                  {!["uz","ru","en"].includes(fromLang) ? fromLangObj.label : "More"}
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
                {showFromPicker && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowFromPicker(false)} />
                    <div className="absolute top-10 left-0 z-50 bg-white border border-[#D8E2E9] rounded-2xl shadow-xl p-2 w-44 max-h-56 overflow-y-auto">
                      {LANGUAGES.filter((l) => l.code !== toLang).map((l) => (
                        <button key={l.code} onClick={() => { setFromLang(l.code); setShowFromPicker(false); setOutput(""); if (input) void translate(input, l.code, toLang); }} className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-colors ${l.code === fromLang ? "bg-[#E8F4F6] text-[#0E6E7E] font-semibold" : "hover:bg-[#F7F9FA]"}`}>
                          <span>{l.flag}</span>{l.label}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Swap */}
            <button onClick={swap} className="p-2.5 rounded-full hover:bg-[#E8F4F6] transition-colors mx-1" title="Swap">
              <ArrowLeftRight className="w-5 h-5 text-[#0E6E7E]" />
            </button>

            {/* To language pills */}
            <div className="flex items-center gap-1 flex-1 justify-end flex-wrap">
              <div className="relative">
                <button
                  onClick={() => setShowToPicker(!showToPicker)}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${!["uz","ru","en"].includes(toLang) ? "text-[#0E6E7E] font-bold" : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"}`}
                >
                  {!["uz","ru","en"].includes(toLang) ? toLangObj.label : "More"}
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
                {showToPicker && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowToPicker(false)} />
                    <div className="absolute top-10 right-0 z-50 bg-white border border-[#D8E2E9] rounded-2xl shadow-xl p-2 w-44 max-h-56 overflow-y-auto">
                      {LANGUAGES.filter((l) => l.code !== fromLang).map((l) => (
                        <button key={l.code} onClick={() => { setToLang(l.code); setShowToPicker(false); if (input) void translate(input, fromLang, l.code); }} className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-colors ${l.code === toLang ? "bg-[#E8F4F6] text-[#0E6E7E] font-semibold" : "hover:bg-[#F7F9FA]"}`}>
                          <span>{l.flag}</span>{l.label}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
              {["uz","ru","en"].map((code) => {
                const lang = LANGUAGES.find((l) => l.code === code)!;
                return (
                  <button
                    key={code}
                    onClick={() => { if (code === fromLang) { swap(); } else { setToLang(code); if (input) void translate(input, fromLang, code); }}}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${toLang === code ? "text-[#0E6E7E] font-bold border-b-2 border-[#0E6E7E]" : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"}`}
                  >
                    {lang.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Two panes */}
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[#D8E2E9]">
            {/* Input pane */}
            <div className="relative flex flex-col">
              <textarea
                value={input}
                onChange={(e) => handleInput(e.target.value)}
                placeholder={t("inputPlaceholder")}
                rows={8}
                className="w-full px-5 pt-5 pb-16 text-lg text-[#1A2733] resize-none focus:outline-none placeholder-[#C4D2DC] leading-relaxed"
              />
              <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <button onClick={toggleRecording} title={recording ? "Stop" : "Voice input"} className={`p-2 rounded-full transition-colors ${recording ? "bg-red-100 text-red-500 animate-pulse" : "hover:bg-[#F7F9FA] text-[#8FA5B5]"}`}>
                    {recording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </button>
                  {input && (
                    <button onClick={() => speak(input, fromLang)} title={t("speakBtn")} className="p-2 rounded-full hover:bg-[#F7F9FA] text-[#8FA5B5] transition-colors">
                      <Volume2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs ${input.length > MAX_CHARS * 0.9 ? "text-orange-500" : "text-[#8FA5B5]"}`}>{input.length.toLocaleString()} / {MAX_CHARS.toLocaleString()}</span>
                  {input && (
                    <button onClick={() => { setInput(""); setOutput(""); }} className="p-1.5 rounded-full hover:bg-[#F7F9FA] text-[#8FA5B5] transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Output pane */}
            <div className="relative flex flex-col bg-[#F7F9FA]">
              {loading ? (
                <div className="flex-1 flex items-center justify-center min-h-[200px]">
                  <div className="flex items-center gap-2 text-[var(--text-muted)] text-sm">
                    <Loader2 className="w-4 h-4 animate-spin text-[#0E6E7E]" /> Translating…
                  </div>
                </div>
              ) : (
                <div className="px-5 pt-5 pb-16 text-lg text-[#1A2733] min-h-[200px] leading-relaxed whitespace-pre-wrap select-text">
                  {output || <span className="text-[#C4D2DC] text-base">{t("outputPlaceholder")}</span>}
                </div>
              )}
              {output && (
                <div className="absolute bottom-3 left-4 flex items-center gap-1">
                  <button onClick={() => speak(output, toLang)} title={t("speakBtn")} className="p-2 rounded-full hover:bg-[#E8F4F6] text-[#8FA5B5] hover:text-[#0E6E7E] transition-colors">
                    <Volume2 className="w-4 h-4" />
                  </button>
                  <button onClick={copyOutput} title={t("copyBtn")} className="p-2 rounded-full hover:bg-[#E8F4F6] text-[#8FA5B5] hover:text-[#0E6E7E] transition-colors">
                    {copied ? <Check className="w-4 h-4 text-[#2ECC71]" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── DOC TAB ── */}
      {activeTab === "doc" && (
        <div className="space-y-4">
          <div className="card">
            <h2 className="font-bold text-[#1A2733] mb-1" style={{ fontFamily: "var(--font-jakarta)" }}>Document Analysis & Translation</h2>
            <p className="text-sm text-[var(--text-muted)] mb-4">Upload a PDF, image, or text file. Hamroh AI will extract, analyze, and summarize it.</p>
            <input ref={fileInputRef} type="file" accept="application/pdf,image/*,.txt" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) void handleDocUpload(f); }} />
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) void handleDocUpload(f); }}
              className="border-2 border-dashed border-[#D8E2E9] rounded-2xl p-10 text-center hover:border-[#0E6E7E] transition-colors cursor-pointer group"
            >
              {docFile ? (
                <div className="flex flex-col items-center gap-2">
                  <FileText className="w-10 h-10 text-[#0E6E7E]" />
                  <p className="text-sm font-semibold text-[#1A2733]">{docFile.name}</p>
                  <p className="text-xs text-[var(--text-muted)]">{(docFile.size / 1024).toFixed(0)} KB · Click to replace</p>
                </div>
              ) : (
                <>
                  <Upload className="w-10 h-10 mx-auto mb-3 text-[var(--text-muted)] group-hover:text-[#0E6E7E] transition-colors" />
                  <p className="text-sm font-semibold text-[var(--text-secondary)]">Click or drag a file here</p>
                  <p className="text-xs text-[var(--text-muted)] mt-1">PDF, JPG, PNG, or .txt — max 10 MB</p>
                </>
              )}
            </div>
          </div>
          {docLoading && (
            <div className="card flex items-center gap-3">
              <Loader2 className="w-5 h-5 animate-spin text-[#0E6E7E] shrink-0" />
              <p className="text-sm text-[var(--text-secondary)]">Analyzing document with Hamroh AI…</p>
            </div>
          )}
          {docResult && !docLoading && (
            <div className="card">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-[#1A2733]" style={{ fontFamily: "var(--font-jakarta)" }}>AI Analysis Result</h3>
                <button onClick={() => void navigator.clipboard.writeText(docResult)} className="text-xs text-[#0E6E7E] hover:underline font-medium">Copy all</button>
              </div>
              <div className="text-sm text-[var(--text-secondary)] leading-relaxed whitespace-pre-wrap">{docResult}</div>
            </div>
          )}
        </div>
      )}

      {/* ── QUICK PHRASES TAB ── */}
      {activeTab === "phrases" && (
        <div className="space-y-3">
          <p className="text-sm text-[var(--text-muted)] mb-2">Essential phrases for Uzbek citizens abroad. Tap a phrase to copy it.</p>
          {QUICK_PHRASES.map((phrase, i) => (
            <div key={i} className="card hover:border-[#0E6E7E] transition-colors">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {(["uz", "ru", "en"] as const).map((lang) => (
                  <button key={lang} onClick={() => void navigator.clipboard.writeText(phrase[lang])} className="text-left p-3 rounded-xl bg-[#F7F9FA] hover:bg-[#E8F4F6] transition-colors group" title="Tap to copy">
                    <span className="text-xs text-[var(--text-muted)] mb-1 block">{lang === "uz" ? "🇺🇿 O'zbek" : lang === "ru" ? "🇷🇺 Русский" : "🇬🇧 English"}</span>
                    <span className="text-sm font-medium text-[#1A2733] group-hover:text-[#0E6E7E] transition-colors">{phrase[lang]}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
