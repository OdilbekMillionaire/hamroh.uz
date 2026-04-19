"use client";

import { useTranslations } from "next-intl";
import { Users, Briefcase, GraduationCap } from "lucide-react";

export default function LandingStats() {
  const t = useTranslations("home.stats");

  const stats = [
    { icon: Users, value: "9M+", label: t("citizens"), color: "text-[#0E6E7E]" },
    { icon: Briefcase, value: "1.3M", label: t("migrants"), color: "text-[#2ECC71]" },
    { icon: GraduationCap, value: "30K+", label: t("students"), color: "text-[#9B59B6]" },
  ];

  return (
    <section className="py-12 bg-white border-b border-[#D8E2E9]">
      <div className="page-wrapper">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <stat.icon className={`w-8 h-8 mx-auto mb-2 ${stat.color}`} />
              <div
                className="text-3xl font-bold text-[#1A2733] mb-1"
                style={{ fontFamily: "var(--font-jakarta, 'Plus Jakarta Sans', sans-serif)" }}
              >
                {stat.value}
              </div>
              <div className="text-[#4A6274] text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
