"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Phone, ArrowRight, Loader2, Globe } from "lucide-react";
import { RecaptchaVerifier, signInWithPhoneNumber, updateProfile } from "firebase/auth";
import type { ConfirmationResult } from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import LanguageSwitcher from "@/components/shared/LanguageSwitcher";
import { auth, db } from "@/lib/firebase";

const COUNTRIES = [
  "Russia", "South Korea", "Turkey", "UAE", "Germany", "USA",
  "Kazakhstan", "Kyrgyzstan", "Poland", "Czech Republic", "Other",
];

function normalizePhoneNumber(value: string) {
  const normalized = value.trim().replace(/[^\d+]/g, "");
  return normalized.startsWith("+") ? normalized : `+${normalized}`;
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

function isValidInternationalPhone(value: string) {
  const cleaned = value.trim().replace(/\s/g, "");
  return /^\+\d{7,15}$/.test(cleaned);
}

export default function RegisterPage() {
  const t = useTranslations();
  const locale = useLocale();
  const [step, setStep] = useState<"info" | "otp">("info");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [country, setCountry] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const recaptchaVerifier = useRef<RecaptchaVerifier | null>(null);

  function getRecaptchaVerifier() {
    if (!recaptchaVerifier.current) {
      recaptchaVerifier.current = new RecaptchaVerifier(auth, "register-recaptcha-container", {
        size: "normal",
      });
    }

    return recaptchaVerifier.current;
  }

  function resetRecaptcha() {
    recaptchaVerifier.current?.clear();
    recaptchaVerifier.current = null;
  }

  async function handleRegister() {
    setError("");
    if (!isValidInternationalPhone(phone)) {
      setError("Please enter your phone number with country code (e.g. +998 90 123 45 67)");
      return;
    }
    setLoading(true);
    try {
      auth.languageCode = locale === "uz-cyrl" ? "uz" : locale;
      const result = await signInWithPhoneNumber(auth, normalizePhoneNumber(phone), getRecaptchaVerifier());
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
      setStep("info");
      return;
    }

    setError("");
    setLoading(true);
    try {
      const credential = await confirmationResult.confirm(otp);
      await updateProfile(credential.user, { displayName: name });
      await setDoc(
        doc(db, "users", credential.user.uid),
        {
          displayName: name,
          phoneNumber: credential.user.phoneNumber,
          country,
          preferredLocale: locale,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
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
            {t("auth.register")}
          </h1>
          <p className="text-[var(--text-muted)] text-sm text-center mb-6">
            Create your HamrohUz account
          </p>

          {error && (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {step === "info" ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                  className="w-full px-4 py-3 border border-[var(--border)] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">{t("auth.phone")}</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+998 90 123 45 67 (include country code)"
                    className="w-full pl-10 pr-4 py-3 border border-[var(--border)] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
                  <Globe className="inline w-4 h-4 mr-1" />
                  {t("profile.country")}
                </label>
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full px-4 py-3 border border-[var(--border)] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all bg-white"
                >
                  <option value="">Select your country</option>
                  {COUNTRIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <button
                onClick={handleRegister}
                disabled={!name || !phone || !country || loading}
                className="w-full flex items-center justify-center gap-2 btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                {t("auth.sendOtp")}
              </button>
              <div id="register-recaptcha-container" className="min-h-[78px]" />
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-[var(--text-secondary)] text-center">
                Code sent to <strong>{phone}</strong>
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
            </div>
          )}

          <p className="text-center text-sm text-[var(--text-muted)] mt-6">
            {t("auth.haveAccount")}{" "}
            <Link href={`/${locale}/login`} className="text-[var(--primary)] font-semibold hover:underline">
              {t("auth.login")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
