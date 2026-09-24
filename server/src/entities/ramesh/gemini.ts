import { GoogleGenAI } from "@google/genai";
import type { RameshQuery } from "../../../../shared-types/ramesh.js";

// Server-side only, on purpose: GEMINI_API_KEY has no VITE_ prefix, so Vite
// cannot bundle it into the browser build even by accident, and this module
// is only ever imported from server/src (never from client/src). Read the
// key lazily inside askGemini() rather than at module load time, so a
// missing key can never crash the process at startup -- only the specific
// /ramesh/ask request that needs it fails, gracefully, via routes.ts.
const DEFAULT_MODEL = "gemini-flash-latest";
// Pinned, less-contended model tried once after the primary model keeps
// returning Google's load-shedding errors -- "gemini-flash-latest" always
// points at the newest Flash model, which is the one most often at capacity.
const DEFAULT_FALLBACK_MODEL = "gemini-2.5-flash";
// Waits between attempts on the primary model (so 3 attempts total).
const RETRY_DELAYS_MS = [600, 1500];

export function isGeminiConfigured(): boolean {
  return Boolean(process.env.GEMINI_API_KEY);
}

export class GeminiNotConfiguredError extends Error {
  constructor() {
    super("GEMINI_API_KEY is not configured.");
    this.name = "GeminiNotConfiguredError";
  }
}

// Ask Anything now DOES have real business data available for some
// questions -- see groundedAnswer.ts, which computes it deterministically
// (live provider_orders sales, or imported dataset_records production/
// wastage) and passes it in as `groundingFacts`. Gemini's job is to phrase
// those already-computed numbers, never to compute or guess its own.
const SYSTEM_INSTRUCTION = `You are "Ask Anything", the AI assistant embedded in the Rameshwaram QSR Dashboard (an operations dashboard for The Rameshwaram Café, Brookefield branch). Be helpful, concise, and friendly.

If a "VERIFIED DATA" section is provided below, it was computed directly from this restaurant's real database for this exact question -- treat every number in it as ground truth, use it to answer, and never restate it incorrectly or add numbers of your own on top of it. If it says data is unavailable for part of the question, say so plainly rather than filling the gap with a guess.

If no VERIFIED DATA section is provided, you do NOT have a live connection to this restaurant's records for this question. If asked for a specific real number or fact about this business, say plainly that you don't have that data connected for this question rather than guessing, estimating, or inventing a figure. For general questions, restaurant/QSR operations advice, or anything that doesn't require this specific business's private data, answer normally and helpfully.`;

/** Strips the API key out of a string before it's ever logged, in case an SDK error message happened to echo it back. */
function redact(message: string, secret: string | undefined): string {
  return secret ? message.split(secret).join("[redacted]") : message;
}

function errorMessage(err: unknown): string {
  return err instanceof Error ? err.message : String(err);
}

/**
 * Google's temporary capacity errors: 503 UNAVAILABLE ("model is currently
 * experiencing high demand") and 429 RESOURCE_EXHAUSTED. The SDK surfaces
 * these as an Error whose message carries Google's JSON error body.
 */
export function isTransientGeminiError(message: string): boolean {
  return /"code":\s*(503|429)\b|\bUNAVAILABLE\b|\bRESOURCE_EXHAUSTED\b/.test(message);
}

/**
 * Runs `generate` against the primary model, retrying only on transient
 * capacity errors (see RETRY_DELAYS_MS), then tries the fallback model once
 * if the primary is still at capacity. Any other error (bad request, auth,
 * unknown model, empty response) fails immediately without retrying. Every
 * failed attempt is reported through `log`.
 */
export async function generateWithRetry(
  generate: (model: string) => Promise<string>,
  primaryModel: string,
  fallbackModel: string | undefined,
  log: (message: string) => void,
  sleep: (ms: number) => Promise<void> = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
): Promise<string> {
  let lastError: unknown;
  for (let attempt = 0; attempt <= RETRY_DELAYS_MS.length; attempt++) {
    try {
      return await generate(primaryModel);
    } catch (err) {
      lastError = err;
      const message = errorMessage(err);
      log(`${primaryModel} attempt ${attempt + 1} failed: ${message}`);
      if (!isTransientGeminiError(message)) throw err;
      if (attempt < RETRY_DELAYS_MS.length) await sleep(RETRY_DELAYS_MS[attempt]);
    }
  }

  if (fallbackModel && fallbackModel !== primaryModel) {
    try {
      return await generate(fallbackModel);
    } catch (err) {
      log(`${fallbackModel} (fallback) failed: ${errorMessage(err)}`);
      throw err;
    }
  }
  throw lastError;
}

/**
 * Sends the question to Gemini (with any deterministically-computed
 * groundingFacts prepended as verified data) and returns its reply text.
 * Throws GeminiNotConfiguredError when no key is set, or a generic Error
 * (never the raw SDK error, which could otherwise carry request/response
 * internals) on any other failure -- callers must treat both as "answer
 * generation failed" without echoing internals to the client.
 */
export async function askGemini(question: string, context?: RameshQuery["context"], groundingFacts?: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new GeminiNotConfiguredError();

  const contextEntries = context ? Object.entries(context).filter(([, v]) => v) : [];
  const contextLine = contextEntries.length
    ? `\n\n(The user is currently viewing the dashboard filtered to: ${contextEntries.map(([k, v]) => `${k}=${v}`).join(", ")}. This is situational only, not verified business data -- do not treat it as a source of real figures.)`
    : "";
  const factsBlock = groundingFacts ? `\n\nVERIFIED DATA (computed just now, from the real database):\n${groundingFacts}` : "";

  try {
    const ai = new GoogleGenAI({ apiKey });
    const model = process.env.GEMINI_MODEL || DEFAULT_MODEL;
    const fallbackModel = process.env.GEMINI_FALLBACK_MODEL || DEFAULT_FALLBACK_MODEL;
    return await generateWithRetry(
      async (m) => {
        const response = await ai.models.generateContent({
          model: m,
          contents: `${question}${contextLine}${factsBlock}`,
          config: { systemInstruction: SYSTEM_INSTRUCTION },
        });
        const text = response.text?.trim();
        if (!text) throw new Error("Gemini returned an empty response.");
        return text;
      },
      model,
      fallbackModel,
      (message) => console.error("[ramesh/gemini] request failed:", redact(message, apiKey))
    );
  } catch {
    // Each failed attempt was already logged (redacted) by generateWithRetry.
    throw new Error("Gemini request failed.");
  }
}
