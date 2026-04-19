"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { ArrowRight, Shield, Bot, FileText, ChevronLeft, ChevronRight } from "lucide-react";

const HERO_SLIDES = [
  {
    image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1800&q=80",
    alt: "Travel documents and a map prepared for an international journey",
    label: "Migration guidance",
  },
  {
    image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1800&q=80",
    alt: "Legal documents on a desk",
    label: "Document support",
  },
  {
    image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1800&q=80",
    alt: "People shaking hands during a professional consultation",
    label: "Trusted assistance",
  },
  {
    image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1800&q=80",
    alt: "People discussing paperwork in an office",
    label: "Case review",
  },
  {
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1800&q=80",
    alt: "Laptop showing a support workflow",
    label: "Digital help",
  },
  {
    image: "https://images.unsplash.com/photo-1507537297725-24a1c029d3ca?auto=format&fit=crop&w=1800&q=80",
    alt: "A person working on a laptop with documents",
    label: "Online petitions",
  },
  {
    image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1800&q=80",
    alt: "A team reviewing plans together",
    label: "Human support",
  },
  {
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1800&q=80",
    alt: "Forms and paperwork being reviewed",
    label: "Legal clarity",
  },
] as const;

export default function LandingHero({ locale }: { locale: string }) {
  const t = useTranslations("home.hero");
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % HERO_SLIDES.length);
    }, 5500);

    return () => window.clearInterval(timer);
  }, []);

  function showPreviousSlide() {
    setActiveSlide((current) => (current - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  }

  function showNextSlide() {
    setActiveSlide((current) => (current + 1) % HERO_SLIDES.length);
  }

  return (
    <section className="relative min-h-[calc(100svh-5rem)] overflow-hidden bg-[#083D47] py-20 md:py-24">
      <div className="absolute inset-0">
        {HERO_SLIDES.map((slide, index) => (
          <Image
            key={slide.image}
            src={slide.image}
            alt={slide.alt}
            fill
            sizes="100vw"
            loading={index === 0 ? "eager" : "lazy"}
            className={`object-cover transition-opacity duration-1000 ${
              index === activeSlide ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(3,31,36,0.88)_0%,rgba(8,61,71,0.72)_45%,rgba(8,61,71,0.34)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-[#083D47] to-transparent" />
      </div>

      <div className="page-wrapper relative z-10">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-white/20 text-white text-sm font-medium px-4 py-2 rounded-lg mb-6 backdrop-blur-sm">
            <span className="w-2 h-2 bg-[#2ECC71] rounded-full animate-pulse" />
            {t("poweredBy")}
          </div>
          <h1
            className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight max-w-3xl"
            style={{ fontFamily: "var(--font-jakarta, 'Plus Jakarta Sans', sans-serif)" }}
          >
            {t("title")}
          </h1>
          <p className="text-white/85 text-lg md:text-xl mb-8 max-w-2xl leading-relaxed">
            {t("subtitle")}
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href={`/${locale}/register`}
              className="inline-flex items-center gap-2 bg-white text-[#0E6E7E] font-semibold px-8 py-3.5 rounded-lg hover:bg-gray-50 transition-all shadow-lg"
            >
              {t("ctaPrimary")}
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href={`/${locale}/ai-assistant`}
              className="inline-flex items-center gap-2 border-2 border-white/50 text-white font-semibold px-8 py-3.5 rounded-lg hover:bg-white/10 transition-all"
            >
              <Bot className="w-4 h-4" />
              {t("ctaSecondary")}
            </Link>
          </div>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl">
            {[
              { icon: Shield, label: "Legal Protection" },
              { icon: Bot, label: "AI Assistant" },
              { icon: FileText, label: "Petition Tracking" },
            ].map((item) => (
              <div key={item.label} className="bg-white/[0.12] backdrop-blur-sm rounded-lg p-4 text-white">
                <item.icon className="w-6 h-6 mx-auto mb-2 text-[#2ECC71]" />
                <p className="text-xs font-medium text-center">{item.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={showPreviousSlide}
              className="grid h-10 w-10 place-items-center rounded-lg border border-white/35 bg-white/10 text-white backdrop-blur-sm transition hover:bg-white/20"
              title="Previous image"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={showNextSlide}
              className="grid h-10 w-10 place-items-center rounded-lg border border-white/35 bg-white/10 text-white backdrop-blur-sm transition hover:bg-white/20"
              title="Next image"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {HERO_SLIDES.map((slide, index) => (
              <button
                key={slide.label}
                type="button"
                onClick={() => setActiveSlide(index)}
                className={`h-2.5 rounded-full transition-all ${
                  index === activeSlide ? "w-8 bg-[#2ECC71]" : "w-2.5 bg-white/55 hover:bg-white"
                }`}
                title={slide.label}
              />
            ))}
          </div>

          <p className="text-sm font-medium text-white/80">{HERO_SLIDES[activeSlide].label}</p>
        </div>
      </div>
    </section>
  );
}
