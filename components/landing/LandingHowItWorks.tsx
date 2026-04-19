"use client";

import { useTranslations } from "next-intl";
import { UserPlus, MessageSquare, CheckCircle } from "lucide-react";

export default function LandingHowItWorks() {
  const t = useTranslations("home.howItWorks");

  const steps = [
    { icon: UserPlus, step: "01", label: t("step1") },
    { icon: MessageSquare, step: "02", label: t("step2") },
    { icon: CheckCircle, step: "03", label: t("step3") },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="page-wrapper">
        <h2
          className="text-3xl font-bold text-center text-[#1A2733] mb-12"
          style={{ fontFamily: "var(--font-jakarta, 'Plus Jakarta Sans', sans-serif)" }}
        >
          {t("title")}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {steps.map((step) => (
            <div key={step.step} className="text-center">
              <div className="relative inline-block mb-4">
                <div className="w-16 h-16 bg-[#E8F4F6] rounded-2xl flex items-center justify-center mx-auto">
                  <step.icon className="w-7 h-7 text-[#0E6E7E]" />
                </div>
                <span className="absolute -top-2 -right-2 w-6 h-6 bg-[#0E6E7E] text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {step.step}
                </span>
              </div>
              <p className="text-[#4A6274] text-sm leading-relaxed max-w-xs mx-auto">{step.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
