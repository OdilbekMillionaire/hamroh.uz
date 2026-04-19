import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Phone, AlertTriangle, Shield, ExternalLink, MapPin, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "Emergency SOS — HamrohUz",
  description: "Emergency contacts and legal help for Uzbek citizens in crisis abroad.",
};

const UZBEK_EMBASSY = [
  { country: "Russia 🇷🇺", city: "Moscow", phone: "+7 495 143-31-15", emergency: "+7 495 143-36-31", address: "Pogodinskaya St, 12" },
  { country: "South Korea 🇰🇷", city: "Seoul", phone: "+82 2 574-6554", emergency: "+82 10 9086-6554", address: "Hannam-daero 98-gil 19" },
  { country: "Turkey 🇹🇷", city: "Ankara", phone: "+90 312 441-0248", emergency: "+90 532 441-0248", address: "Söğütözü Cad. No:41" },
  { country: "UAE 🇦🇪", city: "Abu Dhabi", phone: "+971 2 631-7505", emergency: "+971 50 631-7505", address: "Al Manhal Area" },
  { country: "Germany 🇩🇪", city: "Berlin", phone: "+49 30 394-098-0", emergency: "+49 30 394-098-30", address: "Perleberger Str. 62" },
  { country: "USA 🇺🇸", city: "Washington D.C.", phone: "+1 202 887-5300", emergency: "+1 202 550-8881", address: "1746 Massachusetts Ave NW" },
];

const EMERGENCY_STEPS = [
  { step: "1", title: "Stay Calm", desc: "Take a breath. Most legal situations have solutions. You are not alone." },
  { step: "2", title: "Contact Your Embassy", desc: "Call the Uzbek embassy in your country. They are obligated to assist citizens." },
  { step: "3", title: "Document Everything", desc: "Take photos, save messages, write down dates and names of all parties involved." },
  { step: "4", title: "Ask Hamroh AI", desc: "Use the AI Assistant to understand your rights and get guidance on next steps." },
  { step: "5", title: "File a Petition", desc: "Use HamrohUz to formally file a complaint with the appropriate authority." },
];

const LOCAL_EMERGENCY = [
  { type: "Police", codes: { russia: "102", korea: "112", turkey: "155", uae: "999", germany: "110", usa: "911" } },
  { type: "Ambulance", codes: { russia: "103", korea: "119", turkey: "112", uae: "998", germany: "112", usa: "911" } },
  { type: "Fire", codes: { russia: "101", korea: "119", turkey: "110", uae: "997", germany: "112", usa: "911" } },
];

export default function EmergencyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* SOS Banner */}
        <section className="bg-[#E74C3C] py-8 text-white text-center">
          <AlertTriangle className="w-10 h-10 mx-auto mb-2 animate-pulse" />
          <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: "var(--font-jakarta)" }}>
            Emergency SOS
          </h1>
          <p className="text-white/80 text-sm">
            If you are in immediate physical danger, call local emergency services first (see below).
            For legal emergencies, use the contacts on this page.
          </p>
        </section>

        {/* Local emergency numbers */}
        <section className="py-8 bg-white border-b border-[#D8E2E9]">
          <div className="page-wrapper">
            <h2 className="text-lg font-bold text-[#1A2733] mb-4" style={{ fontFamily: "var(--font-jakarta)" }}>
              Local Emergency Numbers
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#F7F9FA]">
                    <th className="text-left p-3 text-[#4A6274] font-semibold rounded-tl-xl">Service</th>
                    {["Russia", "Korea", "Turkey", "UAE", "Germany", "USA"].map((c) => (
                      <th key={c} className="text-center p-3 text-[#4A6274] font-semibold">{c}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {LOCAL_EMERGENCY.map((row, i) => (
                    <tr key={row.type} className={i % 2 === 0 ? "bg-white" : "bg-[#F7F9FA]"}>
                      <td className="p-3 font-medium text-[#1A2733]">{row.type}</td>
                      {Object.values(row.codes).map((code, j) => (
                        <td key={j} className="p-3 text-center">
                          <a
                            href={`tel:${code}`}
                            className="inline-flex items-center justify-center gap-1 font-bold text-[#E74C3C] hover:underline"
                          >
                            <Phone className="w-3 h-3" />
                            {code}
                          </a>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Steps */}
        <section className="py-12 bg-[#F7F9FA]">
          <div className="page-wrapper max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-[#1A2733] mb-8" style={{ fontFamily: "var(--font-jakarta)" }}>
              What to Do in a Legal Emergency
            </h2>
            <div className="space-y-4">
              {EMERGENCY_STEPS.map((step) => (
                <div key={step.step} className="flex gap-4 bg-white rounded-xl p-4 border border-[#D8E2E9]">
                  <div className="w-10 h-10 rounded-full bg-[#0E6E7E] text-white font-bold flex items-center justify-center shrink-0 text-sm">
                    {step.step}
                  </div>
                  <div>
                    <p className="font-semibold text-[#1A2733] mb-1">{step.title}</p>
                    <p className="text-sm text-[#4A6274]">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Embassy contacts */}
        <section className="py-12 bg-white">
          <div className="page-wrapper">
            <div className="flex items-center gap-2 mb-8">
              <Shield className="w-5 h-5 text-[#0E6E7E]" />
              <h2 className="text-2xl font-bold text-[#1A2733]" style={{ fontFamily: "var(--font-jakarta)" }}>
                Uzbek Embassy Contacts
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {UZBEK_EMBASSY.map((emb) => (
                <div key={emb.country} className="card border-[#D8E2E9] hover:border-[#0E6E7E]">
                  <h3 className="font-bold text-[#1A2733] mb-3" style={{ fontFamily: "var(--font-jakarta)" }}>
                    {emb.country}
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-[#4A6274]">
                      <MapPin className="w-3.5 h-3.5 text-[#8FA5B5] shrink-0" />
                      <span>{emb.city} — {emb.address}</span>
                    </div>
                    <a href={`tel:${emb.phone}`} className="flex items-center gap-2 text-[#0E6E7E] hover:underline">
                      <Phone className="w-3.5 h-3.5 shrink-0" />
                      {emb.phone}
                    </a>
                    <a href={`tel:${emb.emergency}`} className="flex items-center gap-2 text-[#E74C3C] font-semibold hover:underline">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                      Emergency: {emb.emergency}
                    </a>
                    <div className="flex items-center gap-2 text-[#8FA5B5]">
                      <Clock className="w-3.5 h-3.5 shrink-0" />
                      Mon–Fri 09:00–17:00
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Disclaimer */}
        <div className="page-wrapper py-6">
          <p className="text-xs text-[#8FA5B5] text-center">
            Embassy contacts are provided for informational purposes. Always verify current contact details on the official website of the Embassy of Uzbekistan in your country.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
