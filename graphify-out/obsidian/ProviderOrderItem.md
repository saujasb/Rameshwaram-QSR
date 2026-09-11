---
source_file: "shared-types/providerOrders.ts"
type: "code"
community: "Provider Order Integration (Petpooja/GoSelfServe)"
location: "L18"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Provider_Order_Integration_Petpooja/GoSelfServe
---

# ProviderOrderItem

## Connections
- [[NormalizedPetpoojaOrder]] - `references` [EXTRACTED]
- [[provider-ordersrepository.ts]] - `imports` [EXTRACTED]
- [[providerspetpooja.ts]] - `imports` [EXTRACTED]
- [[shared-typesproviderOrders.ts]] - `contains` [EXTRACTED]

## Source
**From** `shared-types/providerOrders.ts` **(starting line 18):**
```typescript
export interface ProviderOrderItem {
  name: string;
  itemId: string;
  itemCode: string;
  specialNotes: string;
  price: number;
  quantity: number;
  total: number;
  discount: number;
  tax: number;
  categoryName: string;
  addons: ProviderOrderAddon[];
}
```

#graphify/code #graphify/EXTRACTED #community/Provider_Order_Integration_Petpooja/GoSelfServe