import { NextRequest } from "next/server";
import { models, withFallback } from "@/lib/gemini";

const LANG_NAMES: Record<string, string> = {
  uz: "Uzbek Latin",
  "uz-cyrl": "Uzbek Cyrillic",
  ru: "Russian",
  en: "English",
};

export async function POST(req: NextRequest) {
  try {
    const { text, from, to } = await req.json();
    if (!text?.trim()) return Response.json({ translation: "" });

    const fromName = LANG_NAMES[from] || from;
    const toName = LANG_NAMES[to] || to;

    const prompt = `Translate the following text from ${fromName} to ${toName}. Return ONLY the translated text, nothing else:\n\n${text}`;

    const translation = await withFallback("translation", [
      async () => {
        const model = models.flashLite25();
        const result = await model.generateContent(prompt);
        return result.response.text();
      },
      async () => {
        const model = models.flashLite();
        const result = await model.generateContent(prompt);
        return result.response.text();
      },
    ]);

    return Response.json({ translation });
  } catch (err) {
    return Response.json({ error: "Translation failed" }, { status: 500 });
  }
}
