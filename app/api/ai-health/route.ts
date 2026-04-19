import { getSafeAiDiagnostic, isGeminiConfigured, models } from "@/lib/gemini";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!isGeminiConfigured()) {
    return Response.json(
      {
        ok: false,
        configured: false,
        diagnostic: { kind: "config" },
      },
      { status: 503 }
    );
  }

  try {
    const model = models.flashLite25();
    const result = await model.generateContent("Reply with only OK.");
    const text = result.response.text().trim();

    return Response.json({
      ok: text.length > 0,
      configured: true,
    });
  } catch (error) {
    return Response.json(
      {
        ok: false,
        configured: true,
        diagnostic: getSafeAiDiagnostic(error),
      },
      { status: 503 }
    );
  }
}
