"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { signOut, updateProfile } from "firebase/auth";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import Footer from "@/components/layout/Footer";
import { useAuthUser } from "@/hooks/useAuthUser";
import { useUserProfile } from "@/hooks/useUserProfile";
import { auth } from "@/lib/firebase";
import {
  Bell, FileText, Bookmark, Edit, Save, LogOut,
  Loader2, CheckCircle, Shield, Settings, ChevronRight,
  Phone, Mail, MapPin, Camera
} from "lucide-react";
import Link from "next/link";

const COUNTRIES = [
  { name: "Russia", flag: "🇷🇺" }, { name: "South Korea", flag: "🇰🇷" },
  { name: "Turkey", flag: "🇹🇷" }, { name: "UAE", flag: "🇦🇪" },
  { name: "Germany", flag: "🇩🇪" }, { name: "USA", flag: "🇺🇸" },
  { name: "Kazakhstan", flag: "🇰🇿" }, { name: "UK", flag: "🇬🇧" },
  { name: "France", flag: "🇫🇷" }, { name: "Poland", flag: "🇵🇱" },
  { name: "Other", flag: "🌍" },
];

export default function ProfilePage() {
  const locale = useLocale();
  const t = useTranslations("profile");
  const router = useRouter();
  const { user, loading: authLoading } = useAuthUser();
  const { profile, loading: profileLoading, save } = useUserProfile(user?.uid ?? null);

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({ displayName: "", country: "", countryFlag: "", email: "" });

  function startEdit() {
    setForm({
      displayName: profile?.displayName || user?.displayName || "",
      country: profile?.country || "",
      countryFlag: profile?.countryFlag || "🌍",
      email: profile?.email || user?.email || "",
    });
    setEditing(true);
  }

  async function handleSave() {
    setSaving(true);
    try {
      if (user && form.displayName && form.displayName !== user.displayName) {
        await updateProfile(user, { displayName: form.displayName });
      }
      await save({ displayName: form.displayName, country: form.country, countryFlag: form.countryFlag, email: form.email });
      setSaved(true);
      setEditing(false);
      setTimeout(() => setSaved(false), 3000);
    } catch { /* silent */ }
    finally { setSaving(false); }
  }

  async function handleLogout() {
    await signOut(auth);
    router.push(`/${locale}/login`);
  }

  async function toggleNotification(key: keyof NonNullable<typeof profile>["notifications"]) {
    if (!profile) return;
    await save({ notifications: { ...profile.notifications, [key]: !profile.notifications[key] } });
  }

  const loading = authLoading || profileLoading;
  const displayName = profile?.displayName || user?.displayName || "—";
  const phone = profile?.phone || user?.phoneNumber || "—";
  const email = profile?.email || user?.email || "—";
  const country = profile?.country || "—";
  const countryFlag = profile?.countryFlag || "🌍";
  const initials = displayName !== "—" ? displayName.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase() : "?";

  if (loading) return (
    <div className="min-h-screen flex flex-col"><Header />
      <div className="flex flex-1"><Sidebar />
        <main className="flex-1 flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin text-[#0E6E7E]" /></main>
      </div>
    </div>
  );

  if (!user) return (
    <div className="min-h-screen flex flex-col"><Header />
      <main className="flex-1 flex items-center justify-center p-8 text-center">
        <div>
          <Shield className="w-12 h-12 mx-auto mb-4 text-[var(--text-muted)]" />
          <h2 className="text-xl font-bold text-[var(--text-primary)] mb-2">Login required</h2>
          <p className="text-[var(--text-muted)] text-sm mb-6">Please log in to view your profile.</p>
          <Link href={`/${locale}/login`} className="inline-block bg-[#0E6E7E] text-white font-semibold px-6 py-3 rounded-xl hover:bg-[#0B5A6A] transition-colors">Log in</Link>
        </div>
      </main>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 min-w-0 p-6">
          <div className="max-w-2xl">

            {saved && (
              <div className="mb-4 flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-xl">
                <CheckCircle className="w-4 h-4 shrink-0" /> Profile saved successfully.
              </div>
            )}

            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-[var(--text-primary)]" style={{ fontFamily: "var(--font-jakarta)" }}>{t("title")}</h1>
              <div className="flex gap-2">
                {editing ? (
                  <>
                    <button onClick={() => setEditing(false)} className="px-4 py-2 text-sm font-medium border border-[var(--border)] rounded-xl hover:bg-[var(--bg-subtle)] transition-colors">Cancel</button>
                    <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-4 py-2 bg-[#0E6E7E] text-white text-sm font-semibold rounded-xl hover:bg-[#0B5A6A] disabled:opacity-60 transition-colors">
                      {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save
                    </button>
                  </>
                ) : (
                  <button onClick={startEdit} className="flex items-center gap-2 px-4 py-2 border border-[var(--border)] text-sm font-medium rounded-xl hover:border-[#0E6E7E] hover:text-[#0E6E7E] transition-colors">
                    <Edit className="w-3.5 h-3.5" /> {t("editInfo")}
                  </button>
                )}
              </div>
            </div>

            {/* Avatar card */}
            <div className="card mb-5">
              <div className="flex items-start gap-4">
                <div className="relative shrink-0">
                  <div className="w-16 h-16 rounded-2xl bg-[#0E6E7E] flex items-center justify-center text-white text-2xl font-bold">{initials}</div>
                  <button className="absolute -bottom-1 -right-1 w-6 h-6 bg-white border-2 border-[var(--border)] rounded-full flex items-center justify-center hover:border-[#0E6E7E] transition-colors">
                    <Camera className="w-3 h-3 text-[var(--text-muted)]" />
                  </button>
                </div>

                {editing ? (
                  <div className="flex-1 space-y-3">
                    <input value={form.displayName} onChange={(e) => setForm({ ...form, displayName: e.target.value })} placeholder="Full name" className="w-full px-3 py-2 border border-[var(--border)] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0E6E7E]" />
                    <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} type="email" placeholder="Email" className="w-full px-3 py-2 border border-[var(--border)] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0E6E7E]" />
                    <div>
                      <p className="text-xs font-medium text-[var(--text-muted)] mb-2">Current Country</p>
                      <div className="flex flex-wrap gap-1.5">
                        {COUNTRIES.map((c) => (
                          <button key={c.name} type="button" onClick={() => setForm({ ...form, country: c.name, countryFlag: c.flag })}
                            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium border-2 transition-all ${form.country === c.name ? "border-[#0E6E7E] bg-[#E8F4F6] text-[#0E6E7E]" : "border-[var(--border)] hover:border-[#0E6E7E]/40"}`}>
                            {c.flag} {c.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex-1">
                    <h2 className="font-bold text-[var(--text-primary)] text-lg">{displayName}</h2>
                    <div className="space-y-1.5 mt-2">
                      {phone !== "—" && <p className="flex items-center gap-1.5 text-sm text-[var(--text-muted)]"><Phone className="w-3.5 h-3.5" /> {phone}</p>}
                      {email !== "—" && <p className="flex items-center gap-1.5 text-sm text-[var(--text-muted)]"><Mail className="w-3.5 h-3.5" /> {email}</p>}
                      <p className="flex items-center gap-1.5 text-sm text-[var(--text-muted)]"><MapPin className="w-3.5 h-3.5" /> {countryFlag} {country}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 mb-5">
              {[
                { icon: FileText, label: t("myPetitions"), value: profile?.activePetitions ?? 0, color: "bg-blue-50 text-blue-600", href: `/${locale}/petitions` },
                { icon: CheckCircle, label: "Resolved", value: profile?.resolvedPetitions ?? 0, color: "bg-green-50 text-green-600", href: `/${locale}/petitions?status=resolved` },
                { icon: Bookmark, label: t("savedContent"), value: profile?.savedContent ?? 0, color: "bg-purple-50 text-purple-600", href: `/${locale}/content` },
              ].map((item) => (
                <Link key={item.label} href={item.href} className="card flex flex-col items-center gap-2 py-4 hover:border-[#0E6E7E] hover:shadow-md transition-all text-center">
                  <div className={`w-9 h-9 rounded-xl ${item.color} flex items-center justify-center`}><item.icon className="w-4 h-4" /></div>
                  <div className="text-xl font-bold text-[var(--text-primary)]">{item.value}</div>
                  <div className="text-xs text-[var(--text-muted)] leading-tight">{item.label}</div>
                </Link>
              ))}
            </div>

            {/* Notifications */}
            <div className="card mb-5">
              <h3 className="font-bold text-[var(--text-primary)] mb-4" style={{ fontFamily: "var(--font-jakarta)" }}>{t("notifications")}</h3>
              {([
                { key: "petitionUpdates" as const, label: "Petition status updates" },
                { key: "legalNews" as const, label: `Legal news (${country === "—" ? "your country" : country})` },
                { key: "aiTips" as const, label: "Daily AI legal tips" },
                { key: "emergencyAlerts" as const, label: "Emergency safety alerts" },
              ] as const).map((item) => (
                <div key={item.key} className="flex items-center justify-between py-3 border-b border-[var(--border)] last:border-0">
                  <div className="flex items-center gap-2"><Bell className="w-4 h-4 text-[var(--text-muted)]" /><span className="text-sm text-[var(--text-secondary)]">{item.label}</span></div>
                  <button onClick={() => void toggleNotification(item.key)} className={`relative w-11 h-6 rounded-full transition-colors ${profile?.notifications[item.key] ? "bg-[#0E6E7E]" : "bg-[var(--bg-muted)]"}`}>
                    <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${profile?.notifications[item.key] ? "translate-x-5" : "translate-x-0.5"}`} />
                  </button>
                </div>
              ))}
            </div>

            {/* Account actions */}
            <div className="card mb-5">
              <h3 className="font-bold text-[var(--text-primary)] mb-3" style={{ fontFamily: "var(--font-jakarta)" }}>Account</h3>
              <div className="space-y-1">
                <Link href={`/${locale}/settings`} className="flex items-center justify-between px-3 py-3 rounded-xl hover:bg-[var(--bg-subtle)] transition-colors">
                  <span className="flex items-center gap-3 text-sm text-[var(--text-secondary)]"><Settings className="w-4 h-4 text-[var(--text-muted)]" /> Settings & Privacy</span>
                  <ChevronRight className="w-4 h-4 text-[var(--text-muted)]" />
                </Link>
                <Link href={`/${locale}/emergency`} className="flex items-center justify-between px-3 py-3 rounded-xl hover:bg-[var(--bg-subtle)] transition-colors">
                  <span className="flex items-center gap-3 text-sm text-[var(--text-secondary)]"><Shield className="w-4 h-4 text-[var(--text-muted)]" /> Emergency Contacts</span>
                  <ChevronRight className="w-4 h-4 text-[var(--text-muted)]" />
                </Link>
                <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-red-50 text-sm text-[var(--text-muted)] hover:text-[#E74C3C] transition-colors">
                  <LogOut className="w-4 h-4" /> Sign out
                </button>
              </div>
            </div>

            <p className="text-xs text-[var(--text-muted)] text-center">
              Member since {user.metadata.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString() : "—"}
            </p>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}
