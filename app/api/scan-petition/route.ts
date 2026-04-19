import { NextRequest } from "next/server";
import { models, withFallback } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  try {
    const { title, description, category, locale } = await req.json();

    const prompt = `You are a legal expert reviewing a petition from an Uzbek citizen abroad.

Petition Title: ${title}
Category: ${category}
Description: ${description}

Analyze this petition and return ONLY valid JSON (no markdown):
{
  "risks": ["list of potential risks or issues"],
  "recommendations": ["list of recommendations to strengthen the petition"],
  "urgency": "high" | "medium" | "low"
}

Be specific and practical. Respond in ${locale === "ru" ? "Russian" : locale === "uz-cyrl" ? "Uzbek Cyrillic" : locale === "en" ? "English" : "Uzbek Latin"}.`;

    const result = await withFallback("analysis", [
      async () => {
        const model = models.flash25();
        const res = await model.generateContent(prompt);
        return res.response.text();
      },
      async () => {
        const model = models.flash2();
        const res = await model.generateContent(prompt);
        return res.response.text();
      },
    ]);

    const cleaned = result.replace(/```json|```/g, "").trim();
    const data = JSON.parse(cleaned);
    return Response.json(data);
  } catch {
    return Response.json({
      risks: ["Unable to complete scan. Please try again."],
      recommendations: [],
      urgency: "medium",
    });
  }
}
