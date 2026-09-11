---
source_file: "shared-types/providerOrders.ts"
type: "code"
community: "Provider Order Integration (Petpooja/GoSelfServe)"
location: "L100"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Provider_Order_Integration_Petpooja/GoSelfServe
---

# PROVIDER_ORDER_TYPE_LABELS

## Connections
- [[LiveOrdersPage.tsx]] - `imports` [EXTRACTED]
- [[ProviderOrderDetailModal.tsx]] - `imports` [EXTRACTED]
- [[shared-typesproviderOrders.ts]] - `contains` [EXTRACTED]

## Source
**From** `shared-types/providerOrders.ts` **(starting line 100):**
```typescript
export const PROVIDER_ORDER_TYPE_LABELS: Record<ProviderOrderType, string> = {
  dine_in: "Dine In",
  pick_up: "Pick Up",
  delivery: "Delivery",
};
```

#graphify/code #graphify/EXTRACTED #community/Provider_Order_Integration_Petpooja/GoSelfServe