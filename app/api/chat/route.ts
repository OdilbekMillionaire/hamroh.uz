import { NextRequest } from "next/server";
import {
  models,
  HAMROH_SYSTEM_PROMPT,
  HAMROH_RESPONSE_FORMAT_PROMPT,
  getSafeAiDiagnostic,
  isGeminiConfigured,
  isGeminiConfigError,
  withFallback,
} from "@/lib/gemini";

type ClientMessage = {
  role: "user" | "assistant";
  content: string;
};

type GeminiHistoryPart = {
  role: "user" | "model";
  parts: Array<{ text: string }>;
};

function getAiUnavailableMessage(locale: string, reason: "config" | "busy") {
  if (reason === "config") {
    if (locale === "ru") return "AI-сервис пока не настроен. Пожалуйста, повторите попытку позже.";
    if (locale === "uz-cyrl") return "AI хизмати ҳали созланмаган. Илтимос, кейинроқ қайта уриниб кўринг.";
    if (locale === "uz") return "AI xizmati hali sozlanmagan. Iltimos, keyinroq qayta urinib ko'ring.";
    return "AI service is not configured yet. Please try again later.";
  }

  if (locale === "ru") return "AI сейчас занят. Пожалуйста, попробуйте еще раз.";
  if (locale === "uz-cyrl") return "AI ҳозирда банд. Илтимос, қайта уриниб кўринг.";
  if (locale === "uz") return "AI hozirda band. Iltimos, qayta urinib ko'ring.";
  return "AI is currently busy. Please try again.";
}

function streamText(text: string) {
  return new TextEncoder().encode(`data: ${JSON.stringify({ text })}\n\ndata: [DONE]\n\n`);
}

function getLocaleInstruction(locale: string) {
  const language =
    locale === "ru"
      ? "Russian"
      : locale === "uz-cyrl"
        ? "Uzbek Cyrillic"
        : locale === "uz"
          ? "Uzbek Latin"
          : "English";

  return `The user selected the ${language} interface. Respond in ${language} unless the latest user message is clearly written in a different language or script.`;
}

function normalizeMessages(messages: unknown[]): ClientMessage[] {
  return messages
    .filter((message): message is ClientMessage => {
      if (!message || typeof message !== "object" || !("role" in message) || !("content" in message)) {
        return false;
      }

      return (
        (message.role === "user" || message.role === "assistant") &&
        typeof message.content === "string"
      );
    })
    .map((message) => ({
      role: message.role,
      content: message.content.trim(),
    }))
    .filter((message) => message.content.length > 0);
}

function buildGeminiHistory(messages: ClientMessage[]): GeminiHistoryPart[] {
  const history: GeminiHistoryPart[] = [];
  let nextRole: ClientMessage["role"] = "user";

  for (const message of messages) {
    if (message.role !== nextRole) continue;

    history.push({
      role: message.role === "assistant" ? "model" : "user",
      parts: [{ text: message.content }],
    });
    nextRole = message.role === "user" ? "assistant" : "user";
  }

  while (history.at(-1)?.role === "user") {
    history.pop();
  }

  return history;
}

export async function POST(req: NextRequest) {
  try {
    const { messages, locale = "en" } = await req.json();

    if (!Array.isArray(messages) || messages.length === 0) {
      return Response.json({ error: "No messages provided" }, { status: 400 });
    }

    const normalizedMessages = normalizeMessages(messages);
    const lastMessage = normalizedMessages.at(-1);

    if (!lastMessage || lastMessage.role !== "user") {
      return Response.json({ error: "Last message must be from the user" }, { status: 400 });
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

    const history = buildGeminiHistory(normalizedMessages.slice(0, -1));
    const systemInstruction = {
      role: "system",
      parts: [
        {
          text: `${HAMROH_SYSTEM_PROMPT}\n\n${HAMROH_RESPONSE_FORMAT_PROMPT}\n\n${getLocaleInstruction(locale)}`,
        },
      ],
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
          console.error("[AI:chat] failed", getSafeAiDiagnostic(err));
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
