import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = { title: "Terms of Service — HamrohUz" };

const TERMS = [
  { title: "1. Acceptance of Terms", content: "By accessing or using HamrohUz (the 'Platform'), you agree to be bound by these Terms of Service. If you do not agree, do not use the Platform. These Terms apply to all visitors, registered users, and operators." },
  { title: "2. Description of Service", content: "HamrohUz provides AI-powered legal information, petition management tools, news aggregation, translation services, and smart maps for Uzbek citizens abroad. The Platform is informational in nature and does not constitute legal advice." },
  { title: "3. NOT Legal Advice", content: "IMPORTANT: HamrohUz and Hamroh AI provide general legal information only. Nothing on this Platform constitutes legal advice, creates an attorney-client relationship, or should be relied upon as a substitute for consultation with a licensed attorney. Always seek professional legal counsel for your specific situation." },
  { title: "4. User Accounts", content: "You must be at least 16 years old to register. You are responsible for maintaining the confidentiality of your account credentials. You agree to provide accurate information and to update it as necessary. You are responsible for all activities under your account." },
  { title: "5. Acceptable Use", content: "You agree NOT to: submit false or misleading information in petitions; use the Platform for illegal purposes; attempt to access other users' data; upload malicious files or code; use automated tools to scrape or abuse the Platform; harass, impersonate, or harm other users or operators." },
  { title: "6. AI-Generated Content", content: "AI responses and generated documents (petition drafts, legal summaries, translations) are provided 'as is' without warranty of accuracy, completeness, or fitness for a particular purpose. You are solely responsible for reviewing and verifying any AI-generated content before acting on it." },
  { title: "7. Petition Submissions", content: "By submitting a petition through HamrohUz, you represent that the information is true and accurate to the best of your knowledge. False statements in official petitions may have legal consequences. HamrohUz is not responsible for the outcome of any submitted petition." },
  { title: "8. Intellectual Property", content: "All Platform content, design, and code is owned by HamrohUz or its licensors and is protected by copyright law. User-generated content (petition text, uploaded documents) remains your property. By submitting it, you grant HamrohUz a limited license to display and process it for service purposes." },
  { title: "9. Limitation of Liability", content: "To the maximum extent permitted by law, HamrohUz is not liable for any indirect, incidental, or consequential damages arising from your use of the Platform, including but not limited to reliance on AI-generated legal information." },
  { title: "10. Governing Law", content: "These Terms are governed by the laws of the Republic of Uzbekistan. Any disputes shall first be attempted to be resolved through good-faith negotiation, then through the courts of Tashkent, Uzbekistan." },
];

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="bg-gradient-to-br from-[#0E6E7E] to-[#083D47] py-12 text-white text-center">
          <h1 className="text-3xl font-bold" style={{ fontFamily: "var(--font-jakarta)" }}>Terms of Service</h1>
          <p className="text-white/60 text-sm mt-2">Last updated: April 2025</p>
        </section>
        <section className="py-12">
          <div className="page-wrapper max-w-3xl mx-auto">
            <div className="card mb-6 border-yellow-200 bg-yellow-50">
              <p className="text-sm text-yellow-800 leading-relaxed">
                <strong>Key Point:</strong> HamrohUz provides legal information, not legal advice. Always consult a licensed attorney for your specific legal situation.
              </p>
            </div>
            <div className="space-y-6">
              {TERMS.map((s) => (
                <div key={s.title}>
                  <h2 className="font-bold text-[#1A2733] mb-2" style={{ fontFamily: "var(--font-jakarta)" }}>{s.title}</h2>
                  <p className="text-sm text-[#4A6274] leading-relaxed">{s.content}</p>
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
