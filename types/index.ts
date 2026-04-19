import { Timestamp } from "firebase/firestore";

export interface UserProfile {
  uid: string;
  displayName: string;
  phone?: string;
  email?: string;
  currentCountry: string;
  preferredLanguage: "uz" | "uz-cyrl" | "ru" | "en";
  role: "user" | "operator" | "admin";
  savedContent: string[];
  createdAt: Timestamp;
}

export interface Petition {
  id: string;
  userId: string;
  title: string;
  description: string;
  draftedByAI: boolean;
  category: "migration" | "labor" | "emergency" | "document" | "other";
  aiScanResult: {
    risks: string[];
    recommendations: string[];
    urgency: "high" | "medium" | "low";
  } | null;
  targetOrg: { id: string; name: string };
  country: string;
  status: "sent" | "received" | "reviewing" | "resolved";
  attachments: { name: string; url: string; type: string }[];
  messages: PetitionMessage[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
  trackingId: string;
}

export interface PetitionMessage {
  id: string;
  from: "user" | "operator";
  content: string;
  createdAt: Timestamp;
}

export interface ContentItem {
  id: string;
  title: Record<"uz" | "uz-cyrl" | "ru" | "en", string>;
  body: Record<"uz" | "uz-cyrl" | "ru" | "en", string>;
  aiSummary: Record<"uz" | "uz-cyrl" | "ru" | "en", string>;
  embedding: number[];
  type: "article" | "video" | "infographic" | "news";
  country: string[];
  tags: string[];
  videoUrl?: string;
  imageUrl?: string;
  publishedAt: Timestamp;
  viewCount: number;
  savedBy: string[];
}

export interface SecurityData {
  riskLevel: "danger" | "caution" | "safe";
  summaryUz: string;
  summaryRu: string;
  summaryEn: string;
  keyIssues: string[];
  lastUpdated: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}
