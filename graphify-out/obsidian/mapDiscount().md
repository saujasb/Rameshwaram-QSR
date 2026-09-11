---
source_file: "server/src/entities/provider-orders/providers/petpooja.ts"
type: "code"
community: "Provider Order Integration (Petpooja/GoSelfServe)"
location: "L85"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Provider_Order_Integration_Petpooja/GoSelfServe
---

# mapDiscount()

## Connections
- [[normalizePetpoojaPayload()]] - `indirect_call` [INFERRED]
- [[num()]] - `calls` [EXTRACTED]
- [[providerspetpooja.ts]] - `contains` [EXTRACTED]

## Source
**From** `server/src/entities/provider-orders/providers/petpooja.ts` **(starting line 85):**
```typescript
function mapDiscount(raw: any): ProviderOrderDiscount {
  return { title: str(raw?.title), type: str(raw?.type), rate: num(raw?.rate), amount: num(raw?.amount) };
}
```

#graphify/code #graphify/EXTRACTED #community/Provider_Order_Integration_Petpooja/GoSelfServe