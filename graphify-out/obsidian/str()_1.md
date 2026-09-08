---
source_file: "server/src/entities/provider-orders/routes.ts"
type: "code"
community: "Provider Order Integration (Petpooja/GoSelfServe)"
location: "L7"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Provider_Order_Integration_Petpooja/GoSelfServe
---

# str()

## Connections
- [[provider-ordersroutes.ts]] - `contains` [EXTRACTED]

## Source
**From** `server/src/entities/provider-orders/routes.ts` **(starting line 7):**
```typescript
function str(v: unknown): string | undefined {
  return typeof v === "string" && v.length > 0 ? v : undefined;
}
```

#graphify/code #graphify/EXTRACTED #community/Provider_Order_Integration_Petpooja/GoSelfServe