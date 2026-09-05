import { Router } from "express";
import { normalizePetpoojaPayload, PetpoojaPayloadError } from "./providers/petpooja.js";
import { recordWebhookEvent, upsertProviderOrder } from "./repository.js";
import { syncOrderStatusToGoSelfServe } from "./goselfserve.js";

// Global API Documentation.pdf: "Webhook Authentication: The webhook should be
// non-authenticated. If required, we can send a static token in the body of
// the payload in the key named 'token'." -- so token validation is optional
// and only enforced when PETPOOJA_WEBHOOK_TOKEN is configured.
const EXPECTED_TOKEN = process.env.PETPOOJA_WEBHOOK_TOKEN;

export const providerWebhookRouter: Router = Router();

providerWebhookRouter.post("/petpooja/order", (req, res) => {
  const body = req.body;

  if (EXPECTED_TOKEN) {
    const receivedToken = typeof body?.token === "string" ? body.token : undefined;
    if (receivedToken !== EXPECTED_TOKEN) {
      recordWebhookEvent({ provider: "petpooja", ok: false, httpStatus: 401, error: "Invalid or missing token.", body });
      res.status(401).json({ error: "Invalid or missing token." });
      return;
    }
  }

  let normalized;
  try {
    normalized = normalizePetpoojaPayload(body);
  } catch (err) {
    const message = err instanceof PetpoojaPayloadError ? err.message : "Invalid payload.";
    recordWebhookEvent({ provider: "petpooja", ok: false, httpStatus: 400, error: message, body });
    res.status(400).json({ error: message });
    return;
  }

  try {
    const { order, isNew, isDuplicate } = upsertProviderOrder(normalized);
    recordWebhookEvent({
      provider: "petpooja",
      ok: true,
      httpStatus: 200,
      providerOrderId: order.providerOrderId,
      duplicate: isDuplicate,
      body,
    });
    // Acknowledge Petpooja immediately; GoSelfServe's availability/latency must
    // never hold up or fail the Petpooja webhook response.
    res.status(200).json({ ok: true, id: order.id, isNew, isDuplicate });
    void syncOrderStatusToGoSelfServe(order).catch((err) => {
      console.error("[provider-orders] GoSelfServe sync threw unexpectedly:", err instanceof Error ? err.message : err);
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unexpected error while saving the order.";
    console.error("[provider-orders] Petpooja webhook processing failed:", message);
    recordWebhookEvent({ provider: "petpooja", ok: false, httpStatus: 500, error: message, body });
    res.status(500).json({ error: "Failed to process order." });
  }
});
