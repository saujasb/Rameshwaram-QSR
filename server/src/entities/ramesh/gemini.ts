import { GoogleGenAI } from "@google/genai";
import type { RameshQuery } from "../../../../shared-types/ramesh.js";

// Server-side only, on purpose: GEMINI_API_KEY has no VITE_ prefix, so Vite
// cannot bundle it into the browser build even by accident, and this module
// is only ever imported from server/src (never from client/src). Read the
// key lazily inside askGemini() rather than at module load time, so a
// missing key can never crash the process at startup -- only the specific
// /ramesh/ask request that needs it fails, gracefully, via routes.ts.
const DEFAULT_MODEL = "gemini-flash-latest";

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
    const response = await ai.models.generateContent({
      model,
      contents: `${question}${contextLine}${factsBlock}`,
      config: { systemInstruction: SYSTEM_INSTRUCTION },
    });

    const text = response.text?.trim();
    if (!text) throw new Error("Gemini returned an empty response.");
    return text;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[ramesh/gemini] request failed:", redact(message, apiKey));
    throw new Error("Gemini request failed.");
  }
}
