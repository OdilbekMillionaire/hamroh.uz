"use client";

import { useState, useEffect, useCallback } from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  Search, RefreshCw, ExternalLink, Sparkles, Clock, ChevronDown,
  Newspaper, Globe, Filter, X, Loader2, AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Article {
  id: string;
  title: string;
  originalTitle: string;
  description: string;
  aiSummary: string;
  url: string;
  source: string;
  publishedAt: string;
  imageUrl: string | null;
  author: string | null;
}

interface NewsResponse {
  articles?: Article[];
  totalResults?: number;
  error?: string;
}

const TOPICS = ["all", "labor", "legal", "uzbekistan", "visa", "safety", "economy"] as const;
const COUNTRIES = ["all", "russia", "korea", "turkey", "uae", "germany", "usa"] as const;

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const hours = Math.floor(diff / 3600000);
  if (hours < 1) return "Just now";
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function NewsPage() {
  const t = useTranslations("news");
  const locale = useLocale();

  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [topic, setTopic] = useState<string>("all");
  const [country, setCountry] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 600);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchNews = useCallback(
    async (pageNum = 1, append = false) => {
      if (pageNum === 1) setLoading(true);
      else setLoadingMore(true);
      setError(null);

      const params = new URLSearchParams({
        topic,
        country,
        locale,
        page: String(pageNum),
        ...(debouncedSearch && { search: debouncedSearch }),
      });

      try {
        const res = await fetch(`/api/news?${params}`);
        const data = (await res.json()) as NewsResponse;
        if (!res.ok) throw new Error(data.error || t("error"));
        const nextArticles = data.articles ?? [];
        if (append) {
          setArticles((prev) => [...prev, ...nextArticles]);
        } else {
          setArticles(nextArticles);
        }
        setTotalResults(data.totalResults || 0);
        setPage(pageNum);
      } catch (err) {
        setError(err instanceof Error ? err.message : t("error"));
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [topic, country, locale, debouncedSearch, t]
  );

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchNews(1, false);
  }, [fetchNews]);

  const activeFiltersCount = (topic !== "all" ? 1 : 0) + (country !== "all" ? 1 : 0);

  return (
    <div className="max-w-5xl">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1
            className="text-2xl font-bold text-[#1A2733] mb-1"
            style={{ fontFamily: "var(--font-jakarta, 'Plus Jakarta Sans', sans-serif)" }}
          >
            {t("title")}
          </h1>
          <p className="text-[#4A6274] text-sm">{t("subtitle")}</p>
        </div>
        <button
          onClick={() => fetchNews(1)}
          disabled={loading}
          className="p-2 rounded-xl border border-[#D8E2E9] hover:bg-[#F7F9FA] transition-colors disabled:opacity-50"
          title="Refresh"
        >
          <RefreshCw className={`w-4 h-4 text-[#4A6274] ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {/* Search + Filter toggle */}
      <div className="flex gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8FA5B5]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("searchPlaceholder")}
            className="w-full pl-9 pr-4 py-2.5 border border-[#D8E2E9] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0E6E7E] transition-all"
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2">
              <X className="w-3.5 h-3.5 text-[#8FA5B5] hover:text-[#4A6274]" />
            </button>
          )}
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={cn(
            "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition-all",
            showFilters || activeFiltersCount > 0
              ? "bg-[#0E6E7E] text-white border-[#0E6E7E]"
              : "border-[#D8E2E9] text-[#4A6274] hover:bg-[#F7F9FA]"
          )}
        >
          <Filter className="w-4 h-4" />
          {t("sortBy")}
          {activeFiltersCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-white text-[#0E6E7E] text-xs font-bold flex items-center justify-center">
              {activeFiltersCount}
            </span>
          )}
          <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showFilters ? "rotate-180" : ""}`} />
        </button>
      </div>

      {/* Filter panel */}
      {showFilters && (
        <div className="bg-white border border-[#D8E2E9] rounded-2xl p-5 mb-5 space-y-4">
          <div>
            <p className="text-xs font-semibold text-[#8FA5B5] uppercase tracking-wide mb-2">Topic</p>
            <div className="flex flex-wrap gap-2">
              {TOPICS.map((tp) => (
                <button
                  key={tp}
                  onClick={() => setTopic(tp)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-medium transition-all border",
                    topic === tp
                      ? "bg-[#0E6E7E] text-white border-[#0E6E7E]"
                      : "border-[#D8E2E9] text-[#4A6274] hover:border-[#0E6E7E] hover:text-[#0E6E7E]"
                  )}
                >
                  {t(`filters.${tp}`)}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold text-[#8FA5B5] uppercase tracking-wide mb-2">
              <Globe className="inline w-3 h-3 mr-1" />
              Country Focus
            </p>
            <div className="flex flex-wrap gap-2">
              {COUNTRIES.map((c) => (
                <button
                  key={c}
                  onClick={() => setCountry(c)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-medium transition-all border",
                    country === c
                      ? "bg-[#0E6E7E] text-white border-[#0E6E7E]"
                      : "border-[#D8E2E9] text-[#4A6274] hover:border-[#0E6E7E] hover:text-[#0E6E7E]"
                  )}
                >
                  {t(`countries.${c}`)}
                </button>
              ))}
            </div>
          </div>
          {(topic !== "all" || country !== "all") && (
            <button
              onClick={() => { setTopic("all"); setCountry("all"); }}
              className="text-xs text-[#0E6E7E] hover:underline flex items-center gap-1"
            >
              <X className="w-3 h-3" />
              Clear all filters
            </button>
          )}
        </div>
      )}

      {/* Active filter pills */}
      {(topic !== "all" || country !== "all") && !showFilters && (
        <div className="flex gap-2 mb-4 flex-wrap">
          {topic !== "all" && (
            <span className="inline-flex items-center gap-1 bg-[#E8F4F6] text-[#0E6E7E] text-xs font-medium px-3 py-1 rounded-full">
              {t(`filters.${topic}`)}
              <button onClick={() => setTopic("all")}><X className="w-3 h-3" /></button>
            </span>
          )}
          {country !== "all" && (
            <span className="inline-flex items-center gap-1 bg-[#E8F4F6] text-[#0E6E7E] text-xs font-medium px-3 py-1 rounded-full">
              {t(`countries.${country}`)}
              <button onClick={() => setCountry("all")}><X className="w-3 h-3" /></button>
            </span>
          )}
        </div>
      )}

      {/* Results count */}
      {!loading && !error && (
        <p className="text-xs text-[#8FA5B5] mb-4">
          {articles.length} articles shown
          {totalResults > 0 && ` · ${totalResults.toLocaleString()} total results`}
        </p>
      )}

      {/* Loading skeleton */}
      {loading && (
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="card animate-pulse">
              <div className="flex gap-4">
                <div className="w-24 h-20 bg-[#EEF2F5] rounded-xl shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-[#EEF2F5] rounded w-3/4" />
                  <div className="h-3 bg-[#EEF2F5] rounded w-full" />
                  <div className="h-3 bg-[#EEF2F5] rounded w-5/6" />
                  <div className="h-3 bg-[#EEF2F5] rounded w-1/3" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <div>
            <p className="font-medium text-sm">{t("error")}</p>
            <p className="text-xs mt-0.5">{error}</p>
          </div>
          <button onClick={() => fetchNews(1)} className="ml-auto text-xs underline hover:no-underline">
            {t("loadMore")}
          </button>
        </div>
      )}

      {/* News articles */}
      {!loading && !error && (
        <>
          <div className="space-y-4">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} t={t} />
            ))}
          </div>

          {articles.length === 0 && (
            <div className="text-center py-16">
              <Newspaper className="w-12 h-12 mx-auto mb-3 text-[#8FA5B5] opacity-50" />
              <p className="font-medium text-[#4A6274]">{t("noResults")}</p>
              <button
                onClick={() => { setTopic("all"); setCountry("all"); setSearch(""); }}
                className="mt-3 text-sm text-[#0E6E7E] hover:underline"
              >
                Clear all filters
              </button>
            </div>
          )}

          {articles.length > 0 && articles.length < totalResults && (
            <div className="text-center mt-6">
              <button
                onClick={() => fetchNews(page + 1, true)}
                disabled={loadingMore}
                className="inline-flex items-center gap-2 px-6 py-2.5 border border-[#0E6E7E] text-[#0E6E7E] rounded-xl text-sm font-semibold hover:bg-[#E8F4F6] transition-all disabled:opacity-50"
              >
                {loadingMore ? <Loader2 className="w-4 h-4 animate-spin" /> : <ChevronDown className="w-4 h-4" />}
                {loadingMore ? t("loading") : t("loadMore")}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function ArticleCard({ article, t }: { article: Article; t: (key: string) => string }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="card hover:border-[#0E6E7E] transition-all">
      <div className="flex gap-4">
        {article.imageUrl && (
          <div className="w-24 h-20 rounded-xl overflow-hidden shrink-0 bg-[#EEF2F5]">
            <img
              src={article.imageUrl}
              alt=""
              className="w-full h-full object-cover"
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
            />
          </div>
        )}
        {!article.imageUrl && (
          <div className="w-12 h-12 rounded-xl bg-[#E8F4F6] flex items-center justify-center shrink-0">
            <Newspaper className="w-5 h-5 text-[#0E6E7E]" />
          </div>
        )}

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-[#1A2733] text-sm leading-snug mb-1 line-clamp-2">
            {article.title}
          </h3>

          {/* AI summary */}
          {article.aiSummary && (
            <div className="flex items-start gap-1.5 bg-[#E8F4F6] rounded-lg px-3 py-2 mb-2">
              <Sparkles className="w-3 h-3 text-[#0E6E7E] mt-0.5 shrink-0" />
              <p className="text-xs text-[#0E6E7E] leading-relaxed">{article.aiSummary}</p>
            </div>
          )}

          <div className="flex items-center gap-3 text-xs text-[#8FA5B5] flex-wrap">
            <span className="font-medium text-[#4A6274]">{article.source}</span>
            <span className="flex items-center gap-0.5">
              <Clock className="w-3 h-3" />
              {timeAgo(article.publishedAt)}
            </span>
            {article.author && (
              <span className="truncate max-w-32">{article.author}</span>
            )}
          </div>
        </div>

        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 p-2 rounded-xl hover:bg-[#E8F4F6] transition-colors mt-1"
          title={t("readFull")}
        >
          <ExternalLink className="w-4 h-4 text-[#0E6E7E]" />
        </a>
      </div>

      {article.description && article.description.length > 80 && (
        <div className="mt-3 border-t border-[#EEF2F5] pt-3">
          <p className={`text-xs text-[#4A6274] leading-relaxed ${expanded ? "" : "line-clamp-2"}`}>
            {article.description}
          </p>
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-xs text-[#0E6E7E] hover:underline mt-1"
          >
            {expanded ? "Show less" : t("readFull")}
          </button>
        </div>
      )}
    </div>
  );
}
