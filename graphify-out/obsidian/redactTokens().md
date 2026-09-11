---
source_file: "server/src/entities/provider-orders/repository.ts"
type: "code"
community: "Provider Order Integration (Petpooja/GoSelfServe)"
location: "L280"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Provider_Order_Integration_Petpooja/GoSelfServe
---

# redactTokens()

## Connections
- [[provider-ordersrepository.ts]] - `contains` [EXTRACTED]
- [[recordWebhookEvent()]] - `calls` [EXTRACTED]

## Source
**From** `server/src/entities/provider-orders/repository.ts` **(starting line 280):**
```typescript
function redactTokens(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(redactTokens);
  if (value && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      out[k] = /^token$/i.test(k) && v ? "[redacted]" : redactTokens(v);
    }
    return out;
  }
  return value;
}
```

#graphify/code #graphify/EXTRACTED #community/Provider_Order_Integration_Petpooja/GoSelfServe