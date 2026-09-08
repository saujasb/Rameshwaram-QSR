---
source_file: "shared-types/providerOrders.ts"
type: "code"
community: "Provider Order Integration (Petpooja/GoSelfServe)"
location: "L4"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Provider_Order_Integration_Petpooja/GoSelfServe
---

# ProviderOrderStatus

## Connections
- [[NormalizedPetpoojaOrder]] - `references` [EXTRACTED]
- [[provider-ordersrepository.ts]] - `imports` [EXTRACTED]
- [[providerspetpooja.ts]] - `imports` [EXTRACTED]
- [[shared-typesproviderOrders.ts]] - `contains` [EXTRACTED]

## Source
**From** `shared-types/providerOrders.ts` **(starting line 4):**
```typescript
export type ProviderOrderStatus = "success" | "cancelled";
export type ProviderOrderType = "dine_in" | "pick_up" | "delivery";
export type ProviderOrderSource = "pos" | "zomato" | "swiggy" | "other";
export type GoSelfServeSyncStatus = "not_configured" | "pending" | "sent" | "failed";

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