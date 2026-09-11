---
source_file: "server/src/entities/provider-orders/webhook.ts"
type: "code"
community: "Provider Order Integration (Petpooja/GoSelfServe)"
location: "L12"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Provider_Order_Integration_Petpooja/GoSelfServe
---

# providerWebhookRouter

## Connections
- [[index.ts]] - `imports` [EXTRACTED]
- [[webhook.ts]] - `contains` [EXTRACTED]

## Source
**From** `server/src/entities/provider-orders/webhook.ts` **(starting line 12):**
```typescript
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
```

#graphify/code #graphify/EXTRACTED #community/Provider_Order_Integration_Petpooja/GoSelfServe