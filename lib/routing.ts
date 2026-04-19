import { defineRouting } from "next-intl/routing";

export const locales = ["uz", "uz-cyrl", "ru", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "uz";

export const localeNames: Record<Locale, string> = {
  uz: "O'zbek",
  "uz-cyrl": "Ўзбек",
  ru: "Русский",
  en: "English",
};

export const localeFlags: Record<Locale, string> = {
  uz: "🇺🇿",
  "uz-cyrl": "🇺🇿",
  ru: "🇷🇺",
  en: "🇬🇧",
};

export const routing = defineRouting({
  locales,
  defaultLocale,
});
