"use client";

import { useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Mail, Phone, MapPin, Send, Loader2, CheckCircle, MessageSquare, Clock } from "lucide-react";

const CONTACT_INFO = [
  { icon: Mail, label: "Email", value: "help@hamroh.uz", href: "mailto:help@hamroh.uz" },
  { icon: Phone, label: "Hotline", value: "+998 71 200-10-01", href: "tel:+998712001001" },
  { icon: MessageSquare, label: "Telegram", value: "@hamrohuz_support", href: "https://t.me/hamrohuz_support" },
  { icon: MapPin, label: "Office", value: "Tashkent, Uzbekistan", href: "#" },
  { icon: Clock, label: "Support Hours", value: "Mon–Fri, 09:00–18:00 (UZT)", href: "#" },
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setLoading(false);
    setSent(true);
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="bg-gradient-to-br from-[#0E6E7E] to-[#083D47] py-16 text-white text-center">
          <h1 className="text-4xl font-bold mb-3" style={{ fontFamily: "var(--font-jakarta)" }}>Contact Us</h1>
          <p className="text-white/70">We&apos;re here to help. Usually respond within 24 hours.</p>
        </section>

        <section className="py-12">
          <div className="page-wrapper max-w-5xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Contact info */}
              <div className="space-y-4">
                <h2 className="font-bold text-[#1A2733] text-lg mb-6" style={{ fontFamily: "var(--font-jakarta)" }}>
                  Get in Touch
                </h2>
                {CONTACT_INFO.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    className="flex items-start gap-3 p-3 rounded-xl hover:bg-[#F7F9FA] transition-colors"
                  >
                    <div className="w-9 h-9 bg-[#E8F4F6] rounded-xl flex items-center justify-center shrink-0">
                      <item.icon className="w-4 h-4 text-[#0E6E7E]" />
                    </div>
                    <div>
                      <p className="text-xs text-[#8FA5B5]">{item.label}</p>
                      <p className="text-sm font-medium text-[#1A2733]">{item.value}</p>
                    </div>
                  </a>
                ))}
              </div>

              {/* Contact form */}
              <div className="lg:col-span-2">
                <div className="card">
                  {sent ? (
                    <div className="text-center py-12">
                      <CheckCircle className="w-16 h-16 mx-auto mb-4 text-[#2ECC71]" />
                      <h3 className="text-xl font-bold text-[#1A2733] mb-2" style={{ fontFamily: "var(--font-jakarta)" }}>
                        Message Sent!
                      </h3>
                      <p className="text-[#4A6274] text-sm">
                        We&apos;ll get back to you within 24 hours at {form.email}
                      </p>
                      <button onClick={() => { setSent(false); setForm({ name: "", email: "", subject: "", message: "" }); }} className="mt-4 text-[#0E6E7E] text-sm hover:underline">
                        Send another message
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <h2 className="font-bold text-[#1A2733] text-lg mb-2" style={{ fontFamily: "var(--font-jakarta)" }}>
                        Send a Message
                      </h2>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-[#4A6274] mb-1.5">Full Name</label>
                          <input
                            required
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            placeholder="Your name"
                            className="w-full px-4 py-2.5 border border-[#D8E2E9] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0E6E7E]"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-[#4A6274] mb-1.5">Email</label>
                          <input
                            required
                            type="email"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            placeholder="your@email.com"
                            className="w-full px-4 py-2.5 border border-[#D8E2E9] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0E6E7E]"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#4A6274] mb-1.5">Subject</label>
                        <select
                          value={form.subject}
                          onChange={(e) => setForm({ ...form, subject: e.target.value })}
                          className="w-full px-4 py-2.5 border border-[#D8E2E9] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0E6E7E] bg-white"
                        >
                          <option value="">Select a topic</option>
                          <option>Legal Question</option>
                          <option>Technical Issue</option>
                          <option>Partnership Inquiry</option>
                          <option>Press & Media</option>
                          <option>Other</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#4A6274] mb-1.5">Message</label>
                        <textarea
                          required
                          rows={5}
                          value={form.message}
                          onChange={(e) => setForm({ ...form, message: e.target.value })}
                          placeholder="Describe your question or issue..."
                          className="w-full px-4 py-2.5 border border-[#D8E2E9] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0E6E7E] resize-none"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-2 bg-[#0E6E7E] text-white font-semibold py-3 rounded-xl hover:bg-[#0B5A6A] disabled:opacity-50 transition-all"
                      >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                        {loading ? "Sending..." : "Send Message"}
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
