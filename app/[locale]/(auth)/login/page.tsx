"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Phone, Mail, ArrowRight, Loader2 } from "lucide-react";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import type { ConfirmationResult } from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import LanguageSwitcher from "@/components/shared/LanguageSwitcher";
import { auth, db } from "@/lib/firebase";

function normalizePhoneNumber(value: string) {
  const phone = value.trim().replace(/[^\d+]/g, "");
  return phone.startsWith("+") ? phone : `+${phone}`;
}

function getAuthErrorMessage(error: unknown) {
  const code =
    typeof error === "object" && error && "code" in error
      ? String((error as { code?: unknown }).code)
      : "";

  if (code === "auth/invalid-phone-number") return "Please enter a valid phone number with country code.";
  if (code === "auth/too-many-requests") return "Too many attempts. Please wait a bit and try again.";
  if (code === "auth/code-expired") return "This code expired. Please request a new one.";
  if (code === "auth/invalid-verification-code") return "The verification code is not correct.";
  if (code === "auth/quota-exceeded") return "SMS quota is exceeded for now. Try a Firebase test number or wait.";

  return "Firebase could not complete this request. Please try again.";
}

export default function LoginPage() {
  const t = useTranslations();
  const locale = useLocale();
  const [method, setMethod] = useState<"phone" | "email">("phone");
  const [step, setStep] = useState<"input" | "otp">("input");
  const [value, setValue] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const recaptchaVerifier = useRef<RecaptchaVerifier | null>(null);

  function getRecaptchaVerifier() {
    if (!recaptchaVerifier.current) {
      recaptchaVerifier.current = new RecaptchaVerifier(auth, "login-recaptcha-container", {
        size: "normal",
      });
    }

    return recaptchaVerifier.current;
  }

  function resetRecaptcha() {
    recaptchaVerifier.current?.clear();
    recaptchaVerifier.current = null;
  }

  async function handleSend() {
    if (method === "email") {
      setError("Email login is not enabled yet. Please use phone login.");
      return;
    }

    setError("");
    setLoading(true);
    try {
      auth.languageCode = locale === "uz-cyrl" ? "uz" : locale;
      const result = await signInWithPhoneNumber(auth, normalizePhoneNumber(value), getRecaptchaVerifier());
      setConfirmationResult(result);
      setStep("otp");
    } catch (err) {
      resetRecaptcha();
      setError(getAuthErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  async function handleVerify() {
    if (!confirmationResult) {
      setError("Please request a verification code first.");
      setStep("input");
      return;
    }

    setError("");
    setLoading(true);
    try {
      const credential = await confirmationResult.confirm(otp);
      await setDoc(
        doc(db, "users", credential.user.uid),
        {
          phoneNumber: credential.user.phoneNumber,
          lastLoginAt: serverTimestamp(),
        },
        { merge: true }
      );
      window.location.href = `/${locale}/dashboard`;
    } catch (err) {
      setError(getAuthErrorMessage(err));
    } finally {
      setLoading(false);
    }
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

          {error && (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

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
              {method === "phone" && <div id="login-recaptcha-container" className="min-h-[78px]" />}
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
              <button
                onClick={() => {
                  resetRecaptcha();
                  setConfirmationResult(null);
                  setStep("input");
                }}
                className="w-full text-sm text-[var(--text-muted)] hover:text-[var(--primary)]"
              >
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
