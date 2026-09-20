import { Router } from "express";
import type { RameshAnswer, RameshQuery } from "../../../../shared-types/ramesh.js";
import { suggestionsForCurrentData } from "./engine.js";
import { askGemini, isGeminiConfigured } from "./gemini.js";

export const rameshRouter: Router = Router();

const MAX_QUESTION_CHARS = 500;

// Simple fixed-window limiter. Ramesh is deterministic and cheap, but the
// endpoint still runs SQL aggregations, so a runaway client shouldn't be able
// to hammer it. Dependency-free on purpose.
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 30;
const hits = new Map<string, { count: number; resetAt: number }>();

function rateLimited(key: string): { limited: boolean; retryAfterSec: number } {
  const now = Date.now();
  const entry = hits.get(key);
  if (!entry || now >= entry.resetAt) {
    hits.set(key, { count: 1, resetAt: now + WINDOW_MS });
    // Opportunistic sweep so the map can't grow without bound.
    if (hits.size > 500) {
      for (const [k, v] of hits) if (now >= v.resetAt) hits.delete(k);
    }
    return { limited: false, retryAfterSec: 0 };
  }
  entry.count++;
  if (entry.count > MAX_PER_WINDOW) {
    return { limited: true, retryAfterSec: Math.max(1, Math.ceil((entry.resetAt - now) / 1000)) };
  }
  return { limited: false, retryAfterSec: 0 };
}

rameshRouter.post("/ask", async (req, res) => {
  const { limited, retryAfterSec } = rateLimited(req.ip ?? "unknown");
  if (limited) {
    res.setHeader("Retry-After", String(retryAfterSec));
    res.status(429).json({
      error: "Too many questions at once.",
      detail: `Ramesh accepts up to ${MAX_PER_WINDOW} questions a minute. Try again in ${retryAfterSec}s.`,
    });
    return;
  }

  const body = req.body as Partial<RameshQuery> | undefined;
  const question = typeof body?.question === "string" ? body.question.trim() : "";
  if (!question) {
    res.status(400).json({ error: "A question is required." });
    return;
  }
  if (question.length > MAX_QUESTION_CHARS) {
    res.status(400).json({
      error: "That question is too long.",
      detail: `Keep it under ${MAX_QUESTION_CHARS} characters.`,
    });
    return;
  }

  // Every RameshAnswer field the client's AnswerBody renders conditionally
  // (dataUsed/calculation/insights/conclusion) is safe to leave empty --
  // Gemini-backed answers are plain text for now, not data-grounded
  // computations. See gemini.ts's SYSTEM_INSTRUCTION for why Gemini is told
  // not to invent business figures it doesn't actually have.
  function emptyAnswer(overrides: Partial<RameshAnswer>): RameshAnswer {
    return {
      intent: "general",
      answer: "",
      dataUsed: null,
      calculation: [],
      conclusion: "",
      insights: [],
      evidence: [],
      drilldownQuery: null,
      insufficientData: false,
      refusalReason: null,
      suggestions: [],
      ...overrides,
    };
  }

  if (!isGeminiConfigured()) {
    // Honest configuration state, not a fake answer and not a silent fallback
    // to a different engine -- the client shows this via the existing
    // refusal-rendering path (see RameshWidget.tsx's AnswerBody).
    res.json(
      emptyAnswer({
        intent: "unsupported",
        answer: "Ask Anything isn't set up yet.",
        conclusion: "An administrator needs to configure the Gemini API key on the server before I can answer questions.",
        refusalReason: "not_configured",
      })
    );
    return;
  }

  try {
    const text = await askGemini(question, body?.context);
    res.json(emptyAnswer({ answer: text }));
  } catch (err) {
    // Ask Anything must never 500 on a failed request -- that would look like
    // a data problem to a business user. Surface it as an honest inability
    // instead. askGemini() already strips any SDK internals before this
    // point, so logging `err` here is safe.
    console.error("[ramesh] Gemini answer failed:", err);
    const fallbackSuggestions = await suggestionsForCurrentData().then(
      (s) => s.suggestions,
      () => [] as string[]
    );
    res.json(
      emptyAnswer({
        intent: "unsupported",
        answer: "I couldn't reach the AI service just now. Please try again in a moment.",
        insufficientData: true,
        refusalReason: "provider_error",
        suggestions: fallbackSuggestions,
      })
    );
  }
});

rameshRouter.get("/suggestions", async (_req, res) => {
  res.json(await suggestionsForCurrentData());
});
