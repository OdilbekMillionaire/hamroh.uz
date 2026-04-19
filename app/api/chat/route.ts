import { NextRequest } from "next/server";
import { models, HAMROH_SYSTEM_PROMPT, withFallback } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  try {
    const { messages, locale } = await req.json();

    const history = messages.slice(0, -1).map((m: { role: string; content: string }) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    const lastMessage = messages[messages.length - 1];

    const stream = new ReadableStream({
      async start(controller) {
        try {
          await withFallback("chat", [
            async () => {
              const model = models.flash25();
              const chat = model.startChat({
                history,
                systemInstruction: HAMROH_SYSTEM_PROMPT,
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
              const model = models.flash2();
              const chat = model.startChat({
                history,
                systemInstruction: HAMROH_SYSTEM_PROMPT,
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
          controller.enqueue(
            new TextEncoder().encode(`data: ${JSON.stringify({ text: "AI is currently busy. Please try again." })}\n\n`)
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
  } catch (err) {
    return Response.json({ error: "Internal error" }, { status: 500 });
  }
}
