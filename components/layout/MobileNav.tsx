"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { X, Home, FileText, Bot, BookOpen, Map, Languages, Mic, User, LogOut, Newspaper } from "lucide-react";
import LanguageSwitcher from "@/components/shared/LanguageSwitcher";

const navItems = (locale: string, t: (k: string) => string) => [
  { href: `/${locale}/dashboard`, label: t("nav.home"), icon: Home },
  { href: `/${locale}/petitions`, label: t("nav.petitions"), icon: FileText },
  { href: `/${locale}/ai-assistant`, label: t("nav.aiAssistant"), icon: Bot },
  { href: `/${locale}/content`, label: t("nav.content"), icon: BookOpen },
  { href: `/${locale}/news`, label: t("nav.news"), icon: Newspaper },
  { href: `/${locale}/maps/legal`, label: t("nav.maps"), icon: Map },
  { href: `/${locale}/translator`, label: t("nav.translator"), icon: Languages },
  { href: `/${locale}/voice`, label: t("nav.voice"), icon: Mic },
  { href: `/${locale}/profile`, label: t("nav.profile"), icon: User },
];

export default function MobileNav({ onClose }: { onClose: () => void }) {
  const locale = useLocale();
  const t = useTranslations();

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute right-0 top-0 h-full w-72 bg-white shadow-xl flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-[var(--border)]">
          <span className="font-bold text-lg text-[var(--primary)]" style={{ fontFamily: "var(--font-jakarta)" }}>
            HamrohUz
          </span>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-[var(--bg-subtle)]">
            <X className="w-5 h-5" />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {navItems(locale, t).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[var(--text-secondary)] hover:bg-[var(--primary-light)] hover:text-[var(--primary)] transition-all font-medium"
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-[var(--border)] flex items-center justify-between">
          <LanguageSwitcher mobile />
          <button className="flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--status-danger)] transition-colors">
            <LogOut className="w-4 h-4" />
            {t("nav.logout")}
          </button>
        </div>
      </div>
    </div>
  );
}
