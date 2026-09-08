---
source_file: "server/src/entities/provider-orders/repository.ts"
type: "code"
community: "Provider Order Integration (Petpooja/GoSelfServe)"
location: "L55"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Provider_Order_Integration_Petpooja/GoSelfServe
---

# findExistingStmt

## Connections
- [[provider-ordersrepository.ts]] - `contains` [EXTRACTED]

## Source
**From** `server/src/entities/provider-orders/repository.ts` **(starting line 55):**
```typescript
const findExistingStmt = db.prepare(
  `SELECT id, rawPayloadJson FROM provider_orders WHERE provider = ? AND providerOrderId = ?`
);
```

#graphify/code #graphify/EXTRACTED #community/Provider_Order_Integration_Petpooja/GoSelfServe