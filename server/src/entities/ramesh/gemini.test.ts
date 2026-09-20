import { test } from "node:test";
import assert from "node:assert/strict";
import { askGemini, GeminiNotConfiguredError, isGeminiConfigured } from "./gemini.js";

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
