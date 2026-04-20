import { getLocale, getTranslations } from "next-intl/server";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import Footer from "@/components/layout/Footer";
import {
  FileText, Bot, Globe, TrendingUp, Clock,
  Lightbulb, ArrowRight, Scale, MapPin, ChevronRight, Newspaper, BookOpen
} from "lucide-react";
import Link from "next/link";

const MOCK_USER = { name: "Dilshod", country: "South Korea", countryFlag: "🇰🇷" };

const MOCK_CONTENT = [
  { title: "Labor Rights in Russia: What You Need to Know", type: "article", country: "RU", href: "#" },
  { title: "How to Renew Your Uzbek Passport Abroad", type: "guide", country: "*", href: "#" },
  { title: "Emergency Contacts for Uzbek Citizens in South Korea", type: "news", country: "KR", href: "#" },
];

export default async function DashboardPage() {
  const locale = await getLocale();
  const t = await getTranslations("dashboard");

  const MOCK_STATS = [
    { label: t("activePetitions"), value: "3", icon: FileText, color: "text-blue-600", bg: "bg-blue-50", href: "/petitions?status=active" },
    { label: t("resolved"), value: "12", icon: TrendingUp, color: "text-[#2ECC71]", bg: "bg-green-50", href: "/petitions?status=resolved" },
    { label: t("pendingReview"), value: "1", icon: Clock, color: "text-[#F39C12]", bg: "bg-orange-50", href: "/petitions?status=reviewing" },
  ];

  const QUICK_ACTIONS = [
    { icon: Bot, label: t("askAI"), href: `/${locale}/ai-assistant`, primary: true },
    { icon: FileText, label: t("newPetition"), href: `/${locale}/petitions/new`, primary: false },
    { icon: Scale, label: t("checkMyRights"), href: `/${locale}/rights`, primary: false },
    { icon: Globe, label: t("safetyMap"), href: `/${locale}/maps/security`, primary: false },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 min-w-0 p-6">
          <div className="max-w-5xl">

            {/* Greeting */}
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h1 className="text-2xl font-bold text-[var(--text-primary)]" style={{ fontFamily: "var(--font-jakarta)" }}>
                  {t("greeting")}, {MOCK_USER.name}! 👋
                </h1>
                <p className="text-[var(--text-secondary)] text-sm flex items-center gap-1.5 mt-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {MOCK_USER.countryFlag} {MOCK_USER.country}
                  <button className="ml-1 text-[#0E6E7E] hover:underline text-xs">{t("change")}</button>
                </p>
              </div>
              <Link
                href={`/${locale}/petitions/new`}
                className="inline-flex items-center gap-2 bg-[#0E6E7E] text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-[#0B5A6A] transition-colors shrink-0"
              >
                <FileText className="w-4 h-4" /> {t("newPetition")}
              </Link>
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {MOCK_STATS.map((stat) => (
                <Link
                  key={stat.label}
                  href={`/${locale}${stat.href}`}
                  className="card flex items-center gap-4 hover:border-[#0E6E7E] hover:shadow-md transition-all group"
                >
                  <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center shrink-0`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-2xl font-bold text-[var(--text-primary)]" style={{ fontFamily: "var(--font-jakarta)" }}>
                      {stat.value}
                    </div>
                    <div className="text-sm text-[var(--text-muted)]">{stat.label}</div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[var(--text-muted)] opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                </Link>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">

                {/* Legal tip */}
                <div className="card">
                  <div className="flex items-center gap-2 mb-4">
                    <Lightbulb className="w-5 h-5 text-[#2ECC71]" />
                    <h2 className="font-bold text-[var(--text-primary)]" style={{ fontFamily: "var(--font-jakarta)" }}>
                      {t("todaysTip")}
                    </h2>
                    <span className="ml-auto text-xs text-[var(--text-muted)] bg-[var(--bg-muted)] px-2 py-0.5 rounded-full">
                      {MOCK_USER.country}
                    </span>
                  </div>
                  <div className="bg-[#E8F4F6] rounded-xl p-4 text-sm text-[#0E6E7E]">
                    <p>
                      In South Korea, foreign workers on an E-9 visa have the same labor rights as Korean citizens.
                      Your employer must provide written notice at least 30 days before termination, or pay 30 days&apos; wages in lieu.
                    </p>
                    <div className="mt-2 text-xs text-[#0E6E7E]/60">
                      {t("poweredBy")} • {t("updatedDaily")}
                    </div>
                  </div>
                  <Link
                    href={`/${locale}/rights`}
                    className="mt-3 flex items-center gap-1.5 text-sm text-[#0E6E7E] hover:underline font-medium"
                  >
                    <Scale className="w-4 h-4" /> {t("checkRights")}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                {/* Recent content */}
                <div className="card">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-bold text-[var(--text-primary)]" style={{ fontFamily: "var(--font-jakarta)" }}>
                      {t("recentContent")}
                    </h2>
                    <Link href={`/${locale}/content`} className="text-sm text-[#0E6E7E] hover:underline flex items-center gap-1">
                      {t("viewAll")} <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                  <div className="space-y-2">
                    {MOCK_CONTENT.map((item) => (
                      <Link
                        key={item.title}
                        href={item.href}
                        className="flex items-start gap-3 p-3 rounded-xl hover:bg-[var(--bg-subtle)] transition-colors"
                      >
                        <div className="w-8 h-8 rounded-lg bg-[var(--bg-muted)] flex items-center justify-center shrink-0 mt-0.5">
                          <BookOpen className="w-4 h-4 text-[var(--text-secondary)]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-[var(--text-primary)] leading-tight">{item.title}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-[var(--text-muted)] capitalize">{item.type}</span>
                            {item.country !== "*" && (
                              <span className="text-xs bg-[var(--bg-muted)] text-[var(--text-muted)] px-2 py-0.5 rounded-full">
                                {item.country}
                              </span>
                            )}
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-[var(--text-muted)] shrink-0 mt-1" />
                      </Link>
                    ))}
                  </div>
                </div>

                {/* News teaser */}
                <div className="card">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Newspaper className="w-5 h-5 text-[#0E6E7E]" />
                      <h2 className="font-bold text-[var(--text-primary)]" style={{ fontFamily: "var(--font-jakarta)" }}>
                        {t("latestNews")}
                      </h2>
                    </div>
                    <Link href={`/${locale}/news`} className="text-sm text-[#0E6E7E] hover:underline flex items-center gap-1">
                      {t("allNews")} <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                  <div className="space-y-2">
                    {[
                      "Korea extends E-9 visa grace period for Uzbek workers",
                      "New labor protection agreement signed between UZ and KR",
                    ].map((headline) => (
                      <Link
                        key={headline}
                        href={`/${locale}/news`}
                        className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-[var(--bg-subtle)] transition-colors"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-[#2ECC71] shrink-0" />
                        <p className="text-sm text-[var(--text-secondary)] flex-1">{headline}</p>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right column */}
              <div className="space-y-4">
                <div className="card">
                  <h2 className="font-bold text-[var(--text-primary)] mb-3" style={{ fontFamily: "var(--font-jakarta)" }}>
                    {t("quickActions")}
                  </h2>
                  <div className="space-y-2">
                    {QUICK_ACTIONS.map((action) => (
                      <Link
                        key={action.label}
                        href={action.href}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                          action.primary
                            ? "bg-[#0E6E7E] text-white hover:bg-[#0B5A6A]"
                            : "bg-[var(--bg-subtle)] text-[var(--text-secondary)] hover:bg-[var(--bg-muted)]"
                        }`}
                      >
                        <action.icon className="w-4 h-4" />
                        {action.label}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Country safety widget */}
                <Link
                  href={`/${locale}/maps/security`}
                  className="card bg-gradient-to-br from-[#0E6E7E] to-[#083D47] text-white block hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold" style={{ fontFamily: "var(--font-jakarta)" }}>
                      {MOCK_USER.country} {MOCK_USER.countryFlag}
                    </h3>
                    <ChevronRight className="w-4 h-4 text-white/50" />
                  </div>
                  <div className="inline-flex items-center gap-1.5 bg-[#2ECC71]/20 text-[#2ECC71] text-xs font-semibold px-2.5 py-1 rounded-full mb-2">
                    <span className="w-1.5 h-1.5 bg-[#2ECC71] rounded-full" />
                    {t("generallySafe")}
                  </div>
                  <p className="text-xs text-white/70 leading-relaxed">
                    Seoul and major cities have active Uzbek communities. Labor law is generally enforced. Carry E-9 permit copy.
                  </p>
                </Link>

                {/* Emergency contacts widget */}
                <div className="card border-[#E74C3C]/20">
                  <h3 className="font-bold text-[var(--text-primary)] mb-3 text-sm" style={{ fontFamily: "var(--font-jakarta)" }}>
                    {t("emergencyContacts")}
                  </h3>
                  <div className="space-y-2 text-xs">
                    <a href="tel:112" className="flex items-center justify-between p-2 bg-red-50 rounded-xl hover:bg-red-100 transition-colors">
                      <span className="text-[#E74C3C] font-semibold">Emergency (Police / Fire / Medical)</span>
                      <span className="font-bold text-[#E74C3C]">112</span>
                    </a>
                    <a href="tel:+82574-6554" className="flex items-center justify-between p-2 bg-[#F7F9FA] rounded-xl hover:bg-[#EEF2F5] transition-colors">
                      <span className="text-[var(--text-secondary)]">Uzbek Embassy Seoul</span>
                      <span className="font-medium text-[#0E6E7E]">+82 2 574-6554</span>
                    </a>
                    <Link href={`/${locale}/emergency`} className="flex items-center justify-center gap-1.5 text-[#0E6E7E] hover:underline mt-1 font-medium">
                      {t("allEmergency")} <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}
