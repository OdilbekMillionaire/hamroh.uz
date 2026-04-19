import { useTranslations } from "next-intl";
import { getLocale } from "next-intl/server";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import Footer from "@/components/layout/Footer";
import { FileText, Bot, BookOpen, Globe, TrendingUp, Clock, Lightbulb } from "lucide-react";
import Link from "next/link";

const mockStats = [
  { label: "Active Petitions", value: "3", icon: FileText, color: "text-[var(--status-new)]", bg: "bg-blue-50" },
  { label: "Resolved", value: "12", icon: TrendingUp, color: "text-[var(--accent)]", bg: "bg-green-50" },
  { label: "Pending Review", value: "1", icon: Clock, color: "text-[var(--status-pending)]", bg: "bg-orange-50" },
];

const mockContent = [
  { title: "Labor Rights in Russia: What You Need to Know", type: "article", country: "RU" },
  { title: "How to Renew Your Uzbek Passport Abroad", type: "guide", country: "*" },
  { title: "Emergency Contacts for Uzbek Citizens in South Korea", type: "news", country: "KR" },
];

export default async function DashboardPage() {
  const locale = await getLocale();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 min-w-0 p-6">
          <div className="max-w-5xl">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-1" style={{ fontFamily: "var(--font-jakarta)" }}>
                Welcome back! 👋
              </h1>
              <p className="text-[var(--text-secondary)] text-sm">Here is your legal status overview</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {mockStats.map((stat) => (
                <div key={stat.label} className="card flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center shrink-0`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-[var(--text-primary)]" style={{ fontFamily: "var(--font-jakarta)" }}>
                      {stat.value}
                    </div>
                    <div className="text-sm text-[var(--text-muted)]">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                <div className="card">
                  <div className="flex items-center gap-2 mb-4">
                    <Lightbulb className="w-5 h-5 text-[var(--accent)]" />
                    <h2 className="font-bold text-[var(--text-primary)]" style={{ fontFamily: "var(--font-jakarta)" }}>
                      Today&apos;s Legal Tip
                    </h2>
                  </div>
                  <div className="bg-[var(--primary-light)] rounded-xl p-4 text-sm text-[var(--primary)]">
                    <p>
                      In Russia, labor contracts must be signed within 3 days of starting work. If your employer
                      hasn&apos;t provided a written contract, you have the right to demand one under Article 67 of
                      the Russian Labor Code.
                    </p>
                    <div className="mt-2 text-xs text-[var(--primary)]/60">
                      Powered by Hamroh AI • Updated daily
                    </div>
                  </div>
                </div>

                <div className="card">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-bold text-[var(--text-primary)]" style={{ fontFamily: "var(--font-jakarta)" }}>
                      Recent Legal Content
                    </h2>
                    <Link href={`/${locale}/content`} className="text-sm text-[var(--primary)] hover:underline">
                      View all
                    </Link>
                  </div>
                  <div className="space-y-3">
                    {mockContent.map((item) => (
                      <div key={item.title} className="flex items-start gap-3 p-3 rounded-xl hover:bg-[var(--bg-subtle)] transition-colors cursor-pointer">
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
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="card">
                  <h2 className="font-bold text-[var(--text-primary)] mb-4" style={{ fontFamily: "var(--font-jakarta)" }}>
                    Quick Actions
                  </h2>
                  <div className="space-y-2">
                    {[
                      { icon: Bot, label: "Ask Hamroh AI", href: `/${locale}/ai-assistant`, primary: true },
                      { icon: FileText, label: "New Petition", href: `/${locale}/petitions/new`, primary: false },
                      { icon: Globe, label: "Check Safety Map", href: `/${locale}/maps/security`, primary: false },
                    ].map((action) => (
                      <Link
                        key={action.label}
                        href={action.href}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                          action.primary
                            ? "bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)]"
                            : "bg-[var(--bg-subtle)] text-[var(--text-secondary)] hover:bg-[var(--bg-muted)]"
                        }`}
                      >
                        <action.icon className="w-4 h-4" />
                        {action.label}
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="card bg-gradient-to-br from-[var(--primary)] to-[var(--primary-hover)] text-white">
                  <h3 className="font-bold mb-2" style={{ fontFamily: "var(--font-jakarta)" }}>Russia 🇷🇺</h3>
                  <div className="inline-flex items-center gap-1.5 bg-[var(--accent)]/20 text-[var(--accent)] text-xs font-semibold px-2.5 py-1 rounded-full mb-2">
                    <span className="w-1.5 h-1.5 bg-[var(--accent)] rounded-full" />
                    Caution
                  </div>
                  <p className="text-xs text-white/70 leading-relaxed">
                    General safety. Labor law enforcement is active. Carry your migration documents at all times.
                  </p>
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
