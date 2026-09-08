---
source_file: "server/src/entities/provider-orders/providers/petpooja.ts"
type: "code"
community: "Provider Order Integration (Petpooja/GoSelfServe)"
location: "L25"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Provider_Order_Integration_Petpooja/GoSelfServe
---

# num()

## Connections
- [[mapAddon()]] - `calls` [EXTRACTED]
- [[mapDiscount()]] - `calls` [EXTRACTED]
- [[mapItem()]] - `calls` [EXTRACTED]
- [[mapPartPayment()]] - `calls` [EXTRACTED]
- [[mapTax()]] - `calls` [EXTRACTED]
- [[normalizePetpoojaPayload()]] - `calls` [EXTRACTED]
- [[providerspetpooja.ts]] - `contains` [EXTRACTED]

## Source
**From** `server/src/entities/provider-orders/providers/petpooja.ts` **(starting line 25):**
```typescript
function num(v: unknown, fallback = 0): number {
  if (v == null || v === "") return fallback;
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}
```

#graphify/code #graphify/EXTRACTED #community/Provider_Order_Integration_Petpooja/GoSelfServe