import { Router } from "express";
import { waitUntil } from "@vercel/functions";
import { normalizePetpoojaPayload, PetpoojaPayloadError } from "./providers/petpooja.js";
import { normalizeGoSelfServeOrder, GoSelfServePayloadError } from "./providers/goselfserve.js";
import { recordWebhookEvent, upsertProviderOrder } from "./repository.js";
import { syncOrderStatusToGoSelfServe } from "./goselfserve.js";
import { verifyGoSelfServeWebhook, verifyPetpoojaWebhook } from "./webhookAuth.js";
import { asyncRoute } from "../../shared/asyncRoute.js";

// Token checks live in webhookAuth.ts (constant-time compare, read from env
// per request). See that file for each provider's auth contract.

export const providerWebhookRouter: Router = Router();

providerWebhookRouter.post("/petpooja/order", asyncRoute(async (req, res) => {
  const body = req.body;

  if (!verifyPetpoojaWebhook(body).ok) {
    await recordWebhookEvent({ provider: "petpooja", ok: false, httpStatus: 401, error: "Invalid or missing token.", body });
    res.status(401).json({ error: "Invalid or missing token." });
    return;
  }

  let normalized;
  try {
    normalized = normalizePetpoojaPayload(body);
  } catch (err) {
    const message = err instanceof PetpoojaPayloadError ? err.message : "Invalid payload.";
    await recordWebhookEvent({ provider: "petpooja", ok: false, httpStatus: 400, error: message, body });
    res.status(400).json({ error: message });
    return;
  }

  try {
    const { order, isNew, isDuplicate } = await upsertProviderOrder(normalized);
    await recordWebhookEvent({
      provider: "petpooja",
      ok: true,
      httpStatus: 200,
      providerOrderId: order.providerOrderId,
      duplicate: isDuplicate,
      body,
    });
    // Acknowledge Petpooja immediately; GoSelfServe's availability/latency must
    // never hold up or fail the Petpooja webhook response. On Vercel the
    // function can freeze right after res.json() returns, so the outbound
    // sync is handed to waitUntil() instead of a bare fire-and-forget promise
    // -- it gets to finish even though nothing here awaits it.
    res.status(200).json({ ok: true, id: order.id, isNew, isDuplicate });
    waitUntil(
      syncOrderStatusToGoSelfServe(order).catch((err) => {
        console.error("[provider-orders] GoSelfServe sync threw unexpectedly:", err instanceof Error ? err.message : err);
      })
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unexpected error while saving the order.";
    console.error("[provider-orders] Petpooja webhook processing failed:", message);
    await recordWebhookEvent({ provider: "petpooja", ok: false, httpStatus: 500, error: message, body });
    res.status(500).json({ error: "Failed to process order." });
  }
}));

providerWebhookRouter.post("/goselfserve/order", asyncRoute(async (req, res) => {
  const body = req.body;

  if (!verifyGoSelfServeWebhook(req).ok) {
    await recordWebhookEvent({ provider: "goselfserve", ok: false, httpStatus: 401, error: "Invalid or missing token.", body });
    res.status(401).json({ error: "Invalid or missing token." });
    return;
  }

  let normalized;
  try {
    normalized = normalizeGoSelfServeOrder(body);
  } catch (err) {
    const message = err instanceof GoSelfServePayloadError ? err.message : "Invalid payload.";
    await recordWebhookEvent({ provider: "goselfserve", ok: false, httpStatus: 400, error: message, body });
    res.status(400).json({ error: message });
    return;
  }

  try {
    const { order, isNew, isDuplicate } = await upsertProviderOrder(normalized);
    await recordWebhookEvent({
      provider: "goselfserve",
      ok: true,
      httpStatus: 200,
      providerOrderId: order.providerOrderId,
      duplicate: isDuplicate,
      body,
    });
    // No GoSelfServe status sync here -- these orders originated at
    // GoSelfServe, so relaying their own status back to them would be circular.
    res.status(200).json({ ok: true, id: order.id, isNew, isDuplicate });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unexpected error while saving the order.";
    console.error("[provider-orders] GoSelfServe webhook processing failed:", message);
    await recordWebhookEvent({ provider: "goselfserve", ok: false, httpStatus: 500, error: message, body });
    res.status(500).json({ error: "Failed to process order." });
  }
}));
