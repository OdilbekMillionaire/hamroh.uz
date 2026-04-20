"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import Footer from "@/components/layout/Footer";
import Breadcrumbs from "@/components/shared/Breadcrumbs";
import { useLocale } from "next-intl";
import {
  FileText, Clock, CheckCircle, Eye,
  MessageSquare, Download, ChevronRight, Calendar,
  Building, Tag, User, Send, Loader2, ArrowLeft
} from "lucide-react";
import Link from "next/link";

// Mock data — will be replaced with Firebase Firestore fetch
const MOCK_PETITION = {
  id: "HMZ-2025-48271",
  title: "Unpaid Wages Dispute — Seoul Factory",
  category: "labor",
  status: "reviewing",
  createdAt: "2025-03-12",
  updatedAt: "2025-04-08",
  country: "South Korea 🇰🇷",
  description:
    "My employer has not paid my wages for the last two months. I have been working at a garment factory in Seoul since January 2025 under a work visa (E-9). My contract states payment on the 25th of each month, but February and March salaries have not been paid. The employer claims cash flow issues but gives no timeline. I have documented my work hours and have copies of my employment contract.",
  operator: "Korean Labor Rights Office",
  trackingId: "HMZ-2025-48271",
  attachments: [
    { name: "employment_contract.pdf", size: "1.2 MB" },
    { name: "work_hours_march.xlsx", size: "48 KB" },
    { name: "payslip_january.jpg", size: "320 KB" },
  ],
  timeline: [
    { date: "2025-03-12", status: "submitted", label: "Petition Submitted", desc: "Your petition was received and assigned tracking ID HMZ-2025-48271.", actor: "You" },
    { date: "2025-03-13", status: "received", label: "Received by Operator", desc: "Korean Labor Rights Office confirmed receipt and assigned Case Officer Kim Ji-won.", actor: "Operator" },
    { date: "2025-03-20", status: "progress", label: "Document Verification", desc: "Your attached documents have been verified. Employment contract and work hours log accepted.", actor: "Operator" },
    { date: "2025-04-01", status: "progress", label: "Contact Made with Employer", desc: "Official inquiry letter sent to your employer requesting payment confirmation within 14 days.", actor: "Operator" },
    { date: "2025-04-08", status: "reviewing", label: "Under Review", desc: "Waiting for employer response. Expected resolution by April 22.", actor: "Operator" },
  ],
  messages: [
    { from: "operator", name: "Kim Ji-won", avatar: "KJ", date: "2025-03-14", text: "Hello, I have been assigned as your case officer. Could you please provide any additional written communication you have had with your employer regarding the unpaid wages?" },
    { from: "user", name: "You", avatar: "ME", date: "2025-03-15", text: "Thank you. I am attaching the text messages I sent to my manager. He acknowledged the delay but gave no date for payment." },
    { from: "operator", name: "Kim Ji-won", avatar: "KJ", date: "2025-04-01", text: "Thank you for the messages. We have sent a formal inquiry to your employer. Please continue working if you feel safe doing so, and document all future communications." },
  ],
};

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  submitted: { label: "Submitted", color: "text-blue-600 bg-blue-50 border-blue-200", icon: Send },
  received: { label: "Received", color: "text-purple-600 bg-purple-50 border-purple-200", icon: Eye },
  reviewing: { label: "Under Review", color: "text-orange-600 bg-orange-50 border-orange-200", icon: Clock },
  resolved: { label: "Resolved", color: "text-green-600 bg-green-50 border-green-200", icon: CheckCircle },
  progress: { label: "In Progress", color: "text-[#0E6E7E] bg-[#E8F4F6] border-[#0E6E7E]/20", icon: ChevronRight },
};

