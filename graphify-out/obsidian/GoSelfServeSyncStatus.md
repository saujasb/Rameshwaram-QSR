---
source_file: "shared-types/providerOrders.ts"
type: "code"
community: "Provider Order Integration (Petpooja/GoSelfServe)"
location: "L7"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Provider_Order_Integration_Petpooja/GoSelfServe
---

# GoSelfServeSyncStatus

## Connections
- [[shared-typesproviderOrders.ts]] - `contains` [EXTRACTED]

## Source
**From** `shared-types/providerOrders.ts` **(starting line 7):**
```typescript
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