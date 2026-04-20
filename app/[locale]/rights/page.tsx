"use client";

import { useState } from "react";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import Footer from "@/components/layout/Footer";
import Breadcrumbs from "@/components/shared/Breadcrumbs";
import { useLocale } from "next-intl";
import {
  Shield, Loader2, ChevronDown, ChevronUp, CheckCircle,
  AlertTriangle, FileText, Scale, Globe, Briefcase,
  BookOpen, Sparkles, Search
} from "lucide-react";

const SCENARIOS = [
  { id: "labor", icon: Briefcase, label: "Labor Rights", examples: ["unpaid wages", "no contract", "forced overtime", "unsafe conditions"] },
  { id: "migration", icon: Globe, label: "Migration & Stay", examples: ["visa overstay", "residence permit", "deportation threat", "border crossing"] },
  { id: "arrest", icon: Shield, label: "Detained / Arrested", examples: ["police detainment", "not told my rights", "no interpreter", "access to embassy"] },
  { id: "document", icon: FileText, label: "Documents & ID", examples: ["passport confiscated", "lost documents", "expired ID", "apostille needed"] },
  { id: "housing", icon: Scale, label: "Housing & Property", examples: ["eviction without notice", "deposit not returned", "illegal landlord entry", "rental contract issue"] },
  { id: "education", icon: BookOpen, label: "Education & Study", examples: ["visa for study", "university rights", "discrimination", "scholarship issues"] },
];

interface RightsResult {
  summary: string;
  rights: string[];
  steps: string[];
  urgency: "low" | "medium" | "high";
  disclaimer: string;
}

