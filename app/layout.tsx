import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Nunito } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const nunito = Nunito({
  subsets: ["latin", "cyrillic"],
  variable: "--font-nunito",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const viewport: Viewport = {
  themeColor: "#0E6E7E",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: "HamrohUz — Legal Protection for Uzbeks Abroad",
    template: "%s | HamrohUz",
  },
  description:
    "AI-powered legal assistance, petition tracking, smart maps, and consular support for Uzbek citizens living and working abroad. Powered by Google Gemini AI.",
  keywords: [
    "uzbekistan", "legal help", "migrants rights", "labor rights", "AI legal assistant",
    "petition", "konsullik", "huquqiy yordam", "мигранты", "юридическая помощь",
  ],
  authors: [{ name: "HamrohUz", url: "https://hamroh.uz" }],
  creator: "HamrohUz",
  publisher: "HamrohUz",
  metadataBase: new URL("https://hamroh.uz"),
  alternates: {
    canonical: "/",
    languages: {
      "uz": "/uz",
      "uz-Cyrl": "/uz-cyrl",
      "ru": "/ru",
      "en": "/en",
    },
  },
  openGraph: {
    type: "website",
    siteName: "HamrohUz",
    title: "HamrohUz — Legal Protection for Uzbeks Abroad",
    description:
      "AI-powered legal assistance and petition tracking for Uzbek citizens living and working abroad.",
    locale: "uz_UZ",
    alternateLocale: ["ru_RU", "en_US"],
  },
  twitter: {
    card: "summary_large_image",
    title: "HamrohUz — Legal Protection for Uzbeks Abroad",
    description: "AI-powered legal assistance for Uzbek citizens abroad.",
    creator: "@hamrohuz",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
  manifest: "/manifest.json",
  category: "legal",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uz" className={`${jakarta.variable} ${nunito.variable}`}>
      <body className="min-h-screen bg-[#FFFFFF] antialiased">{children}</body>
    </html>
  );
}
