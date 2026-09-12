import { Router } from "express";
import { waitUntil } from "@vercel/functions";
import { normalizePetpoojaPayload, PetpoojaPayloadError } from "./providers/petpooja.js";
import { normalizeGoSelfServeOrder, GoSelfServePayloadError } from "./providers/goselfserve.js";
import { recordWebhookEvent, upsertProviderOrder } from "./repository.js";
import { syncOrderStatusToGoSelfServe } from "./goselfserve.js";
import { asyncHandler } from "../../shared/asyncHandler.js";

// Global API Documentation.pdf: "Webhook Authentication: The webhook should be
// non-authenticated. If required, we can send a static token in the body of
// the payload in the key named 'token'." -- so token validation is optional
// and only enforced when PETPOOJA_WEBHOOK_TOKEN is configured.
const EXPECTED_TOKEN = process.env.PETPOOJA_WEBHOOK_TOKEN;

// GoSelfServe's Swagger only documents endpoints hosted on their own server,
// not what they send us -- so unlike Petpooja there's no vendor-specified
// auth contract. Mint our own shared secret, sent back as a header (their
// CreateOrderDto is a strict schema with no room for an extra body field).
const GOSELFSERVE_EXPECTED_TOKEN = process.env.GOSELFSERVE_WEBHOOK_TOKEN;

export const providerWebhookRouter: Router = Router();

providerWebhookRouter.post(
  "/petpooja/order",
  asyncHandler(async (req, res) => {
    const body = req.body;

    if (EXPECTED_TOKEN) {
      const receivedToken = typeof body?.token === "string" ? body.token : undefined;
      if (receivedToken !== EXPECTED_TOKEN) {
        await recordWebhookEvent({ provider: "petpooja", ok: false, httpStatus: 401, error: "Invalid or missing token.", body });
        res.status(401).json({ error: "Invalid or missing token." });
        return;
      }
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
      // never hold up or fail the Petpooja webhook response. The sync itself
      // continues after the response is sent, via waitUntil().
      //
      // Stage 4: this route now runs on both a long-lived Node process
      // (app.listen(), Render/local dev) and a Vercel serverless function
      // (api/index.ts). On Vercel, the platform may freeze or tear down the
      // function's execution environment as soon as the HTTP response is
      // flushed, which would otherwise terminate a bare detached promise
      // before it completes. waitUntil() (from @vercel/functions, Vercel's
      // own documented API for exactly this) tells the platform to keep the
      // invocation alive until the given promise settles.
      //
      // This same call is also safe and correct in every non-Vercel
      // environment (Render, local dev): waitUntil() reads an
      // invocation-scoped context that only Vercel's runtime bridge
      // populates; when that context is absent it is a documented no-op
      // (see @vercel/functions' wait-until.js) and simply returns without
      // throwing, while the promise it was given keeps running exactly as
      // the previous bare `void ...catch(...)` fire-and-forget already did
      // under Node's own event loop. One code path is therefore correct on
      // both platforms -- no environment detection needed.
      //
      // syncOrderStatusToGoSelfServe() itself already persists both success
      // and failure onto the order row (markGoSelfServeSyncResult /
      // markGoSelfServeNotConfigured in ./repository.ts), so a sync failure
      // is recorded, never silently lost; the .catch below only guards
      // against an unhandled rejection in the (currently unreachable, since
      // that function never throws) case of a bug there.
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
  })
);

providerWebhookRouter.post(
  "/goselfserve/order",
  asyncHandler(async (req, res) => {
    const body = req.body;

    if (GOSELFSERVE_EXPECTED_TOKEN) {
      const receivedToken = req.header("x-webhook-token");
      if (receivedToken !== GOSELFSERVE_EXPECTED_TOKEN) {
        await recordWebhookEvent({ provider: "goselfserve", ok: false, httpStatus: 401, error: "Invalid or missing token.", body });
        res.status(401).json({ error: "Invalid or missing token." });
        return;
      }
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
  })
);
