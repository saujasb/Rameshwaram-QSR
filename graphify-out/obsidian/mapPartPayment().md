---
source_file: "server/src/entities/provider-orders/providers/petpooja.ts"
type: "code"
community: "Provider Order Integration (Petpooja/GoSelfServe)"
location: "L89"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Provider_Order_Integration_Petpooja/GoSelfServe
---

# mapPartPayment()

## Connections
- [[normalizePetpoojaPayload()]] - `indirect_call` [INFERRED]
- [[num()]] - `calls` [EXTRACTED]
- [[providerspetpooja.ts]] - `contains` [EXTRACTED]

## Source
**From** `server/src/entities/provider-orders/providers/petpooja.ts` **(starting line 89):**
```typescript
function mapPartPayment(raw: any): ProviderOrderPartPayment {
  return {
    paymentType: str(raw?.payment_type),
    amount: num(raw?.amount),
    customPaymentType: str(raw?.custome_payment_type ?? raw?.custom_payment_type),
  };
}
```

#graphify/code #graphify/EXTRACTED #community/Provider_Order_Integration_Petpooja/GoSelfServe