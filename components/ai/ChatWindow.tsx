"use client";

import { useState, useRef, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Send, Loader2, Upload, Mic, MicOff, Volume2, Bot, User, FileText, X } from "lucide-react";
import FormattedMessage from "@/components/ai/FormattedMessage";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  attachment?: string;
}

export default function ChatWindow() {
  const t = useTranslations("ai");
  const locale = useLocale();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: locale === "ru"
        ? "Здравствуйте! Я Хамрох АИ — ваш правовой помощник. Чем могу помочь?"
        : locale === "uz-cyrl"
        ? "Ассалому алайкум! Мен Ҳамроҳ АИ — ҳуқуқий ёрдамчингиз. Қандай ёрдам бера оламан?"
        : locale === "en"
        ? "Hello! I'm Hamroh AI — your legal assistant for Uzbek citizens abroad. How can I help you today?"
        : "Assalomu alaykum! Men Hamroh AI — huquqiy yordamchingizman. Qanday yordam bera olaman?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [recording, setRecording] = useState(false);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [analyzingDoc, setAnalyzingDoc] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const quickActions = t.raw("quickActions") as string[];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage(text: string) {
    if ((!text.trim() && !pendingFile) || loading) return;
    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text.trim() || (pendingFile ? `[Attached: ${pendingFile.name}]` : ""),
      timestamp: new Date(),
      attachment: pendingFile?.name,
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setPendingFile(null);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMsg].map((m) => ({ role: m.role, content: m.content })),
          locale,
        }),
      });

      if (!res.ok) throw new Error("API error");
      const reader = res.body?.getReader();
      if (!reader) throw new Error("No reader");

      const assistantMsg: Message = {
        id: `${userMsg.id}-assistant`,
        role: "assistant",
        content: "",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMsg]);

      const decoder = new TextDecoder();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        for (const line of chunk.split("\n")) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") continue;
            try {
              const parsed = JSON.parse(data) as { text?: string };
              if (parsed.text) {
                setMessages((prev) =>
                  prev.map((m) => m.id === assistantMsg.id ? { ...m, content: m.content + parsed.text } : m)
                );
              }
            } catch { /* partial chunk */ }
          }
        }
      }
    } catch {
      setMessages((prev) => [...prev, { id: `err-${Date.now()}`, role: "assistant", content: t("busyMsg"), timestamp: new Date() }]);
    } finally {
      setLoading(false);
    }
  }

  async function handleFileUpload(file: File) {
    setPendingFile(file);
    setAnalyzingDoc(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("locale", locale);
      const res = await fetch("/api/analyze-document", { method: "POST", body: formData });
      if (res.ok) {
        const data = await res.json() as { analysis?: string };
        const analysis = data.analysis ?? "Could not analyze document.";
        const docMsg: Message = {
          id: `doc-${Date.now()}`,
          role: "user",
          content: `[Document: ${file.name}]\n\n${t("analyzingDoc") || "Please analyze this document and advise me on any legal implications."}`,
          timestamp: new Date(),
          attachment: file.name,
        };
        setMessages((prev) => [...prev, docMsg]);
        const resultMsg: Message = {
          id: `doc-result-${Date.now()}`,
          role: "assistant",
          content: `**Document Analysis: ${file.name}**\n\n${analysis}`,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, resultMsg]);
      }
    } catch {
      setMessages((prev) => [...prev, { id: `doc-err-${Date.now()}`, role: "assistant", content: "Could not analyze the document. Please try again.", timestamp: new Date() }]);
    } finally {
      setAnalyzingDoc(false);
      setPendingFile(null);
    }
  }

  function toggleRecording() {
    if (recording) {
      recognitionRef.current?.stop();
      setRecording(false);
      return;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) {
      alert("Voice input is not supported in this browser. Please use Chrome or Edge.");
      return;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rec = new SR() as any;
    rec.lang = locale === "ru" ? "ru-RU" : locale === "uz" || locale === "uz-cyrl" ? "uz-UZ" : "en-US";
    rec.interimResults = true;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rec.onresult = (e: any) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const transcript = Array.from(e.results).map((r: any) => (r as any)[0].transcript).join("");
      setInput(transcript);
    };
    rec.onend = () => setRecording(false);
    rec.start();
    recognitionRef.current = rec;
    setRecording(true);
  }

  function speakText(text: string) {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text.replace(/[*#`]/g, ""));
    utter.lang = locale === "ru" ? "ru-RU" : locale === "uz" || locale === "uz-cyrl" ? "uz-UZ" : "en-US";
    window.speechSynthesis.speak(utter);
  }

  function autoResize(el: HTMLTextAreaElement) {
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 128) + "px";
  }

  return (
    <div className="flex flex-col h-full max-h-[calc(100vh-4rem)]">
      {/* Header */}
      <div className="p-4 border-b border-[var(--border)] bg-white">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[var(--primary)] flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-[var(--text-primary)]" style={{ fontFamily: "var(--font-jakarta)" }}>
              {t("title")}
            </h1>
            <div className="flex items-center gap-1.5 text-xs text-[var(--accent)]">
              <span className="w-1.5 h-1.5 bg-[var(--accent)] rounded-full animate-pulse" />
              Online
            </div>
          </div>
          <div className="ml-auto flex items-center gap-1.5">
            <span className="text-xs text-[var(--text-muted)] bg-[var(--bg-subtle)] px-2.5 py-1 rounded-full">
              {t("uploadDoc")}
            </span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${msg.role === "assistant" ? "bg-[var(--primary-light)]" : "bg-[var(--primary)]"}`}>
              {msg.role === "assistant" ? <Bot className="w-4 h-4 text-[var(--primary)]" /> : <User className="w-4 h-4 text-white" />}
            </div>
            <div className={`max-w-[78%] ${msg.role === "user" ? "items-end" : "items-start"} flex flex-col gap-1`}>
              {msg.attachment && (
                <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] bg-[var(--bg-subtle)] px-3 py-1.5 rounded-xl">
                  <FileText className="w-3 h-3" />
                  {msg.attachment}
                </div>
              )}
              <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${msg.role === "user" ? "bg-[var(--primary)] text-white rounded-tr-sm whitespace-pre-wrap" : "bg-white border border-[var(--border)] text-[var(--text-primary)] rounded-tl-sm shadow-sm"}`}>
                {msg.role === "assistant" ? <FormattedMessage content={msg.content} /> : msg.content}
                {msg.role === "assistant" && msg.content.trim().length > 0 && (
                  <button
                    onClick={() => speakText(msg.content)}
                    className="mt-3 flex items-center gap-1 border-t border-[var(--border)] pt-2 text-xs text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors"
                  >
                    <Volume2 className="w-3 h-3" />
                    {t("listenBtn")}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
        {(loading || analyzingDoc) && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-xl bg-[var(--primary-light)] flex items-center justify-center">
              <Bot className="w-4 h-4 text-[var(--primary)]" />
            </div>
            <div className="bg-white border border-[var(--border)] px-4 py-3 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-[var(--primary)]" />
              <span className="text-xs text-[var(--text-muted)]">
                {analyzingDoc ? (t("analyzingDoc") || "Analyzing document…") : ""}
              </span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Quick actions */}
      {messages.length === 1 && (
        <div className="px-4 pb-2 flex flex-wrap gap-2">
          {quickActions.map((action: string) => (
            <button
              key={action}
              onClick={() => void sendMessage(action)}
              className="text-xs bg-[var(--primary-light)] text-[var(--primary)] px-3 py-1.5 rounded-full hover:bg-[var(--primary)] hover:text-white transition-all font-medium"
            >
              {action}
            </button>
          ))}
        </div>
      )}

      {/* Input bar */}
      <div className="p-4 border-t border-[var(--border)] bg-white">
        <p className="text-xs text-[var(--text-muted)] mb-3 text-center">{t("disclaimer")}</p>

        {/* Pending file chip */}
        {pendingFile && !analyzingDoc && (
          <div className="mb-2 flex items-center gap-2 bg-[var(--primary-light)] text-[var(--primary)] text-xs px-3 py-2 rounded-xl">
            <FileText className="w-3.5 h-3.5 shrink-0" />
            <span className="flex-1 truncate font-medium">{pendingFile.name}</span>
            <button onClick={() => setPendingFile(null)}><X className="w-3.5 h-3.5" /></button>
          </div>
        )}

        <div className="flex items-end gap-2">
          {/* File upload */}
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf,image/*,.txt,.doc,.docx"
            className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) void handleFileUpload(f); if (fileInputRef.current) fileInputRef.current.value = ""; }}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={analyzingDoc}
            title={t("uploadDocBtn")}
            className="p-2.5 rounded-xl border border-[var(--border)] hover:bg-[var(--bg-subtle)] disabled:opacity-40 transition-colors shrink-0"
          >
            <Upload className="w-4 h-4 text-[var(--text-secondary)]" />
          </button>

          {/* Voice input */}
          <button
            onClick={toggleRecording}
            title={recording ? "Stop recording" : "Voice input"}
            className={`p-2.5 rounded-xl border transition-colors shrink-0 ${recording ? "border-red-300 bg-red-50 text-red-500 animate-pulse" : "border-[var(--border)] hover:bg-[var(--bg-subtle)] text-[var(--text-secondary)]"}`}
          >
            {recording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>

          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => { setInput(e.target.value); autoResize(e.target); }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                void sendMessage(input);
              }
            }}
            placeholder={t("placeholder")}
            rows={1}
            className="flex-1 resize-none px-4 py-2.5 border border-[var(--border)] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all min-h-[44px] max-h-32 overflow-y-auto"
          />
          <button
            onClick={() => void sendMessage(input)}
            disabled={(!input.trim() && !pendingFile) || loading || analyzingDoc}
            className="p-2.5 bg-[var(--primary)] text-white rounded-xl hover:bg-[var(--primary-hover)] disabled:opacity-50 disabled:cursor-not-allowed transition-all shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
