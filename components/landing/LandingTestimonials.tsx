import { Star, Quote } from "lucide-react";

const TESTIMONIALS = [
  {
    name: "Jasur Toshmatov",
    country: "South Korea 🇰🇷",
    city: "Seoul",
    initials: "JT",
    rating: 5,
    text: "My employer held my passport for months. Hamroh AI explained exactly what to do and helped me draft an official complaint. The embassy responded within 3 days. I got my passport back.",
    tag: "Passport Recovery",
  },
  {
    name: "Nilufar Ergasheva",
    country: "Russia 🇷🇺",
    city: "Moscow",
    initials: "NE",
    rating: 5,
    text: "I hadn't been paid for 2 months. HamrohUz helped me file a petition with the labor office. Within 6 weeks, I received full back pay. I didn't even need a lawyer.",
    tag: "Unpaid Wages",
  },
  {
    name: "Bobur Karimov",
    country: "Turkey 🇹🇷",
    city: "Istanbul",
    initials: "BK",
    rating: 5,
    text: "When I was detained at the police station, I used the Emergency page to get my embassy's number immediately. The AI also told me my rights in Turkish law. Invaluable.",
    tag: "Legal Emergency",
  },
  {
    name: "Mohira Yusupova",
    country: "Germany 🇩🇪",
    city: "Berlin",
    initials: "MY",
    rating: 5,
    text: "The translator feature helped me understand my German rental contract before signing. I found a clause that would have let my landlord charge me extra fees. Saved me hundreds of euros.",
    tag: "Document Review",
  },
  {
    name: "Sanjar Nazarov",
    country: "UAE 🇦🇪",
    city: "Dubai",
    initials: "SN",
    rating: 5,
    text: "I filed my work visa complaint through HamrohUz. The tracking system let me see exactly where my case was at every step. Very professional and transparent.",
    tag: "Visa Issue",
  },
  {
    name: "Dilnoza Xasanova",
    country: "USA 🇺🇸",
    city: "New York",
    initials: "DX",
    rating: 5,
    text: "As a student, I was unsure about my legal rights when my university rejected my scholarship. Hamroh AI laid out my appeal options step by step. I got the scholarship reinstated.",
    tag: "Education Rights",
  },
];

export default function LandingTestimonials() {
  return (
    <section className="py-20 bg-[#F7F9FA]">
      <div className="page-wrapper">
        <div className="text-center mb-12">
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-[#0E6E7E] bg-[#E8F4F6] px-3 py-1 rounded-full mb-4">
            Real Stories
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-[#1A2733] mb-4" style={{ fontFamily: "var(--font-jakarta)" }}>
            Citizens We&apos;ve Helped
          </h2>
          <p className="text-[#4A6274] max-w-2xl mx-auto">
            Real experiences from Uzbek citizens who found protection, guidance, and justice through HamrohUz.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {TESTIMONIALS.map((t) => (
            <div key={t.name} className="card flex flex-col gap-4 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-[#0E6E7E] text-white text-sm font-bold flex items-center justify-center shrink-0">
                  {t.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-[#1A2733] text-sm">{t.name}</p>
                  <p className="text-xs text-[#8FA5B5]">{t.city}, {t.country}</p>
                </div>
                <Quote className="w-6 h-6 text-[#E8F4F6] shrink-0" />
              </div>

              <div className="flex items-center gap-0.5">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-[#F39C12] text-[#F39C12]" />
                ))}
              </div>

              <p className="text-sm text-[#4A6274] leading-relaxed flex-1">{t.text}</p>

              <span className="inline-block self-start text-xs font-semibold text-[#0E6E7E] bg-[#E8F4F6] px-2.5 py-1 rounded-full">
                {t.tag}
              </span>
            </div>
          ))}
        </div>

        <p className="text-center text-xs text-[#8FA5B5] mt-8">
          Names and identifiable details may be changed to protect privacy. Stories are real experiences.
        </p>
      </div>
    </section>
  );
}
