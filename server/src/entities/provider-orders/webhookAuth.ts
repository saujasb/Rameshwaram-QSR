import { createHash, timingSafeEqual } from "node:crypto";
import type { Request } from "express";

// Shared-secret checks for the inbound order webhooks. Petpooja and
// GoSelfServe are external systems, not dashboard users, so they never go
// through dashboard login -- they prove who they are with a token only they
// and this server know.

/** Constant-time string comparison (hashing first so length differences don't leak either). */
export function safeEqual(a: string, b: string): boolean {
  const ha = createHash("sha256").update(a).digest();
  const hb = createHash("sha256").update(b).digest();
  return timingSafeEqual(ha, hb);
}

export type WebhookAuthResult = { ok: true; enforced: boolean } | { ok: false };

const warned = new Set<string>();
function warnUnenforced(provider: string, envName: string): void {
  if (warned.has(provider)) return;
  warned.add(provider);
  console.warn(`[webhooks] ${envName} is not set -- ${provider} webhook requests are NOT being authenticated.`);
}

/**
 * Enforced whenever the expected token env var is set. If it isn't set the
 * request is accepted (so an unconfigured environment keeps receiving live
 * orders) unless WEBHOOK_AUTH_REQUIRED=true, which makes a missing token
 * configuration fail closed.
 */
function check(provider: string, envName: string, received: string | undefined): WebhookAuthResult {
  const expected = process.env[envName];
  if (!expected) {
    if (/^(1|true|yes)$/i.test(process.env.WEBHOOK_AUTH_REQUIRED ?? "")) return { ok: false };
    warnUnenforced(provider, envName);
    return { ok: true, enforced: false };
  }
  if (!received) return { ok: false };
  return safeEqual(received, expected) ? { ok: true, enforced: true } : { ok: false };
}

/**
 * Petpooja (Global API Documentation): "If required, we can send a static
 * token in the body of the payload in the key named 'token'." Petpooja is
 * already sending one, so setting PETPOOJA_WEBHOOK_TOKEN to that value turns
 * enforcement on without any change on Petpooja's side.
 */
export function verifyPetpoojaWebhook(body: unknown): WebhookAuthResult {
  const token = body && typeof body === "object" ? (body as Record<string, unknown>).token : undefined;
  return check("Petpooja", "PETPOOJA_WEBHOOK_TOKEN", typeof token === "string" ? token : undefined);
}

/**
 * GoSelfServe has no vendor-defined auth contract for pushes to us, so we
 * mint our own secret (GOSELFSERVE_WEBHOOK_TOKEN). Accepted in whichever form
 * their integration can send: an `x-webhook-token` header, an
 * `Authorization: Bearer` header, or a `?token=` query parameter on the
 * webhook URL they're given.
 */
export function verifyGoSelfServeWebhook(req: Request): WebhookAuthResult {
  const header = req.header("x-webhook-token");
  const bearer = req.header("authorization")?.replace(/^Bearer\s+/i, "");
  const queryToken = typeof req.query.token === "string" ? req.query.token : undefined;
  return check("GoSelfServe", "GOSELFSERVE_WEBHOOK_TOKEN", header || bearer || queryToken);
}
