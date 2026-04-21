"use client";

import { useState } from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Mail, Lock, ArrowRight, Loader2, Globe, Eye, EyeOff, User } from "lucide-react";
import { createUserWithEmailAndPassword, updateProfile, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import LanguageSwitcher from "@/components/shared/LanguageSwitcher";
import { auth, db } from "@/lib/firebase";

const COUNTRIES = [
  "Russia", "South Korea", "Turkey", "UAE", "Germany", "USA",
  "Kazakhstan", "Kyrgyzstan", "Poland", "Czech Republic", "Other",
];

function getAuthErrorMessage(error: unknown) {
  const code =
    typeof error === "object" && error && "code" in error
      ? String((error as { code?: unknown }).code)
      : "";

  if (code === "auth/email-already-in-use")
    return "An account with this email already exists. Try logging in instead.";
  if (code === "auth/weak-password")
    return "Password must be at least 6 characters.";
  if (code === "auth/invalid-email")
    return "Please enter a valid email address.";
  if (code === "auth/too-many-requests")
    return "Too many attempts. Please wait a few minutes and try again.";
  if (code === "auth/network-request-failed")
    return "Network error. Please check your connection and try again.";
  if (code === "auth/popup-closed-by-user")
    return "Google sign-in was cancelled. Please try again.";

  return "Registration failed. Please try again.";
}

export default function RegisterPage() {
  const t = useTranslations();
  const locale = useLocale();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [country, setCountry] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      const credential = await createUserWithEmailAndPassword(auth, email.trim(), password);
      await updateProfile(credential.user, { displayName: name });
      await setDoc(
        doc(db, "users", credential.user.uid),
        {
          displayName: name,
          email: email.trim(),
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

  async function handleGoogleRegister() {
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
      setGoogleLoading(false);
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

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                  required
                  className="w-full pl-10 pr-4 py-3 border border-[var(--border)] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="w-full pl-10 pr-4 py-3 border border-[var(--border)] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  required
                  className="w-full pl-10 pr-10 py-3 border border-[var(--border)] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat your password"
                  required
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
                required
                className="w-full px-4 py-3 border border-[var(--border)] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all bg-white"
              >
                <option value="">Select your current country</option>
                {COUNTRIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={!name || !email || !password || !confirmPassword || !country || loading}
              className="w-full flex items-center justify-center gap-2 btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
              Create Account
            </button>
          </form>

          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-[var(--border)]" />
            </div>
            <div className="relative flex justify-center text-xs text-[var(--text-muted)]">
              <span className="bg-white px-3">{t("auth.orContinueWith")}</span>
            </div>
          </div>

          <button
            onClick={() => void handleGoogleRegister()}
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
