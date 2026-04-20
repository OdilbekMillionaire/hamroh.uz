"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import {
  Home, FileText, Bot, BookOpen, Map, Languages,
  Mic, User, LogOut, Shield, Newspaper, Scale,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = (locale: string, t: (k: string) => string) => [
  { href: `/${locale}/dashboard`, label: t("nav.home"), icon: Home },
  { href: `/${locale}/petitions`, label: t("nav.petitions"), icon: FileText },
  { href: `/${locale}/ai-assistant`, label: t("nav.aiAssistant"), icon: Bot },
  { href: `/${locale}/rights`, label: "Rights Checker", icon: Scale },
  { href: `/${locale}/content`, label: t("nav.content"), icon: BookOpen },
  { href: `/${locale}/news`, label: t("nav.news"), icon: Newspaper },
  { href: `/${locale}/maps/legal`, label: t("nav.maps"), icon: Map },
  { href: `/${locale}/translator`, label: t("nav.translator"), icon: Languages },
  { href: `/${locale}/voice`, label: t("nav.voice"), icon: Mic },
];

// Mock user — replace with real auth context when Firebase is configured
const MOCK_USER = {
  name: "Dilshod Yusupov",
  country: "South Korea 🇰🇷",
  initials: "DY",
  petitions: 3,
};

export default function Sidebar() {
  const locale = useLocale();
  const t = useTranslations();
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex flex-col w-60 shrink-0 bg-white border-r border-[var(--border)] min-h-screen sticky top-16 h-[calc(100vh-4rem)]">
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems(locale, t).map((item) => {
          const active = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                active
                  ? "sidebar-active"
                  : "text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)] hover:text-[var(--text-primary)]"
              )}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Secondary nav */}
      <div className="p-3 border-t border-[var(--border)] space-y-1">
        <Link
          href={`/${locale}/maps/security`}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)] transition-all"
        >
          <Shield className="w-5 h-5 shrink-0" />
          Security Map
        </Link>
        <Link
          href={`/${locale}/profile`}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)] transition-all"
        >
          <User className="w-5 h-5 shrink-0" />
          {t("nav.profile")}
        </Link>
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[var(--text-muted)] hover:text-[var(--status-danger)] hover:bg-red-50 transition-all">
          <LogOut className="w-5 h-5 shrink-0" />
          {t("nav.logout")}
        </button>
      </div>

      {/* User avatar card */}
      <div className="p-3 border-t border-[var(--border)]">
        <Link
          href={`/${locale}/profile`}
          className="flex items-center gap-3 p-3 rounded-xl hover:bg-[var(--bg-subtle)] transition-all group"
        >
          <div className="w-9 h-9 rounded-full bg-[#0E6E7E] text-white text-sm font-bold flex items-center justify-center shrink-0">
            {MOCK_USER.initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-[var(--text-primary)] truncate">{MOCK_USER.name}</p>
            <p className="text-xs text-[var(--text-muted)] truncate">{MOCK_USER.country}</p>
          </div>
          <ChevronRight className="w-4 h-4 text-[var(--text-muted)] opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
        </Link>
        <div className="flex items-center justify-between px-3 py-1.5">
          <span className="text-xs text-[var(--text-muted)]">Active petitions</span>
          <span className="text-xs font-bold text-[#0E6E7E] bg-[#E8F4F6] px-2 py-0.5 rounded-full">
            {MOCK_USER.petitions}
          </span>
        </div>
      </div>
    </aside>
  );
}
