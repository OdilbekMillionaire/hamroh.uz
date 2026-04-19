"use client";

import { useState } from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Plus, FileText, Clock, CheckCircle, Eye, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

const mockPetitions = [
  {
    id: "p1",
    trackingId: "HMZ-2025-00142",
    title: "Labor contract violation — unpaid wages",
    category: "labor",
    status: "reviewing",
    createdAt: "2025-04-10",
    urgency: "high",
  },
  {
    id: "p2",
    trackingId: "HMZ-2025-00098",
    title: "Passport renewal assistance request",
    category: "document",
    status: "resolved",
    createdAt: "2025-03-22",
    urgency: "medium",
  },
  {
    id: "p3",
    trackingId: "HMZ-2025-00201",
    title: "Visa overstay emergency consultation",
    category: "migration",
    status: "sent",
    createdAt: "2025-04-17",
    urgency: "high",
  },
];

const statusConfig = {
  sent: { label: "Sent", color: "bg-blue-100 text-blue-700", icon: Clock },
  received: { label: "Received", color: "bg-purple-100 text-purple-700", icon: Eye },
  reviewing: { label: "Under Review", color: "bg-orange-100 text-orange-700", icon: Eye },
  resolved: { label: "Resolved", color: "bg-green-100 text-green-700", icon: CheckCircle },
};

const urgencyConfig = {
  high: { label: "High", color: "text-[var(--status-danger)]", bg: "bg-red-50" },
  medium: { label: "Medium", color: "text-[var(--status-pending)]", bg: "bg-orange-50" },
  low: { label: "Low", color: "text-[var(--accent)]", bg: "bg-green-50" },
};

export default function PetitionsList() {
  const t = useTranslations("petitions");
  const locale = useLocale();
  const [filter, setFilter] = useState<string>("all");

  const filtered = filter === "all"
    ? mockPetitions
    : mockPetitions.filter((p) => p.status === filter);

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]" style={{ fontFamily: "var(--font-jakarta)" }}>
            {t("title")}
          </h1>
          <p className="text-[var(--text-secondary)] text-sm mt-1">{mockPetitions.length} total petitions</p>
        </div>
        <Link
          href={`/${locale}/petitions/new`}
          className="flex items-center gap-2 btn-primary px-4 py-2.5 text-sm"
        >
          <Plus className="w-4 h-4" />
          {t("new")}
        </Link>
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {["all", "sent", "reviewing", "resolved"].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={cn(
              "px-4 py-2 rounded-xl text-sm font-medium transition-all shrink-0",
              filter === s
                ? "bg-[var(--primary)] text-white"
                : "bg-[var(--bg-subtle)] text-[var(--text-secondary)] hover:bg-[var(--bg-muted)]"
            )}
          >
            {s === "all" ? "All" : t(`statuses.${s}`)}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filtered.map((petition) => {
          const status = statusConfig[petition.status as keyof typeof statusConfig];
          const urgency = urgencyConfig[petition.urgency as keyof typeof urgencyConfig];
          const StatusIcon = status.icon;

          return (
            <Link key={petition.id} href={`/${locale}/petitions/${petition.id}`}>
              <div className="card hover:border-[var(--primary)] cursor-pointer transition-all">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[var(--primary-light)] flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5 text-[var(--primary)]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-semibold text-[var(--text-primary)] text-sm leading-tight">
                        {petition.title}
                      </h3>
                      <div className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium shrink-0 ${status.color}`}>
                        <StatusIcon className="w-3 h-3" />
                        {status.label}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-[var(--text-muted)]">
                      <span className="font-mono">{petition.trackingId}</span>
                      <span>•</span>
                      <span className={`font-medium flex items-center gap-1 ${urgency.color}`}>
                        <AlertTriangle className="w-3 h-3" />
                        {urgency.label} urgency
                      </span>
                      <span>•</span>
                      <span>{petition.createdAt}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}

        {filtered.length === 0 && (
          <div className="text-center py-16 text-[var(--text-muted)]">
            <FileText className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="font-medium">No petitions found</p>
          </div>
        )}
      </div>
    </div>
  );
}
