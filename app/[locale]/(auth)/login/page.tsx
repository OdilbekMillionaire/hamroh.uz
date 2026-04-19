"use client";

import { useState } from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Phone, Mail, ArrowRight, Loader2 } from "lucide-react";
import LanguageSwitcher from "@/components/shared/LanguageSwitcher";

export default function LoginPage() {
  const t = useTranslations();
  const locale = useLocale();
  const [method, setMethod] = useState<"phone" | "email">("phone");
  const [step, setStep] = useState<"input" | "otp">("input");
  const [value, setValue] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSend() {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    setStep("otp");
  }

  async function handleVerify() {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    window.location.href = `/${locale}/dashboard`;
  }

  return (
    <div className="min-h-screen bg-[var(--bg-subtle)] flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-[var(--border)] bg-white">
        <Link href={`/${locale}`} className="flex items-center gap-2 font-bold text-[var(--primary)]" style={{ fontFamily: "var(--font-jakarta)" }}>
          <span className="w-7 h-7 rounded-lg bg-[var(--primary)] text-white flex items-center justify-center text-sm font-bold">H</span>
          HamrohUz
        </Link>
        <LanguageSwitcher />
      </div>

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="card w-full max-w-md">
          <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2 text-center" style={{ fontFamily: "var(--font-jakarta)" }}>
            {t("auth.login")}
          </h1>
          <p className="text-[var(--text-muted)] text-sm text-center mb-6">
            Welcome back to HamrohUz
          </p>

          <div className="flex gap-2 mb-6 bg-[var(--bg-subtle)] rounded-xl p-1">
            {(["phone", "email"] as const).map((m) => (
              <button
                key={m}
                onClick={() => { setMethod(m); setStep("input"); setValue(""); }}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all ${
                  method === m ? "bg-white shadow-sm text-[var(--primary)]" : "text-[var(--text-muted)]"
                }`}
              >
                {m === "phone" ? <Phone className="w-4 h-4" /> : <Mail className="w-4 h-4" />}
                {t(`auth.${m}`)}
              </button>
            ))}
          </div>

          {step === "input" ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
                  {t(`auth.${method}`)}
                </label>
                <input
                  type={method === "phone" ? "tel" : "email"}
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder={method === "phone" ? "+998 90 123 45 67" : "email@example.com"}
                  className="w-full px-4 py-3 border border-[var(--border)] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-all"
                />
              </div>
              <button
                onClick={handleSend}
                disabled={!value || loading}
                className="w-full flex items-center justify-center gap-2 btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                {t("auth.sendOtp")}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-[var(--text-secondary)] text-center">
                Code sent to <strong>{value}</strong>
              </p>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.slice(0, 6))}
                placeholder={t("auth.otpPlaceholder")}
                className="w-full px-4 py-3 border border-[var(--border)] rounded-xl text-sm text-center tracking-widest text-xl focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all"
              />
              <button
                onClick={handleVerify}
                disabled={otp.length !== 6 || loading}
                className="w-full flex items-center justify-center gap-2 btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                {t("auth.verifyOtp")}
              </button>
              <button onClick={() => setStep("input")} className="w-full text-sm text-[var(--text-muted)] hover:text-[var(--primary)]">
                {t("common.back")}
              </button>
            </div>
          )}

          <p className="text-center text-sm text-[var(--text-muted)] mt-6">
            {t("auth.noAccount")}{" "}
            <Link href={`/${locale}/register`} className="text-[var(--primary)] font-semibold hover:underline">
              {t("auth.register")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
