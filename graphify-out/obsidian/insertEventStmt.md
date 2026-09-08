---
source_file: "server/src/entities/provider-orders/repository.ts"
type: "code"
community: "Provider Order Integration (Petpooja/GoSelfServe)"
location: "L274"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Provider_Order_Integration_Petpooja/GoSelfServe
---

# insertEventStmt

## Connections
- [[provider-ordersrepository.ts]] - `contains` [EXTRACTED]

## Source
**From** `server/src/entities/provider-orders/repository.ts` **(starting line 274):**
```typescript
const insertEventStmt = db.prepare(`
  INSERT INTO provider_webhook_events (id, provider, receivedAt, ok, httpStatus, providerOrderId, duplicate, error, bodyJson)
  VALUES (@id, @provider, @receivedAt, @ok, @httpStatus, @providerOrderId, @duplicate, @error, @bodyJson)
`);
```

#graphify/code #graphify/EXTRACTED #community/Provider_Order_Integration_Petpooja/GoSelfServe