"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { BookOpen, Video, BarChart2, Newspaper, Bookmark, Share2, Sparkles, Search } from "lucide-react";
import { cn } from "@/lib/utils";

const TYPE_ICONS = {
  article: BookOpen,
  video: Video,
  infographic: BarChart2,
  news: Newspaper,
};

const mockContent = [
  {
    id: "c1",
    type: "article",
    country: "RU",
    title: "Your Labor Rights as a Migrant Worker in Russia",
    aiSummary: "Russian law guarantees migrant workers equal pay and safe conditions. Key rights include written contracts and timely payment.",
    date: "2025-04-15",
    saved: false,
  },
  {
    id: "c2",
    type: "news",
    country: "*",
    title: "New Uzbek Consular Services Now Available Online",
    aiSummary: "The Uzbek Ministry of Foreign Affairs has launched a new portal for Uzbeks abroad to apply for consular services remotely.",
    date: "2025-04-18",
    saved: true,
  },
  {
    id: "c3",
    type: "article",
    country: "KR",
    title: "South Korea E-9 Visa: Complete Guide for Uzbek Workers",
    aiSummary: "E-9 visa allows employment in manufacturing, construction, and agriculture. Valid for 3 years with extensions available.",
    date: "2025-04-12",
    saved: false,
  },
  {
    id: "c4",
    type: "infographic",
    country: "TR",
    title: "Emergency Contacts for Uzbek Citizens in Turkey",
    aiSummary: "List of embassy contacts, emergency numbers, and legal aid organizations available to Uzbek citizens in Turkey.",
    date: "2025-04-10",
    saved: false,
  },
];

export default function ContentFeed() {
  const t = useTranslations("content");
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [saved, setSaved] = useState<Record<string, boolean>>(
    Object.fromEntries(mockContent.map((c) => [c.id, c.saved]))
  );

  const filters = ["all", "article", "news", "video", "infographic"] as const;

  const filtered = mockContent.filter((c) => {
    if (filter !== "all" && c.type !== filter) return false;
    if (search && !c.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[var(--text-primary)]" style={{ fontFamily: "var(--font-jakarta)" }}>
          {t("title")}
        </h1>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search legal content..."
            className="w-full pl-9 pr-4 py-2.5 border border-[var(--border)] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "px-3 py-2 rounded-xl text-sm font-medium transition-all shrink-0",
                filter === f ? "bg-[var(--primary)] text-white" : "bg-[var(--bg-subtle)] text-[var(--text-secondary)] hover:bg-[var(--bg-muted)]"
              )}
            >
              {f === "all" ? t("filters.all") : t(`filters.${f}`)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filtered.map((item) => {
          const Icon = TYPE_ICONS[item.type as keyof typeof TYPE_ICONS];
          return (
            <div key={item.id} className="card hover:border-[var(--primary)] cursor-pointer group">
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[var(--primary-light)] flex items-center justify-center">
                    <Icon className="w-4 h-4 text-[var(--primary)]" />
                  </div>
                  <span className="text-xs font-medium text-[var(--text-muted)] capitalize">{item.type}</span>
                  {item.country !== "*" && (
                    <span className="text-xs bg-[var(--bg-muted)] text-[var(--text-muted)] px-2 py-0.5 rounded-full">{item.country}</span>
                  )}
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => setSaved((prev) => ({ ...prev, [item.id]: !prev[item.id] }))}
                    className={`p-1.5 rounded-lg transition-colors ${
                      saved[item.id] ? "bg-[var(--primary-light)] text-[var(--primary)]" : "hover:bg-[var(--bg-subtle)] text-[var(--text-muted)]"
                    }`}
                  >
                    <Bookmark className="w-3.5 h-3.5" fill={saved[item.id] ? "currentColor" : "none"} />
                  </button>
                  <button className="p-1.5 rounded-lg hover:bg-[var(--bg-subtle)] text-[var(--text-muted)] transition-colors">
                    <Share2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <h3 className="font-semibold text-[var(--text-primary)] text-sm mb-3 group-hover:text-[var(--primary)] transition-colors leading-tight">
                {item.title}
              </h3>

              <div className="bg-[var(--primary-light)] rounded-lg p-3 mb-3">
                <div className="flex items-center gap-1 mb-1">
                  <Sparkles className="w-3 h-3 text-[var(--primary)]" />
                  <span className="text-xs font-semibold text-[var(--primary)]">{t("aiSummary")}</span>
                </div>
                <p className="text-xs text-[var(--primary)]/80 leading-relaxed">{item.aiSummary}</p>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-[var(--text-muted)]">{item.date}</span>
                <span className="text-xs font-semibold text-[var(--primary)] hover:underline">{t("readMore")} →</span>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="col-span-2 text-center py-16 text-[var(--text-muted)]">
            <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>No content found</p>
          </div>
        )}
      </div>
    </div>
  );
}
