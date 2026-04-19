"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { Mic, MicOff, ArrowLeft, Save, StopCircle } from "lucide-react";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";

export default function VoicePage() {
  const t = useTranslations("voice");
  const locale = useLocale();
  const [active, setActive] = useState(false);
  const [holding, setHolding] = useState(false);
  const [transcript, setTranscript] = useState<string[]>([]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 min-w-0 flex flex-col">
          <div className="p-6 border-b border-[var(--border)] bg-white">
            <div className="flex items-center gap-3">
              <Link href={`/${locale}/ai-assistant`} className="p-2 rounded-xl hover:bg-[var(--bg-subtle)] transition-colors">
                <ArrowLeft className="w-5 h-5 text-[var(--text-secondary)]" />
              </Link>
              <div>
                <h1 className="font-bold text-[var(--text-primary)]" style={{ fontFamily: "var(--font-jakarta)" }}>
                  {t("title")}
                </h1>
                <p className="text-xs text-[var(--text-muted)]">Powered by lawify.uz</p>
              </div>
            </div>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center p-8">
            <div className={`w-32 h-32 rounded-full flex items-center justify-center mb-8 transition-all duration-300 ${
              active
                ? holding
                  ? "bg-red-100 scale-110 shadow-xl shadow-red-200"
                  : "bg-[var(--primary-light)] scale-105 shadow-lg shadow-[var(--primary)]/20"
                : "bg-[var(--bg-muted)]"
            }`}>
              {active ? (
                holding
                  ? <MicOff className="w-14 h-14 text-red-500" />
                  : <Mic className="w-14 h-14 text-[var(--primary)] animate-pulse" />
              ) : (
                <Mic className="w-14 h-14 text-[var(--text-muted)]" />
              )}
            </div>

            <p className="text-lg font-semibold text-[var(--text-primary)] mb-2" style={{ fontFamily: "var(--font-jakarta)" }}>
              {active
                ? holding
                  ? t("release")
                  : t("listening")
                : t("holdToSpeak")}
            </p>
            <p className="text-sm text-[var(--text-muted)] mb-8">
              {active ? t("responding") : "Press and hold the button below to speak"}
            </p>

            {!active ? (
              <button
                onClick={() => setActive(true)}
                className="btn-primary px-8 py-3 flex items-center gap-2"
              >
                <Mic className="w-4 h-4" />
                Start Voice Session
              </button>
            ) : (
              <div className="flex gap-4">
                <button
                  onMouseDown={() => setHolding(true)}
                  onMouseUp={() => setHolding(false)}
                  onTouchStart={() => setHolding(true)}
                  onTouchEnd={() => setHolding(false)}
                  className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${
                    holding
                      ? "bg-red-500 text-white scale-95"
                      : "bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)]"
                  }`}
                >
                  <Mic className="w-6 h-6" />
                </button>
                <button
                  onClick={() => { setActive(false); setHolding(false); }}
                  className="w-16 h-16 rounded-full bg-[var(--bg-subtle)] border border-[var(--border)] flex items-center justify-center hover:bg-red-50 hover:border-red-200 transition-all"
                >
                  <StopCircle className="w-6 h-6 text-[var(--text-secondary)]" />
                </button>
              </div>
            )}

            {transcript.length > 0 && (
              <div className="mt-8 w-full max-w-lg">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-sm text-[var(--text-secondary)]">Transcript</h3>
                  <button className="flex items-center gap-1 text-xs text-[var(--primary)] hover:underline">
                    <Save className="w-3 h-3" />
                    {t("saveTranscript")}
                  </button>
                </div>
                <div className="bg-[var(--bg-subtle)] rounded-xl p-4 space-y-2 max-h-48 overflow-y-auto">
                  {transcript.map((line, i) => (
                    <p key={i} className="text-sm text-[var(--text-secondary)]">{line}</p>
                  ))}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
