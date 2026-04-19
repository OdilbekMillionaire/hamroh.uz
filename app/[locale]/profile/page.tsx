import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import Footer from "@/components/layout/Footer";
import { useTranslations } from "next-intl";
import { User, Bell, Globe, FileText, Bookmark, Edit } from "lucide-react";

export default function ProfilePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 min-w-0 p-6">
          <ProfileContent />
        </main>
      </div>
      <Footer />
    </div>
  );
}

function ProfileContent() {
  const t = useTranslations("profile");
  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-6" style={{ fontFamily: "var(--font-jakarta)" }}>
        {t("title")}
      </h1>

      <div className="card mb-6">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-2xl bg-[var(--primary)] flex items-center justify-center text-white text-2xl font-bold shrink-0">
            A
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-bold text-[var(--text-primary)] text-lg">Alisher Karimov</h2>
                <p className="text-[var(--text-muted)] text-sm">+998 90 123 45 67</p>
              </div>
              <button className="flex items-center gap-1.5 text-sm text-[var(--primary)] hover:underline">
                <Edit className="w-3.5 h-3.5" />
                {t("editInfo")}
              </button>
            </div>
            <div className="flex gap-3 mt-3 flex-wrap">
              <div className="flex items-center gap-1.5 text-xs bg-[var(--bg-subtle)] px-3 py-1.5 rounded-full">
                <Globe className="w-3 h-3 text-[var(--text-muted)]" />
                Russia 🇷🇺
              </div>
              <div className="flex items-center gap-1.5 text-xs bg-[var(--primary-light)] text-[var(--primary)] px-3 py-1.5 rounded-full font-medium">
                O&apos;zbek
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {[
          { icon: FileText, label: t("myPetitions"), value: "3 active", color: "bg-blue-50 text-blue-600" },
          { icon: Bookmark, label: t("savedContent"), value: "8 items", color: "bg-purple-50 text-purple-600" },
        ].map((item) => (
          <div key={item.label} className="card flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl ${item.color} flex items-center justify-center`}>
              <item.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm text-[var(--text-muted)]">{item.label}</p>
              <p className="font-semibold text-[var(--text-primary)]">{item.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="card space-y-4">
        <h3 className="font-semibold text-[var(--text-primary)]">{t("notifications")}</h3>
        {[
          { label: "Petition status updates", enabled: true },
          { label: "Legal news for Russia", enabled: true },
          { label: "AI daily tips", enabled: false },
        ].map((item) => (
          <div key={item.label} className="flex items-center justify-between py-2 border-b border-[var(--border)] last:border-0">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-[var(--text-muted)]" />
              <span className="text-sm text-[var(--text-secondary)]">{item.label}</span>
            </div>
            <button className={`relative w-11 h-6 rounded-full transition-colors ${item.enabled ? "bg-[var(--primary)]" : "bg-[var(--bg-muted)]"}`}>
              <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${item.enabled ? "translate-x-5" : "translate-x-0.5"}`} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
