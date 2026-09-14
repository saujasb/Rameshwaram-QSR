import { Router } from "express";
import type { RameshQuery } from "../../../../shared-types/ramesh.js";
import { answer, suggestionsForCurrentData } from "./engine.js";

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

  try {
    res.json(await answer({ question, context: body?.context }));
  } catch (err) {
    // Ramesh must never 500 on an odd question -- that would look like a data
    // problem to a business user. Surface it as an honest inability instead.
    console.error("[ramesh] answer failed:", err);
    const fallbackSuggestions = await suggestionsForCurrentData().then(
      (s) => s.suggestions,
      () => [] as string[]
    );
    res.json({
      intent: "unsupported",
      answer: "I couldn't work that question out from the data I have. Try asking about sales, production or wastage for a specific date or product.",
      dataUsed: null,
      calculation: [],
      conclusion: "",
      evidence: [],
      drilldownQuery: null,
      insufficientData: true,
      refusalReason: null,
      suggestions: fallbackSuggestions,
    });
  }
});

rameshRouter.get("/suggestions", async (_req, res) => {
  res.json(await suggestionsForCurrentData());
});
