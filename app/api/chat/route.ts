import { NextRequest } from "next/server";
import { models, HAMROH_SYSTEM_PROMPT, isGeminiConfigured, isGeminiConfigError, withFallback } from "@/lib/gemini";

function getAiUnavailableMessage(locale: string, reason: "config" | "busy") {
  if (reason === "config") {
    if (locale === "ru") return "AI-сервис пока не настроен. Добавьте GEMINI_API_KEY в переменные окружения Vercel.";
    if (locale === "uz-cyrl") return "AI хизмати ҳали созланмаган. Vercel environment variables қисмига GEMINI_API_KEY қўшинг.";
    if (locale === "uz") return "AI xizmati hali sozlanmagan. Vercel environment variables bo'limiga GEMINI_API_KEY qo'shing.";
    return "AI service is not configured yet. Add GEMINI_API_KEY in Vercel environment variables.";
  }

  if (locale === "ru") return "AI сейчас занят. Пожалуйста, попробуйте еще раз.";
  if (locale === "uz-cyrl") return "AI ҳозирда банд. Илтимос, қайта уриниб кўринг.";
  if (locale === "uz") return "AI hozirda band. Iltimos, qayta urinib ko'ring.";
  return "AI is currently busy. Please try again.";
}

function streamText(text: string) {
  return new TextEncoder().encode(`data: ${JSON.stringify({ text })}\n\ndata: [DONE]\n\n`);
}

export async function POST(req: NextRequest) {
  try {
    const { messages, locale = "en" } = await req.json();

    if (!Array.isArray(messages) || messages.length === 0) {
      return Response.json({ error: "No messages provided" }, { status: 400 });
    }

    if (!isGeminiConfigured()) {
      return new Response(
        new ReadableStream({
          start(controller) {
            controller.enqueue(streamText(getAiUnavailableMessage(locale, "config")));
            controller.close();
          },
        }),
        {
          headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            Connection: "keep-alive",
          },
        }
      );
    }

    const history = messages.slice(0, -1).map((m: { role: string; content: string }) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    const lastMessage = messages[messages.length - 1];
    const systemInstruction = {
      role: "system",
      parts: [{ text: HAMROH_SYSTEM_PROMPT }],
    };

    const stream = new ReadableStream({
      async start(controller) {
        try {
          await withFallback("chat", [
            async () => {
              const model = models.flash25();
              const chat = model.startChat({
                history,
                systemInstruction,
              });
              const result = await chat.sendMessageStream(lastMessage.content);
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
              const model = models.flashLite25();
              const chat = model.startChat({
                history,
                systemInstruction,
              });
              const result = await chat.sendMessageStream(lastMessage.content);
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
        } catch (err) {
          console.error("[AI:chat] failed", err);
          controller.enqueue(
            streamText(getAiUnavailableMessage(locale, isGeminiConfigError(err) ? "config" : "busy"))
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
    return Response.json({ error: "Internal error" }, { status: 500 });
  }
}
