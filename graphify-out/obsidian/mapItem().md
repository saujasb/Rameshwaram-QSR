---
source_file: "server/src/entities/provider-orders/providers/petpooja.ts"
type: "code"
community: "Provider Order Integration (Petpooja/GoSelfServe)"
location: "L65"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Provider_Order_Integration_Petpooja/GoSelfServe
---

# mapItem()

## Connections
- [[mapAddon()]] - `indirect_call` [INFERRED]
- [[normalizePetpoojaPayload()]] - `indirect_call` [INFERRED]
- [[num()]] - `calls` [EXTRACTED]
- [[providerspetpooja.ts]] - `contains` [EXTRACTED]

## Source
**From** `server/src/entities/provider-orders/providers/petpooja.ts` **(starting line 65):**
```typescript
function mapItem(raw: any): ProviderOrderItem {
  return {
    name: str(raw?.name),
    itemId: str(raw?.itemid),
    itemCode: str(raw?.itemcode),
    specialNotes: str(raw?.specialnotes),
    price: num(raw?.price),
    quantity: num(raw?.quantity, 1),
    total: num(raw?.total),
    discount: num(raw?.discount),
    tax: num(raw?.tax),
    categoryName: str(raw?.category_name),
    addons: Array.isArray(raw?.addon) ? raw.addon.map(mapAddon) : [],
  };
}
```

#graphify/code #graphify/EXTRACTED #community/Provider_Order_Integration_Petpooja/GoSelfServe