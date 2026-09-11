---
source_file: "server/src/entities/provider-orders/repository.ts"
type: "code"
community: "Provider Order Integration (Petpooja/GoSelfServe)"
location: "L292"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Provider_Order_Integration_Petpooja/GoSelfServe
---

# recordWebhookEvent()

## Connections
- [[provider-ordersrepository.ts]] - `contains` [EXTRACTED]
- [[redactTokens()]] - `calls` [EXTRACTED]
- [[webhook.ts]] - `imports` [EXTRACTED]

## Source
**From** `server/src/entities/provider-orders/repository.ts` **(starting line 292):**
```typescript
export function recordWebhookEvent(input: {
  provider: string;
  ok: boolean;
  httpStatus: number;
  providerOrderId?: string | null;
  duplicate?: boolean;
  error?: string | null;
  body: unknown;
}): void {
  insertEventStmt.run({
    id: randomUUID(),
    provider: input.provider,
    receivedAt: new Date().toISOString(),
    ok: input.ok ? 1 : 0,
    httpStatus: input.httpStatus,
    providerOrderId: input.providerOrderId ?? null,
    duplicate: input.duplicate ? 1 : 0,
    error: input.error ?? null,
    bodyJson: JSON.stringify(redactTokens(input.body)),
  });
}
```

#graphify/code #graphify/EXTRACTED #community/Provider_Order_Integration_Petpooja/GoSelfServe