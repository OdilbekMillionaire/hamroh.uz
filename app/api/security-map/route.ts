import { NextRequest } from "next/server";
import { models, isGeminiConfigured } from "@/lib/gemini";

export const revalidate = 86400; // cache 24 hours on Vercel

const COUNTRIES = [
  { country: "Russia", code: "RU", flag: "🇷🇺" },
  { country: "South Korea", code: "KR", flag: "🇰🇷" },
  { country: "Turkey", code: "TR", flag: "🇹🇷" },
  { country: "UAE", code: "AE", flag: "🇦🇪" },
  { country: "Germany", code: "DE", flag: "🇩🇪" },
  { country: "USA", code: "US", flag: "🇺🇸" },
];

const FALLBACK = [
  { country: "Russia", code: "RU", flag: "🇷🇺", level: "caution", summary: "Active migration control. Carry documents at all times.", updated: new Date().toISOString().slice(0, 10) },
  { country: "South Korea", code: "KR", flag: "🇰🇷", level: "safe", summary: "Safe for Uzbek workers. Labor rights well enforced.", updated: new Date().toISOString().slice(0, 10) },
  { country: "Turkey", code: "TR", flag: "🇹🇷", level: "caution", summary: "Moderate safety. Uzbek community well established.", updated: new Date().toISOString().slice(0, 10) },
  { country: "UAE", code: "AE", flag: "🇦🇪", level: "caution", summary: "Safe but strict laws. Employment visa required.", updated: new Date().toISOString().slice(0, 10) },
  { country: "Germany", code: "DE", flag: "🇩🇪", level: "safe", summary: "Strong labor protections. Language barrier may be an issue.", updated: new Date().toISOString().slice(0, 10) },
  { country: "USA", code: "US", flag: "🇺🇸", level: "safe", summary: "Strict immigration enforcement. Consular services available.", updated: new Date().toISOString().slice(0, 10) },
];

export async function GET(_req: NextRequest) {
  if (!isGeminiConfigured()) {
    return Response.json(FALLBACK);
  }

  try {
    const model = models.flash25();
    const today = new Date().toISOString().slice(0, 10);
    const prompt = `You are a safety analyst for Uzbek migrant workers. For each of these countries, provide a brief current safety assessment specifically for Uzbek citizens: ${COUNTRIES.map((c) => c.country).join(", ")}.

Respond ONLY with a valid JSON array — no markdown, no explanation. Each item must have exactly these fields:
- "country": country name (string)
- "code": ISO 2-letter code (string)
- "flag": emoji flag (string)
- "level": one of "safe", "caution", or "danger" (string)
- "summary": 1-2 sentence safety summary for Uzbek migrants, max 120 characters (string)
- "updated": "${today}" (string)

Flags: ${COUNTRIES.map((c) => `${c.country}=${c.flag}`).join(", ")}`;

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();

    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) throw new Error("No JSON array in response");

    const parsed = JSON.parse(jsonMatch[0]) as unknown[];
    if (!Array.isArray(parsed) || parsed.length === 0) throw new Error("Empty array");

    return Response.json(parsed, {
      headers: { "Cache-Control": "s-maxage=86400, stale-while-revalidate=3600" },
    });
  } catch {
    return Response.json(FALLBACK);
  }
}
