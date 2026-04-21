"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import {
  Home, FileText, Bot, BookOpen, Map, Languages,
  Mic, User, LogOut, Shield, Newspaper, Scale,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthUser } from "@/hooks/useAuthUser";
import { useUserProfile } from "@/hooks/useUserProfile";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import Image from "next/image";

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

export default function Sidebar() {
  const locale = useLocale();
  const t = useTranslations();
  const pathname = usePathname();
  const router = useRouter();

  const { user } = useAuthUser();
  const { profile } = useUserProfile(user?.uid ?? null);

  const displayName = profile?.displayName || user?.displayName || user?.email?.split("@")[0] || "—";
  const country = profile?.country ? `${profile.countryFlag ?? ""} ${profile.country}`.trim() : "";
  const initials = displayName !== "—"
    ? displayName.split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase()
    : "?";
  const photoURL = user?.photoURL ?? null;
  const avatarEmoji = profile?.avatarEmoji;
  const activePetitions = profile?.activePetitions ?? 0;

  async function handleLogout() {
    await signOut(auth);
    router.push(`/${locale}/login`);
  }

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
        <button
          onClick={() => void handleLogout()}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[var(--text-muted)] hover:text-[var(--status-danger)] hover:bg-red-50 transition-all"
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {t("nav.logout")}
        </button>
      </div>

      {/* User card — real data */}
      <div className="p-3 border-t border-[var(--border)]">
        <Link
          href={`/${locale}/profile`}
          className="flex items-center gap-3 p-3 rounded-xl hover:bg-[var(--bg-subtle)] transition-all group"
        >
          <div className="w-9 h-9 rounded-full bg-[#0E6E7E] text-white text-sm font-bold flex items-center justify-center shrink-0 overflow-hidden">
            {photoURL ? (
              <Image src={photoURL} alt="avatar" width={36} height={36} className="object-cover w-full h-full" />
            ) : avatarEmoji ? (
              <span className="text-lg">{avatarEmoji}</span>
            ) : (
              initials
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-[var(--text-primary)] truncate">{displayName}</p>
            {country && <p className="text-xs text-[var(--text-muted)] truncate">{country}</p>}
          </div>
          <ChevronRight className="w-4 h-4 text-[var(--text-muted)] opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
        </Link>
        {activePetitions > 0 && (
          <div className="flex items-center justify-between px-3 py-1.5">
            <span className="text-xs text-[var(--text-muted)]">Active petitions</span>
            <span className="text-xs font-bold text-[#0E6E7E] bg-[#E8F4F6] px-2 py-0.5 rounded-full">
              {activePetitions}
            </span>
          </div>
        )}
      </div>
    </aside>
  );
}
