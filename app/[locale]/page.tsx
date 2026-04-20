import Link from "next/link";
import { getLocale } from "next-intl/server";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import LandingHero from "@/components/landing/LandingHero";
import LandingFeatures from "@/components/landing/LandingFeatures";
import LandingHowItWorks from "@/components/landing/LandingHowItWorks";
import LandingStats from "@/components/landing/LandingStats";
import LandingTestimonials from "@/components/landing/LandingTestimonials";
import LandingLegalBasis from "@/components/landing/LandingLegalBasis";

export default async function HomePage() {
  const locale = await getLocale();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <LandingHero locale={locale} />
        <LandingStats />
        <LandingFeatures locale={locale} />
        <LandingHowItWorks />
        <LandingTestimonials />
        <LandingLegalBasis />
        <LandingCTA locale={locale} />
      </main>
      <Footer />
    </div>
  );
}

function LandingCTA({ locale }: { locale: string }) {
  return (
    <section className="py-20 bg-[var(--primary)]">
      <div className="page-wrapper text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4" style={{ fontFamily: "var(--font-jakarta)" }}>
          Ready to get legal help?
        </h2>
        <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
          Join thousands of Uzbek citizens who trust HamrohUz for legal protection abroad.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link
            href={`/${locale}/register`}
            className="bg-white text-[var(--primary)] font-semibold px-8 py-3 rounded-xl hover:bg-gray-50 transition-colors"
          >
            Get Started Free
          </Link>
          <Link
            href={`/${locale}/ai-assistant`}
            className="border-2 border-white text-white font-semibold px-8 py-3 rounded-xl hover:bg-white/10 transition-colors"
          >
            Try Hamroh AI
          </Link>
        </div>
      </div>
    </section>
  );
}
