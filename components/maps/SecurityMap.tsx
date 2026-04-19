"use client";

import { useTranslations } from "next-intl";
import { AlertTriangle, CheckCircle, AlertCircle, Clock } from "lucide-react";

const securityData = [
  { country: "Russia", code: "RU", flag: "🇷🇺", level: "caution", summary: "General safety, active migration control. Carry documents at all times.", updated: "2025-04-19" },
  { country: "South Korea", code: "KR", flag: "🇰🇷", level: "safe", summary: "Safe for Uzbek workers. Labor rights well enforced. High cost of living.", updated: "2025-04-19" },
  { country: "Turkey", code: "TR", flag: "🇹🇷", level: "caution", summary: "Moderate safety. Economic instability. Uzbek community well established.", updated: "2025-04-19" },
  { country: "UAE", code: "AE", flag: "🇦🇪", level: "caution", summary: "Safe but strict laws. Employment visa required. Zero tolerance for drug offenses.", updated: "2025-04-19" },
  { country: "Germany", code: "DE", flag: "🇩🇪", level: "safe", summary: "Very safe. Strong labor protections. Language barrier may be an issue.", updated: "2025-04-19" },
  { country: "USA", code: "US", flag: "🇺🇸", level: "safe", summary: "Safe. Strict immigration enforcement. Consular services available in major cities.", updated: "2025-04-19" },
];

const levelConfig = {
  danger: { label: "Danger", color: "text-[var(--status-danger)]", bg: "bg-red-50", border: "border-red-200", Icon: AlertTriangle },
  caution: { label: "Caution", color: "text-[var(--status-pending)]", bg: "bg-orange-50", border: "border-orange-200", Icon: AlertCircle },
  safe: { label: "Safe", color: "text-[var(--accent)]", bg: "bg-green-50", border: "border-green-200", Icon: CheckCircle },
};

export default function SecurityMap() {
  const t = useTranslations("maps.security");

  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[var(--text-primary)]" style={{ fontFamily: "var(--font-jakarta)" }}>
          {t("title")}
        </h1>
        <p className="text-[var(--text-secondary)] text-sm mt-1">
          AI-powered daily safety intelligence — updated every 24 hours
        </p>
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {securityData.map((item) => {
          const cfg = levelConfig[item.level as keyof typeof levelConfig];
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

      <div className="mt-6 p-4 bg-[var(--bg-subtle)] rounded-xl text-xs text-[var(--text-muted)] flex items-start gap-2">
        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
        <p>
          Security data is AI-generated and updated daily. It is for informational
          purposes only. Always check official government travel advisories for your specific situation.
        </p>
      </div>
    </div>
  );
}
