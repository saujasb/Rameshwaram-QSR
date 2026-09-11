---
source_file: "server/src/entities/provider-orders/repository.ts"
type: "code"
community: "Provider Order Integration (Petpooja/GoSelfServe)"
location: "L270"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Provider_Order_Integration_Petpooja/GoSelfServe
---

# markGoSelfServeNotConfigured()

## Connections
- [[goselfserve.ts]] - `imports` [EXTRACTED]
- [[provider-ordersrepository.ts]] - `contains` [EXTRACTED]
- [[syncOrderStatusToGoSelfServe()]] - `calls` [EXTRACTED]

## Source
**From** `server/src/entities/provider-orders/repository.ts` **(starting line 270):**
```typescript
export function markGoSelfServeNotConfigured(id: string): void {
  db.prepare(`UPDATE provider_orders SET goselfserveSyncStatus = 'not_configured' WHERE id = ?`).run(id);
}
```

#graphify/code #graphify/EXTRACTED #community/Provider_Order_Integration_Petpooja/GoSelfServe