---
source_file: "server/src/entities/provider-orders/repository.ts"
type: "code"
community: "Provider Order Integration (Petpooja/GoSelfServe)"
location: "L19"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Provider_Order_Integration_Petpooja/GoSelfServe
---

# NormalizedPetpoojaOrder

## Connections
- [[ProviderOrderDiscount]] - `references` [EXTRACTED]
- [[ProviderOrderItem]] - `references` [EXTRACTED]
- [[ProviderOrderPartPayment]] - `references` [EXTRACTED]
- [[ProviderOrderSource]] - `references` [EXTRACTED]
- [[ProviderOrderStatus]] - `references` [EXTRACTED]
- [[ProviderOrderTax]] - `references` [EXTRACTED]
- [[ProviderOrderType]] - `references` [EXTRACTED]
- [[provider-ordersrepository.ts]] - `contains` [EXTRACTED]
- [[providerspetpooja.ts]] - `imports` [EXTRACTED]

## Source
**From** `server/src/entities/provider-orders/repository.ts` **(starting line 19):**
```typescript
export interface NormalizedPetpoojaOrder {
  provider: "petpooja";
  providerOrderId: string;
  providerInvoiceId: string;
  restaurantId: string;
  restaurantName: string;
  status: ProviderOrderStatus;
  orderType: ProviderOrderType;
  orderFrom: ProviderOrderSource;
  orderFromLabel: string;
  subOrderType: string;
  paymentType: string;
  tableNo: string;
  noOfPersons: number;
  customerName: string;
  customerPhone: string;
  coreTotal: number;
  taxTotal: number;
  discountTotal: number;
  packagingCharge: number;
  serviceCharge: number;
  deliveryCharges: number;
  roundOff: number;
  totalAmount: number;
  comment: string;
  biller: string;
  assignee: string;
  tokenNo: string;
  items: ProviderOrderItem[];
  taxes: ProviderOrderTax[];
  discounts: ProviderOrderDiscount[];
  partPayments: ProviderOrderPartPayment[];
  providerCreatedAt: string;
  rawPayload: unknown;
}
```

#graphify/code #graphify/EXTRACTED #community/Provider_Order_Integration_Petpooja/GoSelfServe