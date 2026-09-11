---
source_file: "shared-types/providerOrders.ts"
type: "code"
community: "Provider Order Integration (Petpooja/GoSelfServe)"
location: "L39"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Provider_Order_Integration_Petpooja/GoSelfServe
---

# ProviderOrderDiscount

## Connections
- [[NormalizedPetpoojaOrder]] - `references` [EXTRACTED]
- [[provider-ordersrepository.ts]] - `imports` [EXTRACTED]
- [[providerspetpooja.ts]] - `imports` [EXTRACTED]
- [[shared-typesproviderOrders.ts]] - `contains` [EXTRACTED]

## Source
**From** `shared-types/providerOrders.ts` **(starting line 39):**
```typescript
export interface ProviderOrderDiscount {
  title: string;
  type: string;
  rate: number;
  amount: number;
}
```

#graphify/code #graphify/EXTRACTED #community/Provider_Order_Integration_Petpooja/GoSelfServe