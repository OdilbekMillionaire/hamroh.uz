"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { ArrowRight, Shield, Bot, FileText } from "lucide-react";

export default function LandingHero({ locale }: { locale: string }) {
  const t = useTranslations("home.hero");

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#0E6E7E] via-[#0B5A6A] to-[#083D47] py-24 md:py-32">
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#2ECC71] rounded-full blur-3xl" />
      </div>
      <div className="page-wrapper relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 text-white text-sm font-medium px-4 py-2 rounded-full mb-6 backdrop-blur-sm">
            <span className="w-2 h-2 bg-[#2ECC71] rounded-full animate-pulse" />
            Powered by Google Gemini AI
          </div>
          <h1
            className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight"
            style={{ fontFamily: "var(--font-jakarta, 'Plus Jakarta Sans', sans-serif)" }}
          >
            {t("title")}
          </h1>
          <p className="text-white/80 text-lg md:text-xl mb-8 max-w-2xl mx-auto leading-relaxed">
            {t("subtitle")}
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href={`/${locale}/register`}
              className="inline-flex items-center gap-2 bg-white text-[#0E6E7E] font-semibold px-8 py-3.5 rounded-xl hover:bg-gray-50 transition-all shadow-lg"
            >
              {t("ctaPrimary")}
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href={`/${locale}/ai-assistant`}
              className="inline-flex items-center gap-2 border-2 border-white/50 text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-white/10 transition-all"
            >
              <Bot className="w-4 h-4" />
              {t("ctaSecondary")}
            </Link>
          </div>

          <div className="mt-16 grid grid-cols-3 gap-4 max-w-lg mx-auto">
            {[
              { icon: Shield, label: "Legal Protection" },
              { icon: Bot, label: "AI Assistant" },
              { icon: FileText, label: "Petition Tracking" },
            ].map((item) => (
              <div key={item.label} className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center text-white">
                <item.icon className="w-6 h-6 mx-auto mb-2 text-[#2ECC71]" />
                <p className="text-xs font-medium">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
