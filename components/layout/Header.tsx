"use client";

import { useLocale, useTranslations } from "next-intl";
import { Bell, Menu } from "lucide-react";
import { useState } from "react";
import LanguageSwitcher from "@/components/shared/LanguageSwitcher";
import MobileNav from "./MobileNav";
import Logo from "@/components/shared/Logo";
import Link from "next/link";
import { useAuthUser } from "@/hooks/useAuthUser";
import { useNotifications } from "@/hooks/useNotifications";
import NotificationPanel from "@/components/shared/NotificationPanel";

const NAV_ITEMS = (locale: string, t: (k: string) => string) => [
  { href: `/${locale}/dashboard`, label: t("nav.home") },
  { href: `/${locale}/petitions`, label: t("nav.petitions") },
  { href: `/${locale}/ai-assistant`, label: t("nav.aiAssistant") },
  { href: `/${locale}/news`, label: t("nav.news") },
  { href: `/${locale}/content`, label: t("nav.content") },
  { href: `/${locale}/translator`, label: t("nav.translator") },
];

export default function Header() {
  const locale = useLocale();
  const t = useTranslations();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const { user } = useAuthUser();
  const { notifications, unreadCount, markAllRead, markRead } = useNotifications(user?.uid ?? null);

  return (
    <>
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#D8E2E9] shadow-sm">
        <div className="page-wrapper">
          <div className="flex items-center justify-between h-16">
            <Logo href={`/${locale}`} size="md" />

            <nav className="hidden lg:flex items-center gap-0.5">
              {NAV_ITEMS(locale, t).map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="px-3 py-2 rounded-lg text-sm font-medium text-[#4A6274] hover:text-[#0E6E7E] hover:bg-[#E8F4F6] transition-all"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-2">
              {/* Notification bell */}
              <div className="relative">
                <button
                  onClick={() => setNotifOpen((o) => !o)}
                  className="relative p-2 rounded-xl hover:bg-[#F7F9FA] transition-colors"
                  aria-label="Notifications"
                >
                  <Bell className="w-5 h-5 text-[#4A6274]" />
                  {unreadCount > 0 ? (
                    <span className="absolute top-1 right-1 min-w-[16px] h-4 bg-[#E74C3C] text-white text-[10px] font-bold rounded-full flex items-center justify-center px-0.5 ring-2 ring-white">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  ) : (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#2ECC71] rounded-full ring-2 ring-white" />
                  )}
                </button>

                {notifOpen && (
                  <NotificationPanel
                    notifications={notifications}
                    unreadCount={unreadCount}
                    onClose={() => setNotifOpen(false)}
                    onMarkAllRead={() => void markAllRead()}
                    onMarkRead={(id) => void markRead(id)}
                  />
                )}
              </div>

              <div className="hidden sm:block">
                <LanguageSwitcher />
              </div>
              <button
                className="lg:hidden p-2 rounded-xl hover:bg-[#F7F9FA] transition-colors"
                onClick={() => setMobileOpen(true)}
              >
                <Menu className="w-5 h-5 text-[#4A6274]" />
              </button>
            </div>
          </div>
        </div>
      </header>
      {mobileOpen && <MobileNav onClose={() => setMobileOpen(false)} />}
    </>
  );
}
