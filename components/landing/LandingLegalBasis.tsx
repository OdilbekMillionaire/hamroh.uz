import { Scale, FileCheck, Shield, ExternalLink } from "lucide-react";

const LEGAL_BASES = [
  {
    icon: Scale,
    title: "Constitution of Uzbekistan",
    article: "Article 23",
    desc: "Every citizen of the Republic of Uzbekistan has the right to receive qualified legal assistance. The state guarantees this right.",
    color: "text-[#0E6E7E]",
    bg: "bg-[#E8F4F6]",
    border: "border-[#0E6E7E]/20",
  },
  {
    icon: FileCheck,
    title: "Presidential Directive",
    article: "No. PP-3933 (2018)",
    desc: "Directive on protecting the rights and interests of Uzbek citizens working abroad, mandating consular support mechanisms for migrant workers.",
    color: "text-[#9B59B6]",
    bg: "bg-purple-50",
    border: "border-purple-200",
  },
  {
    icon: Shield,
    title: "OHCHR Principles",
    article: "UN Guiding Principles",
    desc: "HamrohUz aligns with the United Nations guiding principles on business and human rights — ensuring migrant worker access to remedy.",
    color: "text-[#2ECC71]",
    bg: "bg-green-50",
    border: "border-green-200",
  },
];

const SDG_BADGES = [
  { num: "8", title: "Decent Work & Growth", color: "#A21942" },
  { num: "10", title: "Reduced Inequalities", color: "#DD1367" },
  { num: "16", title: "Peace, Justice & Institutions", color: "#00689D" },
];

export default function LandingLegalBasis() {
  return (
    <section className="py-20 bg-white border-t border-[#D8E2E9]">
      <div className="page-wrapper">
        <div className="text-center mb-12">
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-[#0E6E7E] bg-[#E8F4F6] px-3 py-1 rounded-full mb-4">
            Trusted Foundation
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-[#1A2733] mb-4" style={{ fontFamily: "var(--font-jakarta)" }}>
            Built on Legal & Ethical Grounds
          </h2>
          <p className="text-[#4A6274] max-w-2xl mx-auto">
            HamrohUz is grounded in Uzbek constitutional law, government directives, and internationally recognized human rights principles.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
          {LEGAL_BASES.map((item) => (
            <div key={item.title} className={`card border ${item.border} flex flex-col gap-4`}>
              <div className={`w-11 h-11 ${item.bg} rounded-xl flex items-center justify-center`}>
                <item.icon className={`w-5 h-5 ${item.color}`} />
              </div>
              <div>
                <p className={`text-xs font-bold uppercase tracking-wider ${item.color} mb-1`}>{item.article}</p>
                <h3 className="font-bold text-[#1A2733] mb-2" style={{ fontFamily: "var(--font-jakarta)" }}>
                  {item.title}
                </h3>
                <p className="text-sm text-[#4A6274] leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* SDG Badges */}
        <div className="border-t border-[#D8E2E9] pt-10">
          <p className="text-center text-sm font-semibold text-[#4A6274] mb-6">
            Contributing to United Nations Sustainable Development Goals
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            {SDG_BADGES.map((sdg) => (
              <div key={sdg.num} className="flex items-center gap-3">
                <div
                  className="w-14 h-14 rounded-xl flex flex-col items-center justify-center shrink-0 shadow-sm"
                  style={{ backgroundColor: sdg.color }}
                >
                  <span className="text-white text-xs font-bold leading-tight">SDG</span>
                  <span className="text-white text-2xl font-extrabold leading-tight" style={{ fontFamily: "var(--font-jakarta)" }}>
                    {sdg.num}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-[#8FA5B5] font-medium">Goal {sdg.num}</p>
                  <p className="text-sm font-semibold text-[#1A2733] max-w-[140px] leading-tight">{sdg.title}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-center text-xs text-[#8FA5B5] mt-6 max-w-xl mx-auto">
            HamrohUz is a civic initiative by{" "}
            <a href="https://lawify.uz" target="_blank" rel="noopener noreferrer" className="text-[#0E6E7E] hover:underline inline-flex items-center gap-0.5">
              lawify.uz <ExternalLink className="w-3 h-3" />
            </a>
            {" "}— Uzbekistan&apos;s first AI-powered legal tech platform.
          </p>
        </div>
      </div>
    </section>
  );
}
