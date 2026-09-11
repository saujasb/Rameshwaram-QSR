---
source_file: "server/src/entities/provider-orders/repository.ts"
type: "code"
community: "Provider Order Integration (Petpooja/GoSelfServe)"
location: "L264"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Provider_Order_Integration_Petpooja/GoSelfServe
---

# markGoSelfServeSyncResult()

## Connections
- [[goselfserve.ts]] - `imports` [EXTRACTED]
- [[provider-ordersrepository.ts]] - `contains` [EXTRACTED]
- [[syncOrderStatusToGoSelfServe()]] - `calls` [EXTRACTED]

## Source
**From** `server/src/entities/provider-orders/repository.ts` **(starting line 264):**
```typescript
export function markGoSelfServeSyncResult(id: string, ok: boolean, error: string | null): void {
  db.prepare(
    `UPDATE provider_orders SET goselfserveSyncStatus = ?, goselfserveSyncError = ?, goselfserveSyncedAt = ? WHERE id = ?`
  ).run(ok ? "sent" : "failed", error, new Date().toISOString(), id);
}
```

#graphify/code #graphify/EXTRACTED #community/Provider_Order_Integration_Petpooja/GoSelfServe