"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import Link from "next/link";
import { Phone, X, AlertTriangle, Shield, ChevronRight } from "lucide-react";

const QUICK_NUMBERS = [
  { label: "Russia", flag: "🇷🇺", tel: "+74951433631" },
  { label: "Korea", flag: "🇰🇷", tel: "+821090866554" },
  { label: "Turkey", flag: "🇹🇷", tel: "+905324410248" },
  { label: "UAE", flag: "🇦🇪", tel: "+97150631750" },
  { label: "Germany", flag: "🇩🇪", tel: "+493039409830" },
  { label: "USA", flag: "🇺🇸", tel: "+12025508881" },
];

export default function EmergencyFAB() {
  const locale = useLocale();
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Panel */}
      {open && (
        <div className="fixed bottom-24 right-4 sm:right-6 z-50 w-72 bg-white rounded-2xl shadow-2xl border border-red-100 overflow-hidden animate-in slide-in-from-bottom-4 duration-200">
          {/* Header */}
          <div className="bg-[#E74C3C] px-4 py-3 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-white animate-pulse shrink-0" />
            <span className="font-bold text-white text-sm">Emergency SOS</span>
            <button
              onClick={() => setOpen(false)}
              className="ml-auto text-white/70 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-4 space-y-3">
            {/* Hotline */}
            <a
              href="tel:+998712001001"
              className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl px-3 py-2.5 hover:bg-red-100 transition-colors"
            >
              <div className="w-8 h-8 bg-[#E74C3C] rounded-lg flex items-center justify-center shrink-0">
                <Phone className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-xs text-[#E74C3C] font-semibold">HamrohUz Hotline</p>
                <p className="text-sm font-bold text-[#1A2733]">+998 71 200-10-01</p>
              </div>
            </a>

            {/* Embassy quick-dial */}
            <div>
              <p className="text-xs font-semibold text-[#4A6274] mb-2 uppercase tracking-wide">Embassy Emergency Lines</p>
              <div className="grid grid-cols-2 gap-1.5">
                {QUICK_NUMBERS.map((n) => (
                  <a
                    key={n.label}
                    href={`tel:${n.tel}`}
                    className="flex items-center gap-1.5 px-2.5 py-2 rounded-xl border border-[#D8E2E9] hover:border-[#E74C3C] hover:bg-red-50 transition-all text-xs font-medium text-[#1A2733]"
                  >
                    <span>{n.flag}</span>
                    {n.label}
                  </a>
                ))}
              </div>
            </div>

            {/* Full page link */}
            <Link
              href={`/${locale}/emergency`}
              onClick={() => setOpen(false)}
              className="flex items-center justify-between w-full px-3 py-2.5 bg-[#0E6E7E] text-white rounded-xl hover:bg-[#0B5A6A] transition-colors text-sm font-semibold"
            >
              <span className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Full Emergency Guide
              </span>
              <ChevronRight className="w-4 h-4 opacity-70" />
            </Link>
          </div>
        </div>
      )}

      {/* FAB */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Emergency SOS"
        className={`fixed bottom-6 right-4 sm:right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-full shadow-lg font-bold text-white text-sm transition-all
          ${open ? "bg-[#C0392B] scale-95" : "bg-[#E74C3C] hover:bg-[#C0392B] hover:scale-105"}
          ring-4 ring-[#E74C3C]/30`}
      >
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white" />
        </span>
        SOS
        {!open && <AlertTriangle className="w-4 h-4" />}
        {open && <X className="w-4 h-4" />}
      </button>
    </>
  );
}
