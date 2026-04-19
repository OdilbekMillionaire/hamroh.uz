"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { locales, localeNames, localeFlags, type Locale } from "@/lib/routing";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export default function LanguageSwitcher({ mobile = false }: { mobile?: boolean }) {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  function switchLocale(next: Locale) {
    const segments = pathname.split("/");
    segments[1] = next;
    const newPath = segments.join("/") || "/";
    localStorage.setItem("hamrohuz_locale", next);
    router.push(newPath);
    setOpen(false);
  }

  if (mobile) {
    return (
      <div className="relative">
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-1 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors"
          aria-label="Switch language"
        >
          <span>{localeFlags[locale]}</span>
          <ChevronDown className="w-3 h-3" />
        </button>
        {open && (
          <div className="absolute top-full right-0 mt-1 bg-white rounded-xl shadow-lg border border-[var(--border)] z-50 overflow-hidden min-w-[120px]">
            {locales.map((l) => (
              <button
                key={l}
                onClick={() => switchLocale(l)}
                className={cn(
                  "w-full flex items-center gap-2 px-3 py-2 text-sm transition-colors hover:bg-[var(--bg-subtle)]",
                  l === locale && "bg-[var(--primary-light)] text-[var(--primary)] font-semibold"
                )}
              >
                <span>{localeFlags[l]}</span>
                <span>{localeNames[l]}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)] hover:text-[var(--primary)] transition-all"
      >
        <span>{localeFlags[locale]}</span>
        <span>{localeNames[locale]}</span>
        <ChevronDown className="w-4 h-4" />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute top-full right-0 mt-1 bg-white rounded-xl shadow-lg border border-[var(--border)] z-50 overflow-hidden min-w-[140px]">
            {locales.map((l) => (
              <button
                key={l}
                onClick={() => switchLocale(l)}
                className={cn(
                  "w-full flex items-center gap-2 px-4 py-2.5 text-sm transition-colors hover:bg-[var(--bg-subtle)]",
                  l === locale && "bg-[var(--primary-light)] text-[var(--primary)] font-semibold"
                )}
              >
                <span>{localeFlags[l]}</span>
                <span>{localeNames[l]}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
