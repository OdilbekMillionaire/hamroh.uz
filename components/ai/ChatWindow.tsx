"use client";

import { useState, useRef, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Send, Loader2, Upload, Mic, Volume2, Bot, User } from "lucide-react";
import FormattedMessage from "@/components/ai/FormattedMessage";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
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
  const bottomRef = useRef<HTMLDivElement>(null);

  const quickActions = t.raw("quickActions") as string[];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage(text: string) {
    if (!text.trim() || loading) return;
    const userMsg: Message = {
      id: `user-${messages.length + 1}`,
      role: "user",
      content: text,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
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
        const lines = chunk.split("\n");
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") continue;
            try {
              const parsed = JSON.parse(data);
              if (parsed.text) {
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === assistantMsg.id ? { ...m, content: m.content + parsed.text } : m
                  )
                );
              }
            } catch {}
          }
        }
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `${userMsg.id}-error`,
          role: "assistant",
          content: t("busyMsg"),
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col h-full max-h-[calc(100vh-4rem)]">
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
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
            >
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                msg.role === "assistant" ? "bg-[var(--primary-light)]" : "bg-[var(--primary)]"
              }`}>
                {msg.role === "assistant"
                  ? <Bot className="w-4 h-4 text-[var(--primary)]" />
                  : <User className="w-4 h-4 text-white" />
                }
              </div>
              <div className={`max-w-[78%] ${msg.role === "user" ? "items-end" : "items-start"} flex flex-col gap-1`}>
                <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-[var(--primary)] text-white rounded-tr-sm whitespace-pre-wrap"
                    : "bg-white border border-[var(--border)] text-[var(--text-primary)] rounded-tl-sm shadow-sm"
                }`}>
                  {msg.role === "assistant" ? <FormattedMessage content={msg.content} /> : msg.content}
                  {msg.role === "assistant" && msg.content.trim().length > 0 && (
                    <button className="mt-3 flex items-center gap-1 border-t border-[var(--border)] pt-2 text-xs text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors">
                      <Volume2 className="w-3 h-3" />
                      {t("listenBtn")}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        {loading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-xl bg-[var(--primary-light)] flex items-center justify-center">
              <Bot className="w-4 h-4 text-[var(--primary)]" />
            </div>
            <div className="bg-white border border-[var(--border)] px-4 py-3 rounded-2xl rounded-tl-sm shadow-sm">
              <Loader2 className="w-4 h-4 animate-spin text-[var(--primary)]" />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {messages.length === 1 && (
        <div className="px-4 pb-2 flex flex-wrap gap-2">
          {quickActions.map((action: string) => (
            <button
              key={action}
              onClick={() => sendMessage(action)}
              className="text-xs bg-[var(--primary-light)] text-[var(--primary)] px-3 py-1.5 rounded-full hover:bg-[var(--primary)] hover:text-white transition-all font-medium"
            >
              {action}
            </button>
          ))}
        </div>
      )}

      <div className="p-4 border-t border-[var(--border)] bg-white">
        <p className="text-xs text-[var(--text-muted)] mb-3 text-center">{t("disclaimer")}</p>
        <div className="flex items-end gap-2">
          <button className="p-2.5 rounded-xl border border-[var(--border)] hover:bg-[var(--bg-subtle)] transition-colors shrink-0">
            <Upload className="w-4 h-4 text-[var(--text-secondary)]" />
          </button>
          <button className="p-2.5 rounded-xl border border-[var(--border)] hover:bg-[var(--bg-subtle)] transition-colors shrink-0">
            <Mic className="w-4 h-4 text-[var(--text-secondary)]" />
          </button>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage(input);
              }
            }}
            placeholder={t("placeholder")}
            rows={1}
            className="flex-1 resize-none px-4 py-2.5 border border-[var(--border)] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all min-h-[44px] max-h-32"
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || loading}
            className="p-2.5 bg-[var(--primary)] text-white rounded-xl hover:bg-[var(--primary-hover)] disabled:opacity-50 disabled:cursor-not-allowed transition-all shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
