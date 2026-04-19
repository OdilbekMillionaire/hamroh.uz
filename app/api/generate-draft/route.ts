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
    const { title, description, category, locale } = await req.json();

    const lang = LANG_NAMES[locale] || "Uzbek Latin";
    const prompt = `You are a professional legal writer helping an Uzbek citizen abroad.

Generate a formal, professional petition in ${lang} based on:
- Issue: ${title}
- Category: ${category}
- Situation: ${description}

Write a complete formal petition letter addressed to the appropriate authority. Include:
1. Formal greeting
2. Clear statement of the problem
3. Legal basis (reference relevant laws if applicable)
4. Specific request/demand
5. Formal closing

Write ONLY the petition text, no explanations.`;

    const stream = new ReadableStream({
      async start(controller) {
        try {
          await withFallback("draft", [
            async () => {
              const model = models.pro25();
              const result = await model.generateContentStream(prompt);
              for await (const chunk of result.stream) {
                const text = chunk.text();
                if (text) {
                  controller.enqueue(
                    new TextEncoder().encode(`data: ${JSON.stringify({ text })}\n\n`)
                  );
                }
              }
            },
            async () => {
              const model = models.flash25();
              const result = await model.generateContentStream(prompt);
              for await (const chunk of result.stream) {
                const text = chunk.text();
                if (text) {
                  controller.enqueue(
                    new TextEncoder().encode(`data: ${JSON.stringify({ text })}\n\n`)
                  );
                }
              }
            },
          ]);
          controller.enqueue(new TextEncoder().encode("data: [DONE]\n\n"));
        } catch {
          controller.enqueue(
            new TextEncoder().encode(`data: ${JSON.stringify({ text: "Draft generation failed. Please try again." })}\n\n`)
          );
        }
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch {
    return Response.json({ error: "Draft generation failed" }, { status: 500 });
  }
}