export default function PetitionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const locale = useLocale();
  const [activeTab, setActiveTab] = useState<"overview" | "timeline" | "messages">("overview");
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const petition = MOCK_PETITION; // TODO: fetch by id from Firestore

  const statusCfg = STATUS_CONFIG[petition.status] ?? STATUS_CONFIG.submitted;
  const StatusIcon = statusCfg.icon;

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!newMessage.trim()) return;
    setSending(true);
    await new Promise((r) => setTimeout(r, 800));
    setSending(false);
    setNewMessage("");
  }

  const TABS = [
    { id: "overview", label: "Overview", icon: FileText },
    { id: "timeline", label: "Timeline", icon: Clock },
    { id: "messages", label: "Messages", icon: MessageSquare },
  ] as const;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 min-w-0 p-6">
          <div className="max-w-4xl">
            {/* Back + Breadcrumbs */}
            <div className="mb-4 flex items-center gap-4">
              <Link
                href={`/${locale}/petitions`}
                className="flex items-center gap-1.5 text-sm text-[#8FA5B5] hover:text-[#0E6E7E] transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> Back to Petitions
              </Link>
              <Breadcrumbs
                items={[
                  { label: "Petitions", href: `/${locale}/petitions` },
                  { label: petition.trackingId },
                ]}
              />
            </div>

            {/* Header card */}
            <div className="card mb-6">
              <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                <div className="w-12 h-12 bg-[#E8F4F6] rounded-xl flex items-center justify-center shrink-0">
                  <FileText className="w-6 h-6 text-[#0E6E7E]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${statusCfg.color}`}>
                      <StatusIcon className="w-3.5 h-3.5" />
                      {statusCfg.label}
                    </span>
                    <span className="text-xs text-[#8FA5B5] font-mono">{petition.trackingId}</span>
                  </div>
                  <h1 className="text-xl font-bold text-[#1A2733] mb-3" style={{ fontFamily: "var(--font-jakarta)" }}>
                    {petition.title}
                  </h1>
                  <div className="flex flex-wrap gap-4 text-sm text-[#4A6274]">
                    <span className="flex items-center gap-1.5"><Tag className="w-3.5 h-3.5" /> {petition.category}</span>
                    <span className="flex items-center gap-1.5"><Globe2 country={petition.country} /></span>
                    <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> Filed {petition.createdAt}</span>
                    <span className="flex items-center gap-1.5"><Building className="w-3.5 h-3.5" /> {petition.operator}</span>
                  </div>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 border border-[#D8E2E9] rounded-xl text-sm font-medium text-[#4A6274] hover:border-[#0E6E7E] hover:text-[#0E6E7E] transition-all shrink-0">
                  <Download className="w-4 h-4" /> Export PDF
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 mb-6 bg-[#F7F9FA] rounded-xl p-1">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                    activeTab === tab.id
                      ? "bg-white text-[#0E6E7E] shadow-sm"
                      : "text-[#4A6274] hover:text-[#1A2733]"
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Overview tab */}
            {activeTab === "overview" && (
              <div className="space-y-4">
                <div className="card">
                  <h2 className="font-bold text-[#1A2733] mb-3" style={{ fontFamily: "var(--font-jakarta)" }}>
                    Description
                  </h2>
                  <p className="text-sm text-[#4A6274] leading-relaxed">{petition.description}</p>
                </div>
                <div className="card">
                  <h2 className="font-bold text-[#1A2733] mb-3" style={{ fontFamily: "var(--font-jakarta)" }}>
                    Attachments ({petition.attachments.length})
                  </h2>
                  <div className="space-y-2">
                    {petition.attachments.map((file) => (
                      <div key={file.name} className="flex items-center justify-between p-3 bg-[#F7F9FA] rounded-xl">
                        <div className="flex items-center gap-3">
                          <FileText className="w-4 h-4 text-[#0E6E7E] shrink-0" />
                          <div>
                            <p className="text-sm font-medium text-[#1A2733]">{file.name}</p>
                            <p className="text-xs text-[#8FA5B5]">{file.size}</p>
                          </div>
                        </div>
                        <button className="p-2 hover:bg-[#E8F4F6] rounded-lg transition-colors">
                          <Download className="w-4 h-4 text-[#4A6274]" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="card border-yellow-200 bg-yellow-50">
                  <p className="text-sm text-yellow-800">
                    <strong>Last updated:</strong> {petition.updatedAt} — Your case officer is actively working on this petition.
                  </p>
                </div>
              </div>
            )}

            {/* Timeline tab */}
            {activeTab === "timeline" && (
              <div className="card">
                <h2 className="font-bold text-[#1A2733] mb-6" style={{ fontFamily: "var(--font-jakarta)" }}>
                  Case Timeline
                </h2>
                <ol className="relative border-l-2 border-[#D8E2E9] ml-4 space-y-6">
                  {petition.timeline.map((event, i) => {
                    const cfg = STATUS_CONFIG[event.status] ?? STATUS_CONFIG.submitted;
                    const Ic = cfg.icon;
                    const isLast = i === petition.timeline.length - 1;
                    return (
                      <li key={i} className="ml-6">
                        <span className={`absolute -left-3.5 flex items-center justify-center w-7 h-7 rounded-full border-2 border-white ${cfg.color}`}>
                          <Ic className="w-3.5 h-3.5" />
                        </span>
                        <div className={`p-4 rounded-xl border ${isLast ? "border-[#0E6E7E]/30 bg-[#E8F4F6]" : "border-[#D8E2E9] bg-white"}`}>
                          <div className="flex items-center justify-between flex-wrap gap-2 mb-1.5">
                            <h3 className="text-sm font-bold text-[#1A2733]">{event.label}</h3>
                            <span className="text-xs text-[#8FA5B5]">{event.date}</span>
                          </div>
                          <p className="text-sm text-[#4A6274]">{event.desc}</p>
                          <p className="text-xs text-[#8FA5B5] mt-1.5 flex items-center gap-1">
                            <User className="w-3 h-3" /> {event.actor}
                          </p>
                        </div>
                      </li>
                    );
                  })}
                </ol>
              </div>
            )}

            {/* Messages tab */}
            {activeTab === "messages" && (
              <div className="card flex flex-col gap-4">
                <h2 className="font-bold text-[#1A2733]" style={{ fontFamily: "var(--font-jakarta)" }}>
                  Case Communication
                </h2>
                <div className="space-y-4 max-h-96 overflow-y-auto pr-1">
                  {petition.messages.map((msg, i) => (
                    <div key={i} className={`flex gap-3 ${msg.from === "user" ? "flex-row-reverse" : ""}`}>
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${msg.from === "operator" ? "bg-[#E8F4F6] text-[#0E6E7E]" : "bg-[#1A2733] text-white"}`}>
                        {msg.avatar}
                      </div>
                      <div className={`max-w-[75%] ${msg.from === "user" ? "items-end" : "items-start"} flex flex-col gap-1`}>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-[#4A6274]">{msg.name}</span>
                          <span className="text-xs text-[#8FA5B5]">{msg.date}</span>
                        </div>
                        <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${msg.from === "operator" ? "bg-[#F7F9FA] text-[#1A2733] rounded-tl-sm" : "bg-[#0E6E7E] text-white rounded-tr-sm"}`}>
                          {msg.text}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <form onSubmit={sendMessage} className="flex gap-2 pt-3 border-t border-[#D8E2E9]">
                  <input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Reply to your case officer..."
                    className="flex-1 px-4 py-2.5 border border-[#D8E2E9] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0E6E7E]"
                  />
                  <button
                    type="submit"
                    disabled={!newMessage.trim() || sending}
                    className="px-4 py-2.5 bg-[#0E6E7E] text-white rounded-xl hover:bg-[#0B5A6A] disabled:opacity-50 transition-all"
                  >
                    {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  </button>
                </form>
              </div>
            )}
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}

function Globe2({ country }: { country: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className="text-[#8FA5B5]">📍</span>
      {country}
    </span>
  );
}
