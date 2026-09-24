import { test } from "node:test";
import assert from "node:assert/strict";
import { askGemini, GeminiNotConfiguredError, generateWithRetry, isGeminiConfigured, isTransientGeminiError } from "./gemini.js";

// The exact error body production logged on 2026-09-24.
const GOOGLE_503 =
  '{"error":{"code":503,"message":"This model is currently experiencing high demand. Spikes in demand are usually temporary. Please try again later.","status":"UNAVAILABLE"}}';
const GOOGLE_429 = '{"error":{"code":429,"message":"Resource has been exhausted.","status":"RESOURCE_EXHAUSTED"}}';
const GOOGLE_400 = '{"error":{"code":400,"message":"Invalid request.","status":"INVALID_ARGUMENT"}}';

const noSleep = async () => {};

/** A fake generate() that throws the queued errors in order, then returns the answer. */
function fakeGenerate(failures: string[], answer = "ok") {
  const calls: string[] = [];
  const generate = async (model: string) => {
    calls.push(model);
    const next = failures.shift();
    if (next) throw new Error(next);
    return answer;
  };
  return { generate, calls };
}

test("isGeminiConfigured is false when GEMINI_API_KEY is unset", () => {
  const original = process.env.GEMINI_API_KEY;
  delete process.env.GEMINI_API_KEY;
  try {
    assert.equal(isGeminiConfigured(), false);
  } finally {
    if (original !== undefined) process.env.GEMINI_API_KEY = original;
  }
});

test("isGeminiConfigured is true when GEMINI_API_KEY is set", () => {
  const original = process.env.GEMINI_API_KEY;
  process.env.GEMINI_API_KEY = "test-only-placeholder-not-a-real-key";
  try {
    assert.equal(isGeminiConfigured(), true);
  } finally {
    if (original === undefined) delete process.env.GEMINI_API_KEY;
    else process.env.GEMINI_API_KEY = original;
  }
});

test("askGemini throws GeminiNotConfiguredError (not a crash, no network call) when GEMINI_API_KEY is unset", async () => {
  const original = process.env.GEMINI_API_KEY;
  delete process.env.GEMINI_API_KEY;
  try {
    await assert.rejects(() => askGemini("hello"), GeminiNotConfiguredError);
  } finally {
    if (original !== undefined) process.env.GEMINI_API_KEY = original;
  }
});

test("isTransientGeminiError recognizes Google's 503 and 429 bodies, but not a 400", () => {
  assert.equal(isTransientGeminiError(GOOGLE_503), true);
  assert.equal(isTransientGeminiError(GOOGLE_429), true);
  assert.equal(isTransientGeminiError(GOOGLE_400), false);
  assert.equal(isTransientGeminiError("Gemini returned an empty response."), false);
});

test("generateWithRetry retries a 503 on the primary model and returns the answer once it succeeds", async () => {
  const { generate, calls } = fakeGenerate([GOOGLE_503, GOOGLE_503], "answer");
  const logs: string[] = [];
  const result = await generateWithRetry(generate, "primary", "fallback", (m) => logs.push(m), noSleep);
  assert.equal(result, "answer");
  assert.deepEqual(calls, ["primary", "primary", "primary"]);
  assert.equal(logs.length, 2);
});

test("generateWithRetry falls back to the second model after the primary keeps returning 503", async () => {
  const { generate, calls } = fakeGenerate([GOOGLE_503, GOOGLE_503, GOOGLE_503], "fallback answer");
  const result = await generateWithRetry(generate, "primary", "fallback", () => {}, noSleep);
  assert.equal(result, "fallback answer");
  assert.deepEqual(calls, ["primary", "primary", "primary", "fallback"]);
});

test("generateWithRetry does not retry or fall back on a non-transient error (400)", async () => {
  const { generate, calls } = fakeGenerate([GOOGLE_400]);
  await assert.rejects(() => generateWithRetry(generate, "primary", "fallback", () => {}, noSleep), /INVALID_ARGUMENT/);
  assert.deepEqual(calls, ["primary"]);
});

test("generateWithRetry rethrows when the primary and the fallback both stay at capacity", async () => {
  const { generate, calls } = fakeGenerate([GOOGLE_503, GOOGLE_503, GOOGLE_503, GOOGLE_503]);
  const logs: string[] = [];
  await assert.rejects(() => generateWithRetry(generate, "primary", "fallback", (m) => logs.push(m), noSleep), /UNAVAILABLE/);
  assert.deepEqual(calls, ["primary", "primary", "primary", "fallback"]);
  assert.equal(logs.length, 4);
});

test("generateWithRetry waits between primary retries (0.6s, then 1.5s)", async () => {
  const { generate } = fakeGenerate([GOOGLE_503, GOOGLE_503]);
  const waits: number[] = [];
  await generateWithRetry(generate, "primary", "fallback", () => {}, async (ms) => {
    waits.push(ms);
  });
  assert.deepEqual(waits, [600, 1500]);
});
