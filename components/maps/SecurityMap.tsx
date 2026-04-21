"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { AlertTriangle, CheckCircle, AlertCircle, Clock, Loader2, RefreshCw } from "lucide-react";

interface CountryData {
  country: string;
  code: string;
  flag: string;
  level: string;
  summary: string;
  updated: string;
}

const levelConfig = {
  danger: { label: "Danger", color: "text-[var(--status-danger)]", bg: "bg-red-50", border: "border-red-200", Icon: AlertTriangle },
  caution: { label: "Caution", color: "text-[var(--status-pending)]", bg: "bg-orange-50", border: "border-orange-200", Icon: AlertCircle },
  safe: { label: "Safe", color: "text-[var(--accent)]", bg: "bg-green-50", border: "border-green-200", Icon: CheckCircle },
};

export default function SecurityMap() {
  const t = useTranslations("maps.security");
  const [data, setData] = useState<CountryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  async function fetchData() {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch("/api/security-map");
      if (!res.ok) throw new Error("Failed");
      const json = await res.json() as CountryData[];
      setData(json);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { void fetchData(); }, []);

  return (
    <div className="max-w-4xl">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]" style={{ fontFamily: "var(--font-jakarta)" }}>
            {t("title")}
          </h1>
          <p className="text-[var(--text-secondary)] text-sm mt-1">
            AI-powered safety intelligence for Uzbek citizens abroad
          </p>
        </div>
        <button
          onClick={() => void fetchData()}
          disabled={loading}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[var(--text-secondary)] border border-[var(--border)] rounded-xl hover:bg-[var(--bg-subtle)] disabled:opacity-50 transition-all shrink-0"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      <div className="flex gap-3 mb-6">
        {(["safe", "caution", "danger"] as const).map((level) => {
          const cfg = levelConfig[level];
          return (
            <div key={level} className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium ${cfg.bg} ${cfg.color}`}>
              <cfg.Icon className="w-3.5 h-3.5" />
              {t(`levels.${level}`)}
            </div>
          );
        })}
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-[var(--text-muted)]">
          <Loader2 className="w-8 h-8 animate-spin mb-3 text-[var(--primary)]" />
          <p className="text-sm">Generating AI safety assessment...</p>
        </div>
      ) : error ? (
        <div className="text-center py-16">
          <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-3" />
          <p className="text-sm text-[var(--text-muted)] mb-4">Could not load safety data.</p>
          <button onClick={() => void fetchData()} className="btn-primary px-4 py-2 text-sm">
            Try Again
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.map((item) => {
            const cfg = levelConfig[item.level as keyof typeof levelConfig] ?? levelConfig.caution;
            return (
              <div key={item.code} className={`card border ${cfg.border} hover:shadow-md`}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{item.flag}</span>
                    <span className="font-bold text-[var(--text-primary)]" style={{ fontFamily: "var(--font-jakarta)" }}>
                      {item.country}
                    </span>
                  </div>
                  <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.bg} ${cfg.color}`}>
                    <cfg.Icon className="w-3 h-3" />
                    {t(`levels.${item.level}`)}
                  </div>
                </div>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-3">{item.summary}</p>
                <div className="flex items-center gap-1 text-xs text-[var(--text-muted)]">
                  <Clock className="w-3 h-3" />
                  {t("lastUpdated")}: {item.updated}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-6 p-4 bg-[var(--bg-subtle)] rounded-xl text-xs text-[var(--text-muted)] flex items-start gap-2">
        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
        <p>
          Security data is AI-generated and for informational purposes only.
          Always check official government travel advisories for your specific situation.
        </p>
      </div>
    </div>
  );
}
