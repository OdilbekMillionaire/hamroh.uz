import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const safetySettings = [
  { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
];

export const models = {
  flashLite:   () => genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite", safetySettings }),
  flash2:      () => genAI.getGenerativeModel({ model: "gemini-2.0-flash", safetySettings }),
  flashLite25: () => genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite", safetySettings }),
  flash25:     () => genAI.getGenerativeModel({ model: "gemini-2.5-flash", safetySettings }),
  flash31Lite: () => genAI.getGenerativeModel({ model: "gemini-2.0-flash", safetySettings }),
  flash31:     () => genAI.getGenerativeModel({ model: "gemini-2.0-flash", safetySettings }),
  pro25:       () => genAI.getGenerativeModel({ model: "gemini-2.5-pro", safetySettings }),
  pro31:       () => genAI.getGenerativeModel({ model: "gemini-2.5-pro", safetySettings }),
  embedding:   () => genAI.getGenerativeModel({ model: "text-embedding-004" }),
  embeddingFb: () => genAI.getGenerativeModel({ model: "text-embedding-004" }),
};

export const FALLBACK_CHAINS = {
  chat:        ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-2.0-flash-lite"],
  translation: ["gemini-2.5-flash-lite", "gemini-2.0-flash-lite"],
  analysis:    ["gemini-2.5-pro", "gemini-2.5-flash"],
  draft:       ["gemini-2.5-pro", "gemini-2.5-flash"],
  embedding:   ["text-embedding-004"],
  quick:       ["gemini-2.0-flash-lite", "gemini-2.0-flash"],
} as const;

export const HAMROH_SYSTEM_PROMPT = `You are Hamroh AI — a specialized legal assistant for Uzbek citizens abroad.
You are fluent in Uzbek Latin, Uzbek Cyrillic, Russian, and English.
ALWAYS respond in the exact language and script the user writes in.

Specialization: migration law, labor law, international human rights, document legalization, consular procedures, emergency situations abroad.

Capabilities:
- Answer legal questions referencing both Uzbek law AND the law of the country where user currently is
- Analyze uploaded documents (contracts, visas, court orders, employer letters)
- Identify risks in labor contracts: missing clauses, illegal provisions, wage theft indicators
- Generate formal application drafts for consular authorities
- Explain legal processes in simple non-jargon language
- Guide users to the correct authority (embassy, labor court, police, legal aid)

Language instruction (apply always):
- If user writes in Uzbek Latin script → respond in Uzbek Latin script
- If user writes in Uzbek Cyrillic → respond in Uzbek Cyrillic
- If user writes in Russian → respond in Russian
- If user writes in English → respond in English
- Auto-detect the language from the user's message. Never mix languages.

Important: You are NOT a replacement for a licensed attorney. For complex cases, always recommend consulting a professional.

Tone: warm, clear, professional. Never condescending.`;

export async function withFallback<T>(
  label: string,
  attempts: Array<() => Promise<T>>
): Promise<T> {
  for (let i = 0; i < attempts.length; i++) {
    try {
      return await attempts[i]();
    } catch (err: unknown) {
      const error = err as { status?: number; message?: string };
      if (
        (error?.status === 429 || error?.message?.includes("429")) &&
        i < attempts.length - 1
      ) {
        console.warn(`[Gemini:${label}] 429 on attempt ${i + 1}, falling back`);
        await new Promise((r) => setTimeout(r, 500 * (i + 1)));
        continue;
      }
      throw err;
    }
  }
  throw new Error(`[Gemini:${label}] All fallbacks exhausted`);
}
