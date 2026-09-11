---
source_file: "server/src/entities/provider-orders/repository.ts"
type: "code"
community: "Provider Order Integration (Petpooja/GoSelfServe)"
location: "L160"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Provider_Order_Integration_Petpooja/GoSelfServe
---

# UpsertOutcome

## Connections
- [[ProviderOrder]] - `references` [EXTRACTED]
- [[provider-ordersrepository.ts]] - `contains` [EXTRACTED]

## Source
**From** `server/src/entities/provider-orders/repository.ts` **(starting line 160):**
```typescript
export interface UpsertOutcome {
  order: ProviderOrder;
  isNew: boolean;
  isDuplicate: boolean;
}
```

#graphify/code #graphify/EXTRACTED #community/Provider_Order_Integration_Petpooja/GoSelfServe