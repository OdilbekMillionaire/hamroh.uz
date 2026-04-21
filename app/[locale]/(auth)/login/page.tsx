"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { ArrowRight, Loader2 } from "lucide-react";
import { RecaptchaVerifier, signInWithPhoneNumber, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
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

  if (code === "auth/invalid-phone-number") return "Invalid phone number. Use international format, e.g. +998 90 123 45 67";
  if (code === "auth/too-many-requests") return "Too many attempts. Please wait a few minutes and try again.";
  if (code === "auth/code-expired") return "This code has expired. Please request a new one.";
  if (code === "auth/invalid-verification-code") return "Incorrect verification code. Please check and try again.";
  if (code === "auth/quota-exceeded") return "SMS limit reached. Please try again in a few minutes.";
  if (code === "auth/network-request-failed") return "Network error. Please check your connection and try again.";
  if (code === "auth/captcha-check-failed") return "Verification failed. Please refresh the page and try again.";

  return "Could not send SMS. Make sure your number includes the country code (e.g. +998 for Uzbekistan).";
}

export default function LoginPage() {
  const t = useTranslations();
  const locale = useLocale();
  const [step, setStep] = useState<"input" | "otp">("input");
  const [value, setValue] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
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

  async function handleGoogleLogin() {
    setGoogleLoading(true);
    setError("");
    try {
      const provider = new GoogleAuthProvider();
      const credential = await signInWithPopup(auth, provider);
      await setDoc(
        doc(db, "users", credential.user.uid),
        {
          displayName: credential.user.displayName,
          email: credential.user.email,
          lastLoginAt: serverTimestamp(),
        },
        { merge: true }
      );
      window.location.href = `/${locale}/dashboard`;
    } catch (err) {
      setError(getAuthErrorMessage(err));
    } finally {
      setGoogleLoading(false);
    }
  }

  async function handleSend() {
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
            {t("auth.welcomeBack")}
          </p>

          {error && (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {step === "input" ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
                  {t("auth.phone")}
                </label>
                <input
                  type="tel"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder="+998 90 123 45 67"
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
              <div id="login-recaptcha-container" className="min-h-[78px]" />
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-[var(--text-secondary)] text-center">
                {t("auth.codeSentTo")} <strong>{value}</strong>
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

          {/* Divider */}
          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-[var(--border)]" />
            </div>
            <div className="relative flex justify-center text-xs text-[var(--text-muted)]">
              <span className="bg-white px-3">{t("auth.orContinueWith")}</span>
            </div>
          </div>

          {/* Google */}
          <button
            onClick={() => void handleGoogleLogin()}
            disabled={googleLoading || loading}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-[var(--border)] rounded-xl text-sm font-medium text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] disabled:opacity-50 transition-all"
          >
            {googleLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <svg className="w-4 h-4" viewBox="0 0 24 24" aria-hidden="true">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            )}
            {t("auth.google")}
          </button>

          <p className="text-center text-sm text-[var(--text-muted)] mt-5">
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
