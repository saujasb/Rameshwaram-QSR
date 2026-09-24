import { test, afterEach } from "node:test";
import assert from "node:assert/strict";
import type { Request } from "express";
import { safeEqual, verifyGoSelfServeWebhook, verifyPetpoojaWebhook } from "./webhookAuth.js";

const saved = { ...process.env };
afterEach(() => {
  for (const k of ["PETPOOJA_WEBHOOK_TOKEN", "GOSELFSERVE_WEBHOOK_TOKEN", "WEBHOOK_AUTH_REQUIRED"]) {
    if (saved[k] === undefined) delete process.env[k];
    else process.env[k] = saved[k];
  }
});

function fakeReq(headers: Record<string, string> = {}, query: Record<string, string> = {}): Request {
  const lower = Object.fromEntries(Object.entries(headers).map(([k, v]) => [k.toLowerCase(), v]));
  return { header: (name: string) => lower[name.toLowerCase()], query } as unknown as Request;
}

test("Petpooja: correct body token accepted, wrong/missing rejected once configured", () => {
  process.env.PETPOOJA_WEBHOOK_TOKEN = "pp-secret";
  assert.deepEqual(verifyPetpoojaWebhook({ token: "pp-secret", properties: {} }), { ok: true, enforced: true });
  assert.equal(verifyPetpoojaWebhook({ token: "wrong" }).ok, false);
  assert.equal(verifyPetpoojaWebhook({}).ok, false);
  assert.equal(verifyPetpoojaWebhook(null).ok, false);
  assert.equal(verifyPetpoojaWebhook({ token: ["pp-secret"] }).ok, false);
});

test("Petpooja: unconfigured stays open (live flow preserved) unless WEBHOOK_AUTH_REQUIRED", () => {
  delete process.env.PETPOOJA_WEBHOOK_TOKEN;
  assert.deepEqual(verifyPetpoojaWebhook({}), { ok: true, enforced: false });
  process.env.WEBHOOK_AUTH_REQUIRED = "true";
  assert.equal(verifyPetpoojaWebhook({ token: "anything" }).ok, false);
});

test("GoSelfServe: header, bearer or ?token= accepted; wrong rejected", () => {
  process.env.GOSELFSERVE_WEBHOOK_TOKEN = "gss-secret";
  assert.equal(verifyGoSelfServeWebhook(fakeReq({ "x-webhook-token": "gss-secret" })).ok, true);
  assert.equal(verifyGoSelfServeWebhook(fakeReq({ authorization: "Bearer gss-secret" })).ok, true);
  assert.equal(verifyGoSelfServeWebhook(fakeReq({}, { token: "gss-secret" })).ok, true);
  assert.equal(verifyGoSelfServeWebhook(fakeReq({ "x-webhook-token": "nope" })).ok, false);
  assert.equal(verifyGoSelfServeWebhook(fakeReq()).ok, false);
});

test("safeEqual", () => {
  assert.ok(safeEqual("abc", "abc"));
  assert.ok(!safeEqual("abc", "abd"));
  assert.ok(!safeEqual("abc", "abcd"));
});
