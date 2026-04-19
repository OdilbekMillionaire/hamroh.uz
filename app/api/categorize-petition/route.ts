import { NextRequest } from "next/server";
import { models } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();

    const prompt = `Analyze this petition text and classify it into ONE of these categories: migration, labor, emergency, document, other.

Return ONLY valid JSON: {"category": "category_name", "urgency": "high"|"medium"|"low"}

Text: ${text}`;

    const model = models.flashLite();
    const result = await model.generateContent(prompt);
    const raw = result.response.text().trim();
    const cleaned = raw.replace(/```json|```/g, "").trim();
    const data = JSON.parse(cleaned);

    return Response.json(data);
  } catch {
    return Response.json({ category: "other", urgency: "medium" });
  }
}
