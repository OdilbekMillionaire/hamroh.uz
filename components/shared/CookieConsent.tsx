"use client";

import { useEffect, useState } from "react";
import { Cookie, X, Shield } from "lucide-react";
import Link from "next/link";

const STORAGE_KEY = "hamroh_cookie_consent";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) setVisible(true);
  }, []);

  function accept() {
    localStorage.setItem(STORAGE_KEY, "accepted");
    setVisible(false);
  }

  function decline() {
    localStorage.setItem(STORAGE_KEY, "declined");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[150] p-4 md:p-6">
      <div className="max-w-3xl mx-auto bg-[#1A2733] text-white rounded-2xl shadow-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="w-10 h-10 bg-[#0E6E7E] rounded-xl flex items-center justify-center shrink-0">
          <Cookie className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold mb-1">We use cookies</p>
          <p className="text-xs text-white/60 leading-relaxed">
            We use essential cookies for authentication and optional analytics cookies to improve the platform.
            See our{" "}
            <Link href="/en/privacy" className="underline text-white/80 hover:text-white">
              Privacy Policy
            </Link>{" "}
            for details.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
          <button
            onClick={decline}
            className="flex-1 sm:flex-none px-4 py-2 rounded-xl text-sm font-medium text-white/60 hover:text-white hover:bg-white/10 transition-colors"
          >
            Decline
          </button>
          <button
            onClick={accept}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-5 py-2 rounded-xl text-sm font-semibold bg-[#2ECC71] text-white hover:bg-[#27AE60] transition-colors"
          >
            <Shield className="w-3.5 h-3.5" />
            Accept
          </button>
          <button
            onClick={decline}
            className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4 text-white/40" />
          </button>
        </div>
      </div>
    </div>
  );
}
