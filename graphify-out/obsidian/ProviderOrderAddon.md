---
source_file: "shared-types/providerOrders.ts"
type: "code"
community: "Provider Order Integration (Petpooja/GoSelfServe)"
location: "L9"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Provider_Order_Integration_Petpooja/GoSelfServe
---

# ProviderOrderAddon

## Connections
- [[provider-ordersrepository.ts]] - `imports` [EXTRACTED]
- [[providerspetpooja.ts]] - `imports` [EXTRACTED]
- [[shared-typesproviderOrders.ts]] - `contains` [EXTRACTED]

## Source
**From** `shared-types/providerOrders.ts` **(starting line 9):**
```typescript
export interface ProviderOrderAddon {
  groupName: string;
  name: string;
  price: number;
  quantity: number;
  addonId: string;
  addonGroupId: string;
}
```

#graphify/code #graphify/EXTRACTED #community/Provider_Order_Integration_Petpooja/GoSelfServe