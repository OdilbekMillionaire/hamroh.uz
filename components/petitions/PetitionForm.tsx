"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Loader2, Sparkles, AlertTriangle, CheckCircle, Upload, Send } from "lucide-react";
import { useRouter } from "next/navigation";

const CATEGORIES = ["migration", "labor", "emergency", "document", "other"] as const;

interface AIScanResult {
  risks: string[];
  recommendations: string[];
  urgency: "high" | "medium" | "low";
}

export default function PetitionForm() {
  const t = useTranslations("petitions");
  const locale = useLocale();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<string>("");
  const [scanResult, setScanResult] = useState<AIScanResult | null>(null);
  const [scanning, setScanning] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [categorySuggestion, setCategorySuggestion] = useState<string>("");

  async function autoDetectCategory(text: string) {
    if (text.length < 50) return;
    try {
      const res = await fetch("/api/categorize-petition", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.category) setCategorySuggestion(data.category);
      }
    } catch {}
  }

  async function runAIScan() {
    if (!description) return;
    setScanning(true);
    try {
      const res = await fetch("/api/scan-petition", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, category, locale }),
      });
      if (res.ok) {
        const data = await res.json();
        setScanResult(data);
      }
    } catch {
      setScanResult({
        risks: ["Could not complete AI scan. Please try again."],
        recommendations: [],
        urgency: "medium",
      });
    } finally {
      setScanning(false);
    }
  }

  async function generateDraft() {
    setGenerating(true);
    try {
      const res = await fetch("/api/generate-draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, category, locale }),
      });
      if (res.ok) {
        const reader = res.body?.getReader();
        if (!reader) return;
        const decoder = new TextDecoder();
        let draft = "";
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value);
          const lines = chunk.split("\n");
          for (const line of lines) {
            if (line.startsWith("data: ")) {
              try {
                const parsed = JSON.parse(line.slice(6));
                if (parsed.text) {
                  draft += parsed.text;
                  setDescription(draft);
                }
              } catch {}
            }
          }
        }
      }
    } catch {} finally {
      setGenerating(false);
    }
  }

  async function handleSubmit() {
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1500));
    setSubmitting(false);
    router.push(`/${locale}/petitions`);
  }

  const urgencyColors = {
    high: "text-[var(--status-danger)] bg-red-50",
    medium: "text-[var(--status-pending)] bg-orange-50",
    low: "text-[var(--accent)] bg-green-50",
  };

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[var(--text-primary)]" style={{ fontFamily: "var(--font-jakarta)" }}>
          {t("new")}
        </h1>
        <p className="text-[var(--text-secondary)] text-sm mt-1">AI will help categorize, scan, and draft your petition</p>
      </div>

      <div className="card space-y-5">
        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">{t("form.title")}</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Brief title describing your issue"
            className="w-full px-4 py-3 border border-[var(--border)] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">{t("form.category")}</label>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-all border ${
                  category === c
                    ? "border-[var(--primary)] bg-[var(--primary)] text-white"
                    : "border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--primary)] hover:text-[var(--primary)]"
                }`}
              >
                {t(`categories.${c}`)}
              </button>
            ))}
          </div>
          {categorySuggestion && category !== categorySuggestion && (
            <p className="text-xs text-[var(--primary)] mt-2 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              AI suggests: <button onClick={() => setCategory(categorySuggestion)} className="underline font-medium">{categorySuggestion}</button>
            </p>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-sm font-medium text-[var(--text-secondary)]">{t("form.description")}</label>
            <button
              onClick={generateDraft}
              disabled={!title || !category || generating}
              className="flex items-center gap-1 text-xs text-[var(--primary)] hover:underline disabled:opacity-50"
            >
              {generating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
              {generating ? t("draft.generating") : t("draft.generateBtn")}
            </button>
          </div>
          <textarea
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              if (e.target.value.length > 50) autoDetectCategory(e.target.value);
            }}
            placeholder="Describe your situation in detail..."
            rows={6}
            className="w-full px-4 py-3 border border-[var(--border)] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all resize-none"
          />
          {generating && (
            <p className="text-xs text-[var(--text-muted)] mt-1">{t("draft.disclaimer")}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">{t("form.attachFiles")}</label>
          <div className="border-2 border-dashed border-[var(--border)] rounded-xl p-6 text-center hover:border-[var(--primary)] transition-colors cursor-pointer">
            <Upload className="w-6 h-6 mx-auto mb-2 text-[var(--text-muted)]" />
            <p className="text-sm text-[var(--text-muted)]">Drop files here or click to upload</p>
            <p className="text-xs text-[var(--text-muted)] mt-1">PDF, JPG, PNG — max 10MB</p>
          </div>
        </div>

        {!scanResult && (
          <button
            onClick={runAIScan}
            disabled={!description || scanning}
            className="w-full flex items-center justify-center gap-2 py-3 border border-[var(--primary)] text-[var(--primary)] rounded-xl text-sm font-semibold hover:bg-[var(--primary-light)] transition-all disabled:opacity-50"
          >
            {scanning ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            {scanning ? t("aiScan.scanning") : t("aiScan.title")}
          </button>
        )}

        {scanResult && (
          <div className="bg-[var(--bg-subtle)] rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-[var(--text-primary)] text-sm">{t("aiScan.title")}</h3>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${urgencyColors[scanResult.urgency]}`}>
                {scanResult.urgency.toUpperCase()}
              </span>
            </div>
            {scanResult.risks.length > 0 && (
              <div>
                <p className="text-xs font-medium text-[var(--text-secondary)] mb-1">{t("aiScan.risks")}</p>
                <ul className="space-y-1">
                  {scanResult.risks.map((r, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-[var(--text-secondary)]">
                      <AlertTriangle className="w-3 h-3 text-[var(--status-pending)] mt-0.5 shrink-0" />
                      {r}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {scanResult.recommendations.length > 0 && (
              <div>
                <p className="text-xs font-medium text-[var(--text-secondary)] mb-1">{t("aiScan.recommendations")}</p>
                <ul className="space-y-1">
                  {scanResult.recommendations.map((r, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-[var(--text-secondary)]">
                      <CheckCircle className="w-3 h-3 text-[var(--accent)] mt-0.5 shrink-0" />
                      {r}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={!title || !description || !category || submitting}
          className="w-full flex items-center justify-center gap-2 btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          {t("form.category") ? "Submit Petition" : t("common.submit")}
        </button>
      </div>
    </div>
  );
}
