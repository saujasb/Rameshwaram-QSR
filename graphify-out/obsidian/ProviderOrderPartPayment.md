---
source_file: "shared-types/providerOrders.ts"
type: "code"
community: "Provider Order Integration (Petpooja/GoSelfServe)"
location: "L46"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Provider_Order_Integration_Petpooja/GoSelfServe
---

# ProviderOrderPartPayment

## Connections
- [[NormalizedPetpoojaOrder]] - `references` [EXTRACTED]
- [[provider-ordersrepository.ts]] - `imports` [EXTRACTED]
- [[providerspetpooja.ts]] - `imports` [EXTRACTED]
- [[shared-typesproviderOrders.ts]] - `contains` [EXTRACTED]

## Source
**From** `shared-types/providerOrders.ts` **(starting line 46):**
```typescript
export interface ProviderOrderPartPayment {
  paymentType: string;
  amount: number;
  customPaymentType: string;
}
```

#graphify/code #graphify/EXTRACTED #community/Provider_Order_Integration_Petpooja/GoSelfServe