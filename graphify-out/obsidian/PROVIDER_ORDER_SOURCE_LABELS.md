---
source_file: "shared-types/providerOrders.ts"
type: "code"
community: "Provider Order Integration (Petpooja/GoSelfServe)"
location: "L106"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Provider_Order_Integration_Petpooja/GoSelfServe
---

# PROVIDER_ORDER_SOURCE_LABELS

## Connections
- [[LiveOrdersPage.tsx]] - `imports` [EXTRACTED]
- [[ProviderOrderDetailModal.tsx]] - `imports` [EXTRACTED]
- [[shared-typesproviderOrders.ts]] - `contains` [EXTRACTED]

## Source
**From** `shared-types/providerOrders.ts` **(starting line 106):**
```typescript
export const PROVIDER_ORDER_SOURCE_LABELS: Record<ProviderOrderSource, string> = {
  pos: "POS",
  zomato: "Zomato",
  swiggy: "Swiggy",
  other: "Aggregator",
};
```

#graphify/code #graphify/EXTRACTED #community/Provider_Order_Integration_Petpooja/GoSelfServe