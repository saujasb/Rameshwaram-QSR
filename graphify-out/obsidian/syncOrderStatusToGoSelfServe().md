---
source_file: "server/src/entities/provider-orders/goselfserve.ts"
type: "code"
community: "Provider Order Integration (Petpooja/GoSelfServe)"
location: "L43"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Provider_Order_Integration_Petpooja/GoSelfServe
---

# syncOrderStatusToGoSelfServe()

## Connections
- [[buildStatusPayload()]] - `calls` [EXTRACTED]
- [[goselfserve.ts]] - `contains` [EXTRACTED]
- [[markGoSelfServeNotConfigured()]] - `calls` [EXTRACTED]
- [[markGoSelfServeSyncResult()]] - `calls` [EXTRACTED]
- [[webhook.ts]] - `imports` [EXTRACTED]

## Source
**From** `server/src/entities/provider-orders/goselfserve.ts` **(starting line 43):**
```typescript
export async function syncOrderStatusToGoSelfServe(order: ProviderOrder): Promise<void> {
  if (!API_TOKEN && !API_KEY) {
    markGoSelfServeNotConfigured(order.id);
    return;
  }

  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (API_TOKEN) headers["x-api-token"] = API_TOKEN;
  if (API_KEY) headers["x-api-key"] = API_KEY;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(`${BASE_URL}/order/status`, {
      method: "POST",
      headers,
      body: JSON.stringify(buildStatusPayload(order)),
      signal: controller.signal,
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      markGoSelfServeSyncResult(order.id, false, `HTTP ${res.status}: ${text.slice(0, 300)}`);
      return;
    }
    markGoSelfServeSyncResult(order.id, true, null);
  } catch (err) {
    markGoSelfServeSyncResult(order.id, false, err instanceof Error ? err.message : String(err));
  } finally {
    clearTimeout(timeout);
  }
}
```

#graphify/code #graphify/EXTRACTED #community/Provider_Order_Integration_Petpooja/GoSelfServe