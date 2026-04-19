import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import LanguageSwitcher from "@/components/shared/LanguageSwitcher";
import Logo from "@/components/shared/Logo";
import { Shield, ExternalLink, Phone, Mail, MapPin } from "lucide-react";

export default function Footer() {
  const locale = useLocale();
  const t = useTranslations();

  const links = {
    platform: [
      { label: t("nav.aiAssistant"), href: `/${locale}/ai-assistant` },
      { label: t("nav.petitions"), href: `/${locale}/petitions` },
      { label: t("nav.news"), href: `/${locale}/news` },
      { label: t("nav.content"), href: `/${locale}/content` },
      { label: t("nav.translator"), href: `/${locale}/translator` },
      { label: t("nav.maps"), href: `/${locale}/maps/legal` },
    ],
    support: [
      { label: "About HamrohUz", href: `/${locale}/about` },
      { label: "FAQ", href: `/${locale}/faq` },
      { label: "Emergency SOS", href: `/${locale}/emergency` },
      { label: "Contact Us", href: `/${locale}/contact` },
      { label: "Rights Checker", href: `/${locale}/rights` },
    ],
    legal: [
      { label: "Privacy Policy", href: `/${locale}/privacy` },
      { label: "Terms of Service", href: `/${locale}/terms` },
      { label: "Data Protection", href: `/${locale}/privacy` },
      { label: "Cookie Policy", href: `/${locale}/privacy` },
    ],
    partners: [
      { label: "Bar Association of Uzbekistan", href: "#", external: true },
      { label: "IOM Uzbekistan", href: "#", external: true },
      { label: "UN Human Rights", href: "#", external: true },
      { label: "Overseas Uzbeks Agency", href: "#", external: true },
    ],
  };

  const countries = ["🇷🇺 Russia", "🇰🇷 Korea", "🇹🇷 Turkey", "🇦🇪 UAE", "🇩🇪 Germany", "🇺🇸 USA"];

  return (
    <footer className="bg-[#1A2733] text-white mt-auto">
      {/* Emergency bar */}
      <div className="bg-[#E74C3C]/10 border-b border-white/10">
        <div className="page-wrapper py-3 flex flex-wrap items-center gap-4 justify-between">
          <div className="flex items-center gap-2 text-sm">
            <Shield className="w-4 h-4 text-[#E74C3C] shrink-0" />
            <span className="text-white/70 text-xs">Emergency legal help:</span>
            <a href={`/${locale}/emergency`} className="text-[#2ECC71] font-semibold text-xs hover:underline">
              Open Emergency SOS →
            </a>
          </div>
          <div className="flex items-center gap-4 text-xs text-white/50">
            <span className="flex items-center gap-1">
              <Phone className="w-3 h-3" />
              Hotline: +998 71 200-10-01
            </span>
            <span className="flex items-center gap-1">
              <Mail className="w-3 h-3" />
              help@hamroh.uz
            </span>
          </div>
        </div>
      </div>

      {/* Main footer columns */}
      <div className="page-wrapper py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand column */}
          <div className="lg:col-span-1">
            <Logo variant="white" size="md" className="mb-4" />
            <p className="text-white/50 text-xs leading-relaxed mb-4">
              AI-powered legal protection for Uzbek citizens living and working abroad.
            </p>
            <div className="flex flex-wrap gap-1 mb-4">
              {countries.map((c) => (
                <span key={c} className="text-xs bg-white/10 px-2 py-0.5 rounded-full text-white/60">
                  {c}
                </span>
              ))}
            </div>
            <div className="flex gap-3 mt-4">
              {/* Social icons */}
              {[
                { label: "Telegram", path: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8l-1.74 8.2c-.13.58-.5.72-.99.45l-2.76-2.03-1.33 1.28c-.15.15-.27.27-.56.27l.2-2.84 5.12-4.63c.22-.2-.05-.3-.34-.1l-6.33 3.99-2.73-.85c-.59-.19-.6-.59.13-.87l10.68-4.12c.49-.18.92.12.65.25z" },
                { label: "Instagram", path: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" },
                { label: "YouTube", path: "M23.495 6.205a3.007 3.007 0 0 0-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 0 0 .527 6.205a31.247 31.247 0 0 0-.522 5.805 31.247 31.247 0 0 0 .522 5.783 3.007 3.007 0 0 0 2.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 0 0 2.088-2.088 31.247 31.247 0 0 0 .5-5.783 31.247 31.247 0 0 0-.5-5.805zM9.609 15.601V8.408l6.264 3.602z" },
              ].map((social) => (
                <button
                  key={social.label}
                  className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                  aria-label={social.label}
                >
                  <svg className="w-4 h-4 fill-white/70" viewBox="0 0 24 24">
                    <path d={social.path} />
                  </svg>
                </button>
              ))}
            </div>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-white text-sm font-semibold mb-4 uppercase tracking-wide">Platform</h4>
            <ul className="space-y-2.5">
              {links.platform.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-white/50 hover:text-white text-sm transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white text-sm font-semibold mb-4 uppercase tracking-wide">Support</h4>
            <ul className="space-y-2.5">
              {links.support.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-white/50 hover:text-white text-sm transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Partners */}
          <div>
            <h4 className="text-white text-sm font-semibold mb-4 uppercase tracking-wide">Partners</h4>
            <ul className="space-y-2.5">
              {links.partners.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/50 hover:text-white text-sm transition-colors flex items-center gap-1"
                  >
                    {l.label}
                    <ExternalLink className="w-3 h-3 opacity-50" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal + Language */}
          <div>
            <h4 className="text-white text-sm font-semibold mb-4 uppercase tracking-wide">Legal</h4>
            <ul className="space-y-2.5 mb-6">
              {links.legal.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-white/50 hover:text-white text-sm transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
            <h4 className="text-white text-sm font-semibold mb-3 uppercase tracking-wide">Language</h4>
            <LanguageSwitcher />
          </div>
        </div>
      </div>

      {/* Legal basis banner */}
      <div className="border-t border-white/10">
        <div className="page-wrapper py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 justify-between">
            <div className="text-xs text-white/30 flex flex-wrap gap-3">
              <span>Constitution of Uzbekistan, Art. 23</span>
              <span>·</span>
              <span>Presidential Directive on Diaspora Support (Jan 2026)</span>
              <span>·</span>
              <span>SDG 8 · SDG 10 · SDG 16</span>
            </div>
            <div className="flex items-center gap-4 text-xs text-white/30">
              <MapPin className="w-3 h-3" />
              <span>Tashkent, Uzbekistan</span>
              <span>·</span>
              <span>© 2025–{new Date().getFullYear()} HamrohUz</span>
            </div>
          </div>
          <p className="text-xs text-white/20 mt-2">
            HamrohUz provides informational and AI-assisted legal guidance. It does not constitute legal advice and does not create an attorney-client relationship. For complex legal matters, always consult a licensed attorney.
          </p>
        </div>
      </div>
    </footer>
  );
}
