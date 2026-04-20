import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { LogoIcon } from "@/components/shared/Logo";
import { Search, Home, FileText, Bot } from "lucide-react";

const QUICK_LINKS = [
  { href: "/uz/dashboard", icon: Home, label: "Dashboard" },
  { href: "/uz/petitions", icon: FileText, label: "My Petitions" },
  { href: "/uz/ai-assistant", icon: Bot, label: "Hamroh AI" },
];

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center py-20">
        <div className="page-wrapper max-w-lg mx-auto text-center">
          <div className="flex justify-center mb-6">
            <LogoIcon size={56} />
          </div>

          <div className="mb-2">
            <span className="inline-block text-8xl font-extrabold text-[#E8F4F6] select-none" style={{ fontFamily: "var(--font-jakarta)" }}>
              404
            </span>
          </div>

          <h1 className="text-2xl font-bold text-[#1A2733] mb-3" style={{ fontFamily: "var(--font-jakarta)" }}>
            Page not found
          </h1>
          <p className="text-[#4A6274] text-sm leading-relaxed mb-8">
            The page you are looking for doesn&apos;t exist or has been moved.
            Try searching for what you need, or navigate to one of the links below.
          </p>

          {/* Search hint */}
          <div className="flex items-center gap-2 bg-[#F7F9FA] border border-[#D8E2E9] rounded-xl px-4 py-3 mb-8 text-left">
            <Search className="w-4 h-4 text-[#8FA5B5] shrink-0" />
            <span className="text-sm text-[#8FA5B5]">Try navigating to one of the pages below</span>
          </div>

          {/* Quick links */}
          <div className="grid grid-cols-3 gap-3 mb-8">
            {QUICK_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex flex-col items-center gap-2 p-4 card hover:border-[#0E6E7E] hover:text-[#0E6E7E] transition-all"
              >
                <link.icon className="w-5 h-5" />
                <span className="text-xs font-semibold">{link.label}</span>
              </Link>
            ))}
          </div>

          <Link
            href="/uz"
            className="inline-flex items-center gap-2 bg-[#0E6E7E] text-white font-semibold px-8 py-3 rounded-xl hover:bg-[#0B5A6A] transition-colors"
          >
            <Home className="w-4 h-4" /> Go to Homepage
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
