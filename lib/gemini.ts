import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

const GEMINI_CONFIG_ERROR = "GEMINI_API_KEY_MISSING";

function getGenAI() {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) {
    const error = new Error(GEMINI_CONFIG_ERROR);
    error.name = GEMINI_CONFIG_ERROR;
    throw error;
  }

  return new GoogleGenerativeAI(apiKey);
}

export function isGeminiConfigured() {
  return Boolean(process.env.GEMINI_API_KEY?.trim());
}

export function isGeminiConfigError(error: unknown) {
  return error instanceof Error && (error.name === GEMINI_CONFIG_ERROR || error.message === GEMINI_CONFIG_ERROR);
}

const safetySettings = [
  { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
];

export const models = {
  flashLite:   () => getGenAI().getGenerativeModel({ model: "gemini-2.5-flash-lite", safetySettings }),
  flash2:      () => getGenAI().getGenerativeModel({ model: "gemini-2.5-flash-lite", safetySettings }),
  flashLite25: () => getGenAI().getGenerativeModel({ model: "gemini-2.5-flash-lite", safetySettings }),
  flash25:     () => getGenAI().getGenerativeModel({ model: "gemini-2.5-flash", safetySettings }),
  flash31Lite: () => getGenAI().getGenerativeModel({ model: "gemini-2.5-flash-lite", safetySettings }),
  flash31:     () => getGenAI().getGenerativeModel({ model: "gemini-2.5-flash", safetySettings }),
  pro25:       () => getGenAI().getGenerativeModel({ model: "gemini-2.5-pro", safetySettings }),
  pro31:       () => getGenAI().getGenerativeModel({ model: "gemini-2.5-pro", safetySettings }),
  embedding:   () => getGenAI().getGenerativeModel({ model: "text-embedding-004" }),
  embeddingFb: () => getGenAI().getGenerativeModel({ model: "text-embedding-004" }),
};

export const FALLBACK_CHAINS = {
  chat:        ["gemini-2.5-flash", "gemini-2.5-flash-lite"],
  translation: ["gemini-2.5-flash-lite", "gemini-2.5-flash"],
  analysis:    ["gemini-2.5-pro", "gemini-2.5-flash"],
  draft:       ["gemini-2.5-pro", "gemini-2.5-flash"],
  embedding:   ["text-embedding-004"],
  quick:       ["gemini-2.5-flash-lite", "gemini-2.5-flash"],
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
  let lastError: unknown;

  for (let i = 0; i < attempts.length; i++) {
    try {
      return await attempts[i]();
    } catch (err: unknown) {
      lastError = err;
      if (isGeminiConfigError(err)) throw err;

      const error = err as { status?: number; message?: string };
      if (i < attempts.length - 1) {
        console.warn(
          `[Gemini:${label}] attempt ${i + 1} failed (${error?.status || "unknown"}), falling back`
        );
        await new Promise((r) => setTimeout(r, 500 * (i + 1)));
        continue;
      }
      throw err;
    }
  }
  throw lastError instanceof Error ? lastError : new Error(`[Gemini:${label}] All fallbacks exhausted`);
}