export default function RightsPage() {
  const locale = useLocale();
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);
  const [situation, setSituation] = useState("");
  const [country, setCountry] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RightsResult | null>(null);
  const [expandedRight, setExpandedRight] = useState<number | null>(null);
  const [error, setError] = useState("");

  async function checkRights() {
    if (!situation.trim() || !country.trim()) return;
    setLoading(true);
    setResult(null);
    setError("");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            {
              role: "user",
              content: `You are a legal rights advisor for Uzbek citizens abroad. Analyze this situation and return a JSON response with this exact structure:
{
  "summary": "1-2 sentence plain-language summary of the situation",
  "rights": ["Right 1: detailed explanation", "Right 2: detailed explanation", "Right 3: detailed explanation"],
  "steps": ["Step 1: concrete action to take", "Step 2: action", "Step 3: action"],
  "urgency": "low|medium|high",
  "disclaimer": "short disclaimer about seeking professional legal advice"
}

Scenario type: ${selectedScenario || "general"}
Country: ${country}
Situation: ${situation}

Respond ONLY with valid JSON. No markdown, no explanation outside the JSON.`,
            },
          ],
          locale,
          stream: false,
        }),
      });

      if (!response.ok) throw new Error("API error");

      const text = await response.text();
      // Try to parse as JSON — the API might return streamed text
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("Could not parse response");
      const data = JSON.parse(jsonMatch[0]) as RightsResult;
      setResult(data);
    } catch {
      setError("Could not analyze your situation. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const urgencyConfig = {
    low: { color: "text-[#27AE60] bg-green-50 border-[#27AE60]/20", label: "Low Urgency", icon: CheckCircle },
    medium: { color: "text-[#F39C12] bg-orange-50 border-[#F39C12]/20", icon: AlertTriangle, label: "Medium Urgency" },
    high: { color: "text-[#E74C3C] bg-red-50 border-[#E74C3C]/20", icon: AlertTriangle, label: "High Urgency — Act Soon" },
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 min-w-0">
          {/* Hero */}
          <section className="bg-gradient-to-br from-[#0E6E7E] to-[#083D47] py-10 text-white">
            <div className="page-wrapper">
              <Breadcrumbs
                items={[{ label: "Rights Checker" }]}
                className="text-white/50 mb-4 [&_a]:text-white/50 [&_a:hover]:text-white"
              />
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                  <Scale className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold" style={{ fontFamily: "var(--font-jakarta)" }}>
                    AI Rights Checker
                  </h1>
                  <p className="text-white/60 text-sm">Know your legal rights in any country</p>
                </div>
              </div>
            </div>
          </section>

          <section className="py-8">
            <div className="page-wrapper max-w-4xl mx-auto space-y-6">
              {/* Scenario selector */}
              <div className="card">
                <h2 className="font-bold text-[#1A2733] mb-4" style={{ fontFamily: "var(--font-jakarta)" }}>
                  1. What type of situation are you facing?
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {SCENARIOS.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setSelectedScenario(s.id === selectedScenario ? null : s.id)}
                      className={`flex flex-col items-start gap-2 p-3 rounded-xl border-2 text-left transition-all ${
                        selectedScenario === s.id
                          ? "border-[#0E6E7E] bg-[#E8F4F6]"
                          : "border-[#D8E2E9] hover:border-[#0E6E7E]/40"
                      }`}
                    >
                      <s.icon className={`w-5 h-5 ${selectedScenario === s.id ? "text-[#0E6E7E]" : "text-[#8FA5B5]"}`} />
                      <span className={`text-sm font-semibold ${selectedScenario === s.id ? "text-[#0E6E7E]" : "text-[#1A2733]"}`}>
                        {s.label}
                      </span>
                      {selectedScenario === s.id && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {s.examples.map((ex) => (
                            <button
                              key={ex}
                              onClick={(e) => { e.stopPropagation(); setSituation(ex); }}
                              className="text-xs bg-[#0E6E7E]/10 text-[#0E6E7E] px-2 py-0.5 rounded-full hover:bg-[#0E6E7E]/20 transition-colors"
                            >
                              {ex}
                            </button>
                          ))}
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Country + situation input */}
              <div className="card space-y-4">
                <h2 className="font-bold text-[#1A2733]" style={{ fontFamily: "var(--font-jakarta)" }}>
                  2. Tell us about your situation
                </h2>
                <div>
                  <label className="block text-sm font-medium text-[#4A6274] mb-1.5">
                    Your current country
                  </label>
                  <input
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="e.g. Russia, South Korea, Germany..."
                    className="w-full px-4 py-2.5 border border-[#D8E2E9] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0E6E7E]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#4A6274] mb-1.5">
                    Describe your situation
                  </label>
                  <textarea
                    value={situation}
                    onChange={(e) => setSituation(e.target.value)}
                    rows={4}
                    placeholder="Describe what happened. The more detail you provide, the more accurate the rights analysis will be..."
                    className="w-full px-4 py-2.5 border border-[#D8E2E9] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0E6E7E] resize-none"
                  />
                  <p className="text-xs text-[#8FA5B5] mt-1.5">{situation.length}/1000 characters</p>
                </div>
                <button
                  onClick={checkRights}
                  disabled={loading || !situation.trim() || !country.trim()}
                  className="w-full flex items-center justify-center gap-2 bg-[#0E6E7E] text-white font-semibold py-3 rounded-xl hover:bg-[#0B5A6A] disabled:opacity-50 transition-all"
                >
                  {loading ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Analyzing your rights...</>
                  ) : (
                    <><Sparkles className="w-4 h-4" /> Check My Rights with AI</>
                  )}
                </button>
              </div>

              {error && (
                <div className="card border-red-200 bg-red-50 flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-[#E74C3C] shrink-0" />
                  <p className="text-sm text-[#E74C3C]">{error}</p>
                </div>
              )}

              {/* Results */}
              {result && (
                <div className="space-y-4">
                  {/* Urgency badge */}
                  <div className={`card border ${urgencyConfig[result.urgency].color} flex items-center gap-3`}>
                    {(() => {
                      const Ic = urgencyConfig[result.urgency].icon;
                      return <Ic className="w-5 h-5 shrink-0" />;
                    })()}
                    <div>
                      <p className="font-semibold text-sm">{urgencyConfig[result.urgency].label}</p>
                      <p className="text-sm mt-0.5 opacity-90">{result.summary}</p>
                    </div>
                  </div>

                  {/* Rights */}
                  <div className="card">
                    <div className="flex items-center gap-2 mb-4">
                      <Shield className="w-5 h-5 text-[#0E6E7E]" />
                      <h3 className="font-bold text-[#1A2733]" style={{ fontFamily: "var(--font-jakarta)" }}>
                        Your Rights
                      </h3>
                    </div>
                    <div className="space-y-2">
                      {result.rights.map((right, i) => (
                        <div key={i} className="border border-[#D8E2E9] rounded-xl overflow-hidden">
                          <button
                            onClick={() => setExpandedRight(expandedRight === i ? null : i)}
                            className="w-full flex items-center justify-between p-3 text-left hover:bg-[#F7F9FA] transition-colors"
                          >
                            <span className="text-sm font-medium text-[#1A2733] flex items-center gap-2">
                              <CheckCircle className="w-4 h-4 text-[#2ECC71] shrink-0" />
                              {right.split(":")[0]}
                            </span>
                            {expandedRight === i ? (
                              <ChevronUp className="w-4 h-4 text-[#8FA5B5] shrink-0" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-[#8FA5B5] shrink-0" />
                            )}
                          </button>
                          {expandedRight === i && right.includes(":") && (
                            <div className="px-4 pb-3 text-sm text-[#4A6274] leading-relaxed border-t border-[#D8E2E9] pt-3 bg-[#F7F9FA]">
                              {right.split(":").slice(1).join(":").trim()}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action steps */}
                  <div className="card">
                    <div className="flex items-center gap-2 mb-4">
                      <Search className="w-5 h-5 text-[#0E6E7E]" />
                      <h3 className="font-bold text-[#1A2733]" style={{ fontFamily: "var(--font-jakarta)" }}>
                        Recommended Steps
                      </h3>
                    </div>
                    <ol className="space-y-3">
                      {result.steps.map((step, i) => (
                        <li key={i} className="flex gap-3">
                          <span className="w-6 h-6 rounded-full bg-[#0E6E7E] text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                            {i + 1}
                          </span>
                          <p className="text-sm text-[#4A6274] leading-relaxed">{step.replace(/^Step \d+:\s*/i, "")}</p>
                        </li>
                      ))}
                    </ol>
                  </div>

                  {/* Disclaimer */}
                  <div className="card border-yellow-200 bg-yellow-50">
                    <p className="text-xs text-yellow-800 leading-relaxed">
                      <strong>Important:</strong> {result.disclaimer} This analysis is AI-generated for informational purposes only and does not constitute legal advice.
                    </p>
                  </div>

                  {/* CTA */}
                  <div className="card bg-[#0E6E7E] border-[#0E6E7E] text-white text-center">
                    <p className="font-semibold mb-3">Need more help with your situation?</p>
                    <div className="flex flex-wrap gap-3 justify-center">
                      <a
                        href={`/${locale}/ai-assistant`}
                        className="px-5 py-2 bg-white text-[#0E6E7E] rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors"
                      >
                        Chat with Hamroh AI
                      </a>
                      <a
                        href={`/${locale}/petitions/new`}
                        className="px-5 py-2 border-2 border-white text-white rounded-xl text-sm font-semibold hover:bg-white/10 transition-colors"
                      >
                        File a Petition
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>
        </main>
      </div>
      <Footer />
    </div>
  );
}
