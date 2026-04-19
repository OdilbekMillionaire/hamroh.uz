"use client";

import { useState } from "react";
import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { ChevronDown, HelpCircle, Search } from "lucide-react";
import { cn } from "@/lib/utils";

const FAQS = [
  {
    category: "General",
    items: [
      {
        q: "What is HamrohUz?",
        a: "HamrohUz is an AI-powered civic-tech legal platform for Uzbek citizens abroad. It provides legal consultation, petition filing, news, translations, smart maps, and more — all in Uzbek, Russian, and English.",
      },
      {
        q: "Is HamrohUz free to use?",
        a: "Yes — core features including Hamroh AI chat, news, content, and the translator are free. Premium features like document deep analysis and formal petition drafting may require a subscription in the future.",
      },
      {
        q: "Which countries does HamrohUz cover?",
        a: "HamrohUz covers 50+ countries, with specialized content for Russia, South Korea, Turkey, UAE, Germany, and the USA — the primary destinations for Uzbek migrants, students, and tourists.",
      },
    ],
  },
  {
    category: "Hamroh AI",
    items: [
      {
        q: "Is Hamroh AI a licensed lawyer?",
        a: "No. Hamroh AI provides informational guidance based on legal knowledge. It is NOT a licensed attorney and does not create an attorney-client relationship. For complex legal matters, always consult a licensed professional.",
      },
      {
        q: "What languages does Hamroh AI understand?",
        a: "Hamroh AI automatically detects your language and responds in Uzbek Latin, Uzbek Cyrillic, Russian, or English — matching exactly what you write.",
      },
      {
        q: "Can I upload documents for AI analysis?",
        a: "Yes. You can upload PDF, JPG, or PNG files (max 10MB) in the AI Assistant chat. Hamroh AI will analyze contracts, visa documents, court notices, and employer letters for risks and missing clauses.",
      },
    ],
  },
  {
    category: "Petitions",
    items: [
      {
        q: "What is a petition on HamrohUz?",
        a: "A petition is a formal request or complaint addressed to a government authority, embassy, labor court, or employer. HamrohUz helps you write, AI-scan, track, and submit petitions.",
      },
      {
        q: "How does AI petition scanning work?",
        a: "Before you submit, click 'AI Risk Scan'. The AI analyzes your petition for missing information, potential risks, and whether your urgency level is correctly classified. It then gives specific recommendations to strengthen your case.",
      },
      {
        q: "Can AI write my petition for me?",
        a: "Yes. Click 'Generate with AI' in the petition form. Hamroh AI will draft a formal petition based on your description, properly addressed and formatted. You can edit it before submitting.",
      },
    ],
  },
  {
    category: "Privacy & Data",
    items: [
      {
        q: "Is my personal data safe?",
        a: "Your data is stored in Firebase (Google Cloud), protected with industry-standard encryption. Petition data is only visible to you and assigned operators. We never sell your data.",
      },
      {
        q: "Does HamrohUz share my data with governments?",
        a: "No. We do not share personal data with any government, employer, or third party without your explicit consent, except when legally compelled by court order.",
      },
    ],
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-[#D8E2E9] rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 p-4 text-left hover:bg-[#F7F9FA] transition-colors"
      >
        <span className="font-medium text-[#1A2733] text-sm leading-snug">{q}</span>
        <ChevronDown
          className={cn("w-4 h-4 text-[#8FA5B5] shrink-0 transition-transform", open && "rotate-180")}
        />
      </button>
      {open && (
        <div className="px-4 pb-4 text-sm text-[#4A6274] leading-relaxed border-t border-[#EEF2F5] pt-3">
          {a}
        </div>
      )}
    </div>
  );
}

export default function FAQPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = ["All", ...FAQS.map((f) => f.category)];

  const filtered = FAQS.map((section) => ({
    ...section,
    items: section.items.filter(
      (item) =>
        (activeCategory === "All" || section.category === activeCategory) &&
        (!search || item.q.toLowerCase().includes(search.toLowerCase()) || item.a.toLowerCase().includes(search.toLowerCase()))
    ),
  })).filter((s) => s.items.length > 0);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="bg-gradient-to-br from-[#0E6E7E] to-[#083D47] py-16 text-white text-center">
          <HelpCircle className="w-12 h-12 mx-auto mb-4 text-white/60" />
          <h1 className="text-4xl font-bold mb-3" style={{ fontFamily: "var(--font-jakarta)" }}>
            Frequently Asked Questions
          </h1>
          <p className="text-white/70 max-w-xl mx-auto">Everything you need to know about HamrohUz</p>
        </section>

        <section className="py-12">
          <div className="page-wrapper max-w-3xl mx-auto">
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8FA5B5]" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search questions..."
                className="w-full pl-9 pr-4 py-3 border border-[#D8E2E9] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0E6E7E]"
              />
            </div>

            <div className="flex gap-2 mb-8 flex-wrap">
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => setActiveCategory(c)}
                  className={cn(
                    "px-4 py-1.5 rounded-full text-sm font-medium transition-all",
                    activeCategory === c
                      ? "bg-[#0E6E7E] text-white"
                      : "bg-[#F7F9FA] text-[#4A6274] hover:bg-[#E8F4F6] hover:text-[#0E6E7E]"
                  )}
                >
                  {c}
                </button>
              ))}
            </div>

            {filtered.map((section) => (
              <div key={section.category} className="mb-8">
                <h2 className="text-lg font-bold text-[#1A2733] mb-4" style={{ fontFamily: "var(--font-jakarta)" }}>
                  {section.category}
                </h2>
                <div className="space-y-3">
                  {section.items.map((item) => (
                    <FAQItem key={item.q} q={item.q} a={item.a} />
                  ))}
                </div>
              </div>
            ))}

            {filtered.length === 0 && (
              <div className="text-center py-16 text-[#8FA5B5]">
                <HelpCircle className="w-10 h-10 mx-auto mb-3 opacity-40" />
                <p>No questions match your search.</p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
