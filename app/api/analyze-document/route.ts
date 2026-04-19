import { NextRequest } from "next/server";
import { models, withFallback } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const locale = formData.get("locale") as string || "uz";

    if (!file) return Response.json({ error: "No file provided" }, { status: 400 });

    const bytes = await file.arrayBuffer();
    const base64 = Buffer.from(bytes).toString("base64");
    const mimeType = file.type;

    const prompt = `You are a legal expert for Uzbek citizens abroad. Analyze this document and provide:
1. Document type and purpose
2. Key clauses or information
3. Any potential legal risks or concerns
4. Recommendations

Respond in ${locale === "ru" ? "Russian" : locale === "uz-cyrl" ? "Uzbek Cyrillic" : locale === "en" ? "English" : "Uzbek Latin"}.`;

    const result = await withFallback("analysis", [
      async () => {
        const model = models.pro25();
        const res = await model.generateContent([
          { inlineData: { data: base64, mimeType } },
          { text: prompt },
        ]);
        return res.response.text();
      },
    ]);

    return Response.json({ analysis: result });
  } catch {
    return Response.json({ error: "Analysis failed" }, { status: 500 });
  }
}
