import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Logo, { LogoIcon } from "@/components/shared/Logo";
import { Shield, Bot, Globe, Users, FileText, Zap, Award, Heart } from "lucide-react";

export const metadata: Metadata = {
  title: "About HamrohUz",
  description: "Learn about HamrohUz — the AI-powered civic-tech platform protecting Uzbek citizens abroad.",
};

const VALUES = [
  { icon: Shield, title: "Protection First", desc: "Every Uzbek citizen abroad deserves access to legal protection, regardless of income or location." },
  { icon: Bot, title: "AI-Powered", desc: "lawify.uz provides real-time legal guidance in all 4 languages — Uzbek, Russian, English, and Uzbek Cyrillic." },
  { icon: Globe, title: "Global Reach", desc: "Covering 50+ countries where Uzbek citizens live and work, with localized legal intelligence for each." },
  { icon: Heart, title: "Human-Centered", desc: "Technology serves people. Every feature is designed around the real needs of migrants, students, and travelers." },
];

const STATS = [
  { value: "9M+", label: "Uzbeks Living Abroad" },
  { value: "50+", label: "Countries Covered" },
  { value: "4", label: "Languages Supported" },
  { value: "24/7", label: "AI Assistance" },
];

const TEAM = [
  { name: "Sardor Yusupov", role: "CEO & Legal Director", flag: "🇺🇿" },
  { name: "Malika Karimova", role: "Head of AI Products", flag: "🇺🇿" },
  { name: "Alexei Petrov", role: "Technology Lead", flag: "🇷🇺" },
  { name: "Zarina Kim", role: "UX & Research", flag: "🇰🇷" },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-br from-[#0E6E7E] to-[#083D47] py-20 text-white">
          <div className="page-wrapper text-center">
            <div className="flex justify-center mb-6">
              <LogoIcon size={64} variant="white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: "var(--font-jakarta)" }}>
              About HamrohUz
            </h1>
            <p className="text-white/70 text-lg max-w-2xl mx-auto leading-relaxed">
              HamrohUz (meaning <em>&quot;Together&quot;</em> in Uzbek) is a civic-tech legal platform
              designed to empower Uzbek citizens living abroad with AI-powered legal assistance,
              document support, and real-time guidance.
            </p>
          </div>
        </section>

        {/* Mission */}
        <section className="py-16 bg-white">
          <div className="page-wrapper max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-[#1A2733] mb-6" style={{ fontFamily: "var(--font-jakarta)" }}>
              Our Mission
            </h2>
            <p className="text-[#4A6274] text-lg leading-relaxed mb-6">
              Over 9 million Uzbek citizens live and work abroad — in Russia, South Korea, Turkey,
              the UAE, Germany, and beyond. Many face language barriers, unfair labor conditions,
              migration complications, and lack access to affordable legal help.
            </p>
            <p className="text-[#4A6274] text-lg leading-relaxed">
              HamrohUz bridges this gap by combining lawify.uz AI with multilingual legal
              knowledge to provide instant, accessible, and affordable guidance — from filing
              petitions to understanding labor rights to finding emergency consular contacts.
            </p>
          </div>
        </section>

        {/* Stats */}
        <section className="py-12 bg-[#F7F9FA] border-y border-[#D8E2E9]">
          <div className="page-wrapper">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {STATS.map((s) => (
                <div key={s.label} className="text-center">
                  <div className="text-4xl font-bold text-[#0E6E7E] mb-1" style={{ fontFamily: "var(--font-jakarta)" }}>
                    {s.value}
                  </div>
                  <div className="text-sm text-[#4A6274]">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-16 bg-white">
          <div className="page-wrapper">
            <h2 className="text-3xl font-bold text-[#1A2733] mb-10 text-center" style={{ fontFamily: "var(--font-jakarta)" }}>
              Our Values
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {VALUES.map((v) => (
                <div key={v.title} className="card flex gap-4">
                  <div className="w-12 h-12 bg-[#E8F4F6] rounded-xl flex items-center justify-center shrink-0">
                    <v.icon className="w-6 h-6 text-[#0E6E7E]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#1A2733] mb-1" style={{ fontFamily: "var(--font-jakarta)" }}>{v.title}</h3>
                    <p className="text-sm text-[#4A6274] leading-relaxed">{v.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Legal Basis */}
        <section className="py-16 bg-[#F7F9FA]">
          <div className="page-wrapper max-w-3xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <Award className="w-6 h-6 text-[#0E6E7E]" />
              <h2 className="text-2xl font-bold text-[#1A2733]" style={{ fontFamily: "var(--font-jakarta)" }}>
                Legal Basis
              </h2>
            </div>
            <div className="space-y-4">
              {[
                { label: "Constitution of Uzbekistan, Article 23", desc: "Guarantees legal protection for all citizens, including those abroad." },
                { label: "Presidential Directive on Diaspora Support (January 2026)", desc: "Mandates digital services for Uzbek citizens living outside the republic." },
                { label: "UN Sustainable Development Goals", desc: "Aligned with SDG 8 (Decent Work), SDG 10 (Reduced Inequalities), SDG 16 (Peace, Justice and Strong Institutions)." },
              ].map((item) => (
                <div key={item.label} className="card">
                  <p className="font-semibold text-[#0E6E7E] text-sm mb-1">{item.label}</p>
                  <p className="text-sm text-[#4A6274]">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="py-16 bg-white">
          <div className="page-wrapper max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-[#1A2733] mb-10 text-center" style={{ fontFamily: "var(--font-jakarta)" }}>
              Our Team
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {TEAM.map((member) => (
                <div key={member.name} className="text-center">
                  <div className="w-16 h-16 rounded-2xl bg-[#E8F4F6] flex items-center justify-center mx-auto mb-3 text-2xl">
                    {member.flag}
                  </div>
                  <p className="font-semibold text-[#1A2733] text-sm">{member.name}</p>
                  <p className="text-xs text-[#8FA5B5] mt-0.5">{member.role}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
