"use client";

import { useState, useRef, useCallback } from "react";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { Mic, MicOff, ArrowLeft, StopCircle, Loader2 } from "lucide-react";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";

interface Message {
  role: "user" | "assistant";
  content: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SR = any;

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    SpeechRecognition: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    webkitSpeechRecognition: any;
  }
}

export default function VoicePage() {
  const t = useTranslations("voice");
  const locale = useLocale();
  const [active, setActive] = useState(false);
  const [listening, setListening] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [error, setError] = useState("");
  const recognitionRef = useRef<SR>(null);
  const messagesRef = useRef<Message[]>([]);
  messagesRef.current = messages;

  const speak = useCallback((text: string, lang: string) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang === "ru" ? "ru-RU" : lang === "uz" || lang === "uz-cyrl" ? "uz-UZ" : "en-US";
    utterance.rate = 0.95;
    setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(utterance);
  }, []);

  const sendToGemini = useCallback(async (userText: string) => {
    setProcessing(true);
    const updated: Message[] = [...messagesRef.current, { role: "user", content: userText }];
    setMessages(updated);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updated, locale }),
      });

      if (!res.body) throw new Error("No response body");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let aiText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        for (const line of chunk.split("\n")) {
          if (line.startsWith("data: ") && line !== "data: [DONE]") {
            try {
              const parsed = JSON.parse(line.slice(6)) as { text?: string };
              if (parsed.text) aiText += parsed.text;
            } catch { /* skip malformed chunk */ }
          }
        }
      }

      if (aiText) {
        setMessages([...updated, { role: "assistant", content: aiText }]);
        speak(aiText, locale);
      }
    } catch {
      setError("Could not reach Hamroh AI. Please try again.");
    } finally {
      setProcessing(false);
    }
  }, [locale, speak]);

  function startListening() {
    const SR = (window.SpeechRecognition || window.webkitSpeechRecognition) as SR;
    if (!SR) {
      setError("Voice input is not supported in this browser. Try Chrome.");
      return;
    }
    setError("");
    window.speechSynthesis?.cancel();

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    const recognition: SR = new SR();
    recognition.lang = locale === "ru" ? "ru-RU" : locale === "uz" || locale === "uz-cyrl" ? "uz-UZ" : "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onresult = (event: any) => {
      const text = (event.results[0][0] as { transcript: string }).transcript;
      if (text.trim()) void sendToGemini(text.trim());
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onerror = (event: any) => {
      const err = (event as { error: string }).error;
      if (err !== "no-speech" && err !== "aborted") {
        setError("Microphone error: " + err);
      }
      setListening(false);
    };
    recognition.onend = () => setListening(false);

    recognitionRef.current = recognition;
    recognition.start();
    setListening(true);
  }

  function stopListening() {
    recognitionRef.current?.stop();
    setListening(false);
  }

  function stopSession() {
    recognitionRef.current?.abort();
    window.speechSynthesis?.cancel();
    setActive(false);
    setListening(false);
    setProcessing(false);
    setSpeaking(false);
  }

  const statusLabel = !active
    ? t("holdToSpeak")
    : processing
    ? "Thinking..."
    : speaking
    ? "Hamroh AI is speaking..."
    : listening
    ? t("listening")
    : t("holdToSpeak");

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
                <p className="text-xs text-[var(--text-muted)]">Powered by Gemini AI</p>
              </div>
            </div>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center p-8 gap-6">
            {error && (
              <div className="w-full max-w-md rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 text-center">
                {error}
              </div>
            )}

            {/* Mic orb */}
            <div className={`w-32 h-32 rounded-full flex items-center justify-center transition-all duration-300 ${
              !active
                ? "bg-[var(--bg-muted)]"
                : processing
                ? "bg-amber-100 scale-105 shadow-lg shadow-amber-200"
                : speaking
                ? "bg-green-100 scale-110 shadow-xl shadow-green-200"
                : listening
                ? "bg-red-100 scale-110 shadow-xl shadow-red-200"
                : "bg-[var(--primary-light)] scale-105 shadow-lg shadow-[var(--primary)]/20"
            }`}>
              {processing ? (
                <Loader2 className="w-14 h-14 text-amber-500 animate-spin" />
              ) : listening ? (
                <MicOff className="w-14 h-14 text-red-500 animate-pulse" />
              ) : (
                <Mic className={`w-14 h-14 ${active ? "text-[var(--primary)]" : "text-[var(--text-muted)]"} ${speaking ? "text-green-500" : ""}`} />
              )}
            </div>

            <div className="text-center">
              <p className="text-lg font-semibold text-[var(--text-primary)] mb-1" style={{ fontFamily: "var(--font-jakarta)" }}>
                {statusLabel}
              </p>
              <p className="text-sm text-[var(--text-muted)]">
                {active ? "Tap the mic to speak, tap again to stop" : "Start a voice session with Hamroh AI"}
              </p>
            </div>

            {/* Controls */}
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
                  onClick={listening ? stopListening : startListening}
                  disabled={processing || speaking}
                  className={`w-16 h-16 rounded-full flex items-center justify-center transition-all disabled:opacity-50 ${
                    listening
                      ? "bg-red-500 text-white scale-95"
                      : "bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)]"
                  }`}
                >
                  {listening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                </button>
                <button
                  onClick={stopSession}
                  className="w-16 h-16 rounded-full bg-[var(--bg-subtle)] border border-[var(--border)] flex items-center justify-center hover:bg-red-50 hover:border-red-200 transition-all"
                >
                  <StopCircle className="w-6 h-6 text-[var(--text-secondary)]" />
                </button>
              </div>
            )}

            {/* Conversation transcript */}
            {messages.length > 0 && (
              <div className="w-full max-w-lg mt-4">
                <h3 className="font-semibold text-sm text-[var(--text-secondary)] mb-3">Conversation</h3>
                <div className="bg-[var(--bg-subtle)] rounded-xl p-4 space-y-3 max-h-64 overflow-y-auto">
                  {messages.map((msg, i) => (
                    <div key={i} className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[85%] px-3 py-2 rounded-xl text-sm leading-relaxed ${
                        msg.role === "user"
                          ? "bg-[var(--primary)] text-white rounded-tr-sm"
                          : "bg-white text-[var(--text-primary)] border border-[var(--border)] rounded-tl-sm"
                      }`}>
                        {msg.content}
                      </div>
                    </div>
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
