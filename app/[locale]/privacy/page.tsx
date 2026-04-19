import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = { title: "Privacy Policy — HamrohUz" };

const SECTIONS = [
  { title: "1. Information We Collect", content: "We collect: (a) account information (name, phone number, email) when you register; (b) petition content and uploaded documents you voluntarily submit; (c) usage data (pages visited, features used) to improve the platform; (d) device information (browser type, IP address) for security purposes. We do NOT collect financial information." },
  { title: "2. How We Use Your Information", content: "Your data is used to: provide and improve HamrohUz services; deliver AI-powered legal assistance tailored to your situation; send petition status notifications; generate anonymized usage analytics; comply with legal obligations. We never use your data for advertising or sell it to third parties." },
  { title: "3. Data Storage & Security", content: "All data is stored in Google Firebase (Firebase Firestore and Firebase Storage), hosted on Google Cloud servers with AES-256 encryption at rest and TLS 1.3 in transit. Petition documents are access-controlled — only you and authorized operators can view them." },
  { title: "4. Data Sharing", content: "We do not sell your personal data. We share data only with: (a) assigned petition operators (case-specific, need-to-know basis only); (b) trusted platform infrastructure and AI service providers; (c) law enforcement, when legally compelled by a valid court order. We will notify you of any such request to the extent permitted by law." },
  { title: "5. AI Data Processing", content: "When you use Hamroh AI, your messages and uploaded documents are processed by our AI service infrastructure. We configure safety settings that prevent storage of your conversations beyond the current session. We do not use your conversations to train AI models." },
  { title: "6. Your Rights", content: "You have the right to: access your personal data; correct inaccurate data; request deletion of your account and all associated data; export your data; withdraw consent for optional data uses; lodge a complaint with a data protection authority. Contact help@hamroh.uz to exercise any of these rights." },
  { title: "7. Cookies", content: "We use essential cookies (authentication, session management) and analytical cookies (anonymized usage statistics via Google Analytics). You can disable analytical cookies through our cookie preferences. Disabling essential cookies will prevent login." },
  { title: "8. Children's Privacy", content: "HamrohUz is not intended for users under 16 years of age. We do not knowingly collect personal information from children. If you believe we have inadvertently collected such information, contact us immediately." },
  { title: "9. Changes to This Policy", content: "We may update this policy periodically. We will notify registered users by email or in-app notification at least 14 days before significant changes take effect. Continued use after the effective date constitutes acceptance of the updated policy." },
  { title: "10. Contact", content: "For privacy-related inquiries: privacy@hamroh.uz | HamrohUz, Tashkent, Republic of Uzbekistan" },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="bg-gradient-to-br from-[#0E6E7E] to-[#083D47] py-12 text-white text-center">
          <h1 className="text-3xl font-bold" style={{ fontFamily: "var(--font-jakarta)" }}>Privacy Policy</h1>
          <p className="text-white/60 text-sm mt-2">Last updated: April 2025</p>
        </section>
        <section className="py-12">
          <div className="page-wrapper max-w-3xl mx-auto">
            <div className="card mb-6 bg-[#E8F4F6] border-[#0E6E7E]/20">
              <p className="text-sm text-[#0E6E7E] leading-relaxed">
                <strong>Summary:</strong> We collect only what we need. We never sell your data. Your petition documents are private. You can delete your account at any time.
              </p>
            </div>
            <div className="space-y-6">
              {SECTIONS.map((s) => (
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
