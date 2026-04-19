"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { FileText, Bot, BookOpen, Map, Shield, Languages, Mic } from "lucide-react";

const features = (locale: string) => [
  {
    icon: FileText,
    titleEn: "Petitions & Tracking",
    desc: "File and track legal petitions to authorities. AI scans for risks and generates professional drafts.",
    href: `/${locale}/petitions`,
    color: "bg-blue-50 text-blue-600",
  },
  {
    icon: Bot,
    titleEn: "AI Legal Assistant",
    desc: "24/7 legal consultation powered by lawify.uz. Analyze documents, understand rights, draft applications.",
    href: `/${locale}/ai-assistant`,
    color: "bg-[#E8F4F6] text-[#0E6E7E]",
  },
  {
    icon: BookOpen,
    titleEn: "Legal Content",
    desc: "Curated legal articles, videos and infographics tailored to your country and situation.",
    href: `/${locale}/content`,
    color: "bg-purple-50 text-purple-600",
  },
  {
    icon: Map,
    titleEn: "Legal Services Map",
    desc: "Find embassies, lawyers, hospitals, and police stations near you on an interactive map.",
    href: `/${locale}/maps/legal`,
    color: "bg-orange-50 text-orange-600",
  },
  {
    icon: Shield,
    titleEn: "Security Map",
    desc: "AI-powered daily safety intelligence for 50+ countries where Uzbek citizens live and work.",
    href: `/${locale}/maps/security`,
    color: "bg-red-50 text-red-600",
  },
  {
    icon: Languages,
    titleEn: "Smart Translator",
    desc: "Translate text and documents between Uzbek, Russian, English. Live simultaneous translation.",
    href: `/${locale}/translator`,
    color: "bg-green-50 text-green-600",
  },
  {
    icon: Mic,
    titleEn: "Voice Mode",
    desc: "Speak directly to Hamroh AI in your language. Full spoken conversation for hands-free legal help.",
    href: `/${locale}/voice`,
    color: "bg-yellow-50 text-yellow-600",
  },
];

export default function LandingFeatures({ locale }: { locale: string }) {
  const t = useTranslations("home.features");

  return (
    <section className="py-20 bg-[#F7F9FA]">
      <div className="page-wrapper">
        <div className="text-center mb-12">
          <h2
            className="text-3xl md:text-4xl font-bold text-[#1A2733] mb-3"
            style={{ fontFamily: "var(--font-jakarta, 'Plus Jakarta Sans', sans-serif)" }}
          >
            {t("title")}
          </h2>
          <p className="text-[#4A6274] max-w-xl mx-auto">
            7 integrated modules — designed specifically for Uzbek citizens abroad
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features(locale).map((f) => (
            <Link
              key={f.titleEn}
              href={f.href}
              className="card block group hover:border-[#0E6E7E] h-full"
            >
              <div className={`w-12 h-12 rounded-xl ${f.color} flex items-center justify-center mb-4`}>
                <f.icon className="w-6 h-6" />
              </div>
              <h3
                className="font-bold text-[#1A2733] mb-1 group-hover:text-[#0E6E7E] transition-colors"
                style={{ fontFamily: "var(--font-jakarta, 'Plus Jakarta Sans', sans-serif)" }}
              >
                {f.titleEn}
              </h3>
              <p className="text-sm text-[#4A6274] leading-relaxed">{f.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
