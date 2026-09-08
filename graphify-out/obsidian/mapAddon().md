---
source_file: "server/src/entities/provider-orders/providers/petpooja.ts"
type: "code"
community: "Provider Order Integration (Petpooja/GoSelfServe)"
location: "L54"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Provider_Order_Integration_Petpooja/GoSelfServe
---

# mapAddon()

## Connections
- [[mapItem()]] - `indirect_call` [INFERRED]
- [[num()]] - `calls` [EXTRACTED]
- [[providerspetpooja.ts]] - `contains` [EXTRACTED]

## Source
**From** `server/src/entities/provider-orders/providers/petpooja.ts` **(starting line 54):**
```typescript
function mapAddon(raw: any): ProviderOrderAddon {
  return {
    groupName: str(raw?.group_name),
    name: str(raw?.name),
    price: num(raw?.price),
    quantity: num(raw?.quantity, 1),
    addonId: str(raw?.addon_id),
    addonGroupId: str(raw?.addon_group_id),
  };
}
```

#graphify/code #graphify/EXTRACTED #community/Provider_Order_Integration_Petpooja/GoSelfServe