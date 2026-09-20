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

// Honest about current limitations rather than a generic assistant persona:
// Ask Anything is not yet wired to this dashboard's real business data (that
// is a separate, future task), so it must say so instead of guessing at a
// number a business owner could mistake for a real figure.
const SYSTEM_INSTRUCTION = `You are "Ask Anything", the AI assistant embedded in the Rameshwaram QSR Dashboard (an operations dashboard for The Rameshwaram Café, Brookefield branch). Be helpful, concise, and friendly.

You do NOT currently have a live connection to this restaurant's sales, production, or wastage records -- that integration is planned for a future update. If asked for a specific real number or fact about this business (e.g. "what were yesterday's sales", "how much did we waste last week"), say plainly that you don't have that data connected yet rather than guessing, estimating, or inventing a figure. For general questions, restaurant/QSR operations advice, or anything that doesn't require this specific business's private data, answer normally and helpfully.`;

/** Strips the API key out of a string before it's ever logged, in case an SDK error message happened to echo it back. */
function redact(message: string, secret: string | undefined): string {
  return secret ? message.split(secret).join("[redacted]") : message;
}

/**
 * Sends the question to Gemini and returns its reply text.
 * Throws GeminiNotConfiguredError when no key is set, or a generic Error
 * (never the raw SDK error, which could otherwise carry request/response
 * internals) on any other failure -- callers must treat both as "answer
 * generation failed" without echoing internals to the client.
 */
export async function askGemini(question: string, context?: RameshQuery["context"]): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new GeminiNotConfiguredError();

  const contextEntries = context ? Object.entries(context).filter(([, v]) => v) : [];
  const contextLine = contextEntries.length
    ? `\n\n(The user is currently viewing the dashboard filtered to: ${contextEntries.map(([k, v]) => `${k}=${v}`).join(", ")}. This is situational only, not verified business data -- do not treat it as a source of real figures.)`
    : "";

  try {
    const ai = new GoogleGenAI({ apiKey });
    const model = process.env.GEMINI_MODEL || DEFAULT_MODEL;
    const response = await ai.models.generateContent({
      model,
      contents: `${question}${contextLine}`,
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
