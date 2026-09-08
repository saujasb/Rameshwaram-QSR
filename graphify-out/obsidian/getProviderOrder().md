---
source_file: "server/src/entities/provider-orders/repository.ts"
type: "code"
community: "Provider Order Integration (Petpooja/GoSelfServe)"
location: "L228"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Provider_Order_Integration_Petpooja/GoSelfServe
---

# getProviderOrder()

## Connections
- [[provider-ordersrepository.ts]] - `contains` [EXTRACTED]
- [[provider-ordersroutes.ts]] - `imports` [EXTRACTED]
- [[rowToOrder()]] - `calls` [EXTRACTED]

## Source
**From** `server/src/entities/provider-orders/repository.ts` **(starting line 228):**
```typescript
export function getProviderOrder(id: string): ProviderOrder | undefined {
  const row = getByIdStmt.get(id);
  return row ? rowToOrder(row) : undefined;
}
```

#graphify/code #graphify/EXTRACTED #community/Provider_Order_Integration_Petpooja/GoSelfServe