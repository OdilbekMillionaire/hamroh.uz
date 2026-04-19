import { NextRequest } from "next/server";
import { models } from "@/lib/gemini";

const NEWS_API_BASE = "https://newsapi.org/v2";
const API_KEY = process.env.NEWS_API_KEY!;

// Topic → NewsAPI search queries
const TOPIC_QUERIES: Record<string, string> = {
  all: "uzbekistan migrants OR workers abroad OR labor rights migrants",
  labor: "labor rights migrants workers contract employment abroad",
  legal: "legal rights migrants visa law court deportation",
  uzbekistan: "uzbekistan government news citizens",
  visa: "visa immigration travel permit work permit",
  safety: "migrants safety security crime abroad workers",
  economy: "economy remittances workers wages abroad",
};

// Country filter terms added to query
const COUNTRY_TERMS: Record<string, string> = {
  all: "",
  russia: "russia",
  korea: "south korea",
  turkey: "turkey",
  uae: "uae dubai",
  germany: "germany",
  usa: "usa america",
};

const LOCALE_NAMES: Record<string, string> = {
  uz: "Uzbek Latin",
  "uz-cyrl": "Uzbek Cyrillic",
  ru: "Russian",
  en: "English",
};

interface NewsApiArticle {
  title?: string;
  description?: string | null;
  url?: string;
  source?: {
    name?: string;
  };
  publishedAt?: string;
  urlToImage?: string | null;
  author?: string | null;
}

interface NewsApiResponse {
  articles?: NewsApiArticle[];
  totalResults?: number;
}

interface NewsApiError {
  message?: string;
}

async function translateWithAI(text: string, targetLocale: string): Promise<string> {
  if (targetLocale === "en") return text;
  if (!text?.trim()) return text;

  const lang = LOCALE_NAMES[targetLocale] || "English";
  const prompt = `Translate this news text to ${lang}. Return ONLY the translated text, nothing else:\n\n${text}`;

  try {
    const model = models.flashLite();
    const result = await model.generateContent(prompt);
    return result.response.text().trim();
  } catch {
    return text;
  }
}

async function summarizeWithAI(title: string, description: string, locale: string): Promise<string> {
  const lang = LOCALE_NAMES[locale] || "English";
  const prompt = `Write a 1-sentence summary of this news in ${lang} for an Uzbek citizen abroad reading this on a legal assistance platform. Focus on what action or awareness is needed.

Title: ${title}
Description: ${description}

Return ONLY the summary sentence.`;

  try {
    const model = models.flashLite();
    const result = await model.generateContent(prompt);
    return result.response.text().trim();
  } catch {
    return description?.slice(0, 120) || "";
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const topic = searchParams.get("topic") || "all";
  const country = searchParams.get("country") || "all";
  const locale = searchParams.get("locale") || "en";
  const search = searchParams.get("search") || "";
  const page = parseInt(searchParams.get("page") || "1");

  let query = TOPIC_QUERIES[topic] || TOPIC_QUERIES.all;
  if (COUNTRY_TERMS[country]) query += ` ${COUNTRY_TERMS[country]}`;
  if (search) query = `${search} ${query}`;

  const url = new URL(`${NEWS_API_BASE}/everything`);
  url.searchParams.set("q", query);
  url.searchParams.set("sortBy", "publishedAt");
  url.searchParams.set("pageSize", "12");
  url.searchParams.set("page", String(page));
  url.searchParams.set("language", "en");
  url.searchParams.set("apiKey", API_KEY);

  try {
    const res = await fetch(url.toString(), {
      next: { revalidate: 300 }, // cache 5 minutes
    });

    if (!res.ok) {
      const err = (await res.json()) as NewsApiError;
      return Response.json({ error: err.message || "News API error" }, { status: res.status });
    }

    const data = (await res.json()) as NewsApiResponse;
    const articles = (data.articles || []).filter(
      (a): a is NewsApiArticle & { title: string; url: string } =>
        Boolean(a.title && a.title !== "[Removed]" && a.url)
    );

    // Translate + summarize in parallel (batch to avoid rate limits)
    const enriched = await Promise.all(
      articles.slice(0, 12).map(async (article) => {
        const [translatedTitle, aiSummary] = await Promise.all([
          translateWithAI(article.title, locale),
          summarizeWithAI(article.title, article.description || "", locale),
        ]);

        return {
          id: article.url,
          title: translatedTitle,
          originalTitle: article.title,
          description: article.description,
          aiSummary,
          url: article.url,
          source: article.source?.name || "Unknown",
          publishedAt: article.publishedAt,
          imageUrl: article.urlToImage,
          author: article.author,
        };
      })
    );

    return Response.json({
      articles: enriched,
      totalResults: data.totalResults,
      page,
    });
  } catch {
    return Response.json({ error: "Failed to fetch news" }, { status: 500 });
  }
}
