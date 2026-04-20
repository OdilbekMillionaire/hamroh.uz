"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { deleteUser, signOut } from "firebase/auth";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import Footer from "@/components/layout/Footer";
import Breadcrumbs from "@/components/shared/Breadcrumbs";
import { useAuthUser } from "@/hooks/useAuthUser";
import { useUserProfile } from "@/hooks/useUserProfile";
import { auth } from "@/lib/firebase";
import {
  Globe, Bell, Shield, Trash2, LogOut, ChevronRight,
  Moon, Eye, EyeOff, Download, Loader2, CheckCircle, AlertTriangle
} from "lucide-react";
import Link from "next/link";

const LOCALES = [
  { code: "uz", label: "O'zbek", flag: "🇺🇿" },
  { code: "uz-cyrl", label: "Ўзбек", flag: "🇺🇿" },
  { code: "ru", label: "Русский", flag: "🇷🇺" },
  { code: "en", label: "English", flag: "🇬🇧" },
];

export default function SettingsPage() {
  const locale = useLocale();
  const t = useTranslations("settings");
  const tCommon = useTranslations("common");
  const router = useRouter();
  const { user } = useAuthUser();
  const { profile, save } = useUserProfile(user?.uid ?? null);

  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [saved, setSaved] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [dataPrivacy, setDataPrivacy] = useState(true);

  async function handleLocaleChange(newLocale: string) {
    await save?.({ preferredLocale: newLocale });
    setSaved("language");
    setTimeout(() => setSaved(""), 2000);
    router.push(`/${newLocale}/settings`);
  }

  async function toggleNotification(key: keyof NonNullable<typeof profile>["notifications"]) {
    if (!profile) return;
    await save({ notifications: { ...profile.notifications, [key]: !profile.notifications[key] } });
    setSaved("notifications");
    setTimeout(() => setSaved(""), 2000);
  }

  async function handleDeleteAccount() {
    if (!user) return;
    setDeleting(true);
    try {
      await deleteUser(user);
      router.push(`/${locale}`);
    } catch {
      alert("Please log out and log back in before deleting your account (for security).");
    } finally {
      setDeleting(false);
      setConfirmDelete(false);
    }
  }

  function exportData() {
    const data = {
      profile: { displayName: profile?.displayName, email: profile?.email, country: profile?.country, preferredLocale: profile?.preferredLocale },
      exportedAt: new Date().toISOString(),
      note: "This is all personal data stored by HamrohUz for your account.",
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `hamrohuz-data-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function ToggleSwitch({ on, onToggle }: { on: boolean; onToggle: () => void }) {
    return (
      <button onClick={onToggle} className={`relative w-11 h-6 rounded-full transition-colors ${on ? "bg-[#0E6E7E]" : "bg-[var(--bg-muted)]"}`}>
        <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${on ? "translate-x-5" : "translate-x-0.5"}`} />
      </button>
    );
  }

  function SavedBadge({ section }: { section: string }) {
    return saved === section ? (
      <span className="flex items-center gap-1 text-xs text-[#2ECC71]"><CheckCircle className="w-3 h-3" /> {t("saved")}</span>
    ) : null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 min-w-0 p-6">
          <div className="max-w-2xl">
            <Breadcrumbs items={[{ label: "Settings" }]} className="mb-4" />
            <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-6" style={{ fontFamily: "var(--font-jakarta)" }}>
              {t("title")}
            </h1>

            {/* Language */}
            <div className="card mb-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-[#0E6E7E]" />
                  <h3 className="font-bold text-[var(--text-primary)]">{t("language")}</h3>
                </div>
                <SavedBadge section="language" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                {LOCALES.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => void handleLocaleChange(l.code)}
                    className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all ${locale === l.code ? "border-[#0E6E7E] bg-[#E8F4F6] text-[#0E6E7E]" : "border-[var(--border)] hover:border-[#0E6E7E]/40 text-[var(--text-secondary)]"}`}
                  >
                    <span className="text-base">{l.flag}</span>
                    {l.label}
                    {locale === l.code && <CheckCircle className="w-4 h-4 ml-auto text-[#0E6E7E]" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Notifications */}
            <div className="card mb-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-[#0E6E7E]" />
                  <h3 className="font-bold text-[var(--text-primary)]">{t("notifications")}</h3>
                </div>
                <SavedBadge section="notifications" />
              </div>
              {([
                { key: "petitionUpdates" as const, label: t("notif.petitionUpdates"), desc: t("notif.petitionUpdatesDesc") },
                { key: "legalNews" as const, label: t("notif.legalNews"), desc: t("notif.legalNewsDesc") },
                { key: "aiTips" as const, label: t("notif.aiTips"), desc: t("notif.aiTipsDesc") },
                { key: "emergencyAlerts" as const, label: t("notif.emergencyAlerts"), desc: t("notif.emergencyAlertsDesc") },
              ] as const).map((item) => (
                <div key={item.key} className="flex items-center justify-between py-3 border-b border-[var(--border)] last:border-0 gap-4">
                  <div>
                    <p className="text-sm font-medium text-[var(--text-primary)]">{item.label}</p>
                    <p className="text-xs text-[var(--text-muted)]">{item.desc}</p>
                  </div>
                  <ToggleSwitch on={profile?.notifications[item.key] ?? false} onToggle={() => void toggleNotification(item.key)} />
                </div>
              ))}
            </div>

            {/* Appearance */}
            <div className="card mb-5">
              <div className="flex items-center gap-2 mb-4">
                <Moon className="w-4 h-4 text-[#0E6E7E]" />
                <h3 className="font-bold text-[var(--text-primary)]">{t("appearance")}</h3>
                <span className="text-xs text-[var(--text-muted)] bg-[var(--bg-muted)] px-2 py-0.5 rounded-full ml-auto">{t("comingSoon")}</span>
              </div>
              <div className="flex items-center justify-between py-2 opacity-60">
                <div>
                  <p className="text-sm font-medium text-[var(--text-primary)]">{t("darkMode")}</p>
                  <p className="text-xs text-[var(--text-muted)]">{t("darkModeDesc")}</p>
                </div>
                <ToggleSwitch on={darkMode} onToggle={() => setDarkMode(!darkMode)} />
              </div>
            </div>

            {/* Privacy */}
            <div className="card mb-5">
              <div className="flex items-center gap-2 mb-4">
                <Shield className="w-4 h-4 text-[#0E6E7E]" />
                <h3 className="font-bold text-[var(--text-primary)]">{t("privacy")}</h3>
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between py-3 border-b border-[var(--border)]">
                  <div>
                    <p className="text-sm font-medium text-[var(--text-primary)]">{t("analyticsCookies")}</p>
                    <p className="text-xs text-[var(--text-muted)]">{t("analyticsCookiesDesc")}</p>
                  </div>
                  <ToggleSwitch on={dataPrivacy} onToggle={() => setDataPrivacy(!dataPrivacy)} />
                </div>
                <Link href={`/${locale}/privacy`} className="flex items-center justify-between px-1 py-3 border-b border-[var(--border)] hover:text-[#0E6E7E] transition-colors">
                  <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                    <Eye className="w-4 h-4 text-[var(--text-muted)]" /> {t("privacyPolicy")}
                  </div>
                  <ChevronRight className="w-4 h-4 text-[var(--text-muted)]" />
                </Link>
                <Link href={`/${locale}/terms`} className="flex items-center justify-between px-1 py-3 hover:text-[#0E6E7E] transition-colors">
                  <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                    <EyeOff className="w-4 h-4 text-[var(--text-muted)]" /> {t("termsOfService")}
                  </div>
                  <ChevronRight className="w-4 h-4 text-[var(--text-muted)]" />
                </Link>
              </div>
            </div>

            {/* Data */}
            <div className="card mb-5">
              <h3 className="font-bold text-[var(--text-primary)] mb-4">{t("yourData")}</h3>
              <div className="space-y-3">
                <button
                  onClick={exportData}
                  className="w-full flex items-center gap-3 px-4 py-3 border border-[var(--border)] rounded-xl text-sm font-medium text-[var(--text-secondary)] hover:border-[#0E6E7E] hover:text-[#0E6E7E] transition-all"
                >
                  <Download className="w-4 h-4" /> {t("downloadData")}
                </button>
                <button
                  onClick={() => void signOut(auth).then(() => router.push(`/${locale}/login`))}
                  className="w-full flex items-center gap-3 px-4 py-3 border border-[var(--border)] rounded-xl text-sm font-medium text-[var(--text-muted)] hover:text-[#E74C3C] hover:border-red-200 transition-all"
                >
                  <LogOut className="w-4 h-4" /> {t("signOutAll")}
                </button>
              </div>
            </div>

            {/* Danger zone */}
            <div className="card border-red-200 bg-red-50/40">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-4 h-4 text-[#E74C3C]" />
                <h3 className="font-bold text-[#E74C3C]">{t("dangerZone")}</h3>
              </div>
              <p className="text-sm text-[var(--text-muted)] mb-4">{t("dangerDesc")}</p>
              {!confirmDelete ? (
                <button
                  onClick={() => setConfirmDelete(true)}
                  className="flex items-center gap-2 px-4 py-2.5 border-2 border-red-300 text-[#E74C3C] rounded-xl text-sm font-semibold hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="w-4 h-4" /> {t("deleteAccount")}
                </button>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm font-semibold text-[#E74C3C]">{t("confirmDelete")}</p>
                  <div className="flex gap-2">
                    <button onClick={() => setConfirmDelete(false)} className="px-4 py-2 border border-[var(--border)] rounded-xl text-sm font-medium hover:bg-white transition-colors">
                      {tCommon("cancel")}
                    </button>
                    <button onClick={handleDeleteAccount} disabled={deleting} className="flex items-center gap-2 px-4 py-2 bg-[#E74C3C] text-white rounded-xl text-sm font-semibold hover:bg-red-600 disabled:opacity-60 transition-colors">
                      {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                      {t("confirmDeleteBtn")}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}
