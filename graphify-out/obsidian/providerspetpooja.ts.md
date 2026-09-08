---
source_file: "server/src/entities/provider-orders/providers/petpooja.ts"
type: "code"
community: "Provider Order Integration (Petpooja/GoSelfServe)"
location: "L1"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Provider_Order_Integration_Petpooja/GoSelfServe
---

# providers/petpooja.ts

## Connections
- [[NormalizedPetpoojaOrder]] - `imports` [EXTRACTED]
- [[PetpoojaPayloadError]] - `contains` [EXTRACTED]
- [[ProviderOrderAddon]] - `imports` [EXTRACTED]
- [[ProviderOrderDiscount]] - `imports` [EXTRACTED]
- [[ProviderOrderItem]] - `imports` [EXTRACTED]
- [[ProviderOrderPartPayment]] - `imports` [EXTRACTED]
- [[ProviderOrderSource]] - `imports` [EXTRACTED]
- [[ProviderOrderStatus]] - `imports` [EXTRACTED]
- [[ProviderOrderTax]] - `imports` [EXTRACTED]
- [[ProviderOrderType]] - `imports` [EXTRACTED]
- [[mapAddon()]] - `contains` [EXTRACTED]
- [[mapDiscount()]] - `contains` [EXTRACTED]
- [[mapItem()]] - `contains` [EXTRACTED]
- [[mapOrderFrom()]] - `contains` [EXTRACTED]
- [[mapOrderType()]] - `contains` [EXTRACTED]
- [[mapPartPayment()]] - `contains` [EXTRACTED]
- [[mapStatus()]] - `contains` [EXTRACTED]
- [[mapTax()]] - `contains` [EXTRACTED]
- [[normalizePetpoojaPayload()]] - `contains` [EXTRACTED]
- [[num()]] - `contains` [EXTRACTED]
- [[provider-ordersrepository.ts]] - `imports_from` [EXTRACTED]
- [[shared-typesproviderOrders.ts]] - `imports_from` [EXTRACTED]
- [[str()]] - `contains` [EXTRACTED]
- [[webhook.ts]] - `imports_from` [EXTRACTED]

## Source
**From** `server/src/entities/provider-orders/providers/petpooja.ts` **(starting line 1):**
```typescript
// Normalizes the Petpooja "orderdetails" webhook payload (Global API
// Documentation.pdf) into our internal ProviderOrder shape. Field names below
// (order_type, order_from, status values, etc.) are taken verbatim from that
// document's sample payloads and its Order Object Fields table -- nothing here
// is guessed.
import type {
  ProviderOrderAddon,
  ProviderOrderDiscount,
  ProviderOrderItem,
  ProviderOrderPartPayment,
  ProviderOrderSource,
  ProviderOrderStatus,
  ProviderOrderTax,
  ProviderOrderType,
} from "../../../../../shared-types/providerOrders.js";
```

#graphify/code #graphify/EXTRACTED #community/Provider_Order_Integration_Petpooja/GoSelfServe