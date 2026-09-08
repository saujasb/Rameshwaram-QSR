---
source_file: "shared-types/providerOrders.ts"
type: "code"
community: "Provider Order Integration (Petpooja/GoSelfServe)"
location: "L92"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Provider_Order_Integration_Petpooja/GoSelfServe
---

# ProviderOrderFilter

## Connections
- [[LiveOrdersPage.tsx]] - `imports` [EXTRACTED]
- [[apiproviderOrders.ts]] - `imports` [EXTRACTED]
- [[provider-ordersrepository.ts]] - `imports` [EXTRACTED]
- [[provider-ordersroutes.ts]] - `imports` [EXTRACTED]
- [[shared-typesproviderOrders.ts]] - `contains` [EXTRACTED]

## Source
**From** `shared-types/providerOrders.ts` **(starting line 92):**
```typescript
export interface ProviderOrderFilter {
  provider?: ProviderName;
  status?: ProviderOrderStatus;
  orderType?: ProviderOrderType;
  orderFrom?: ProviderOrderSource;
  search?: string;
}
```

#graphify/code #graphify/EXTRACTED #community/Provider_Order_Integration_Petpooja/GoSelfServe