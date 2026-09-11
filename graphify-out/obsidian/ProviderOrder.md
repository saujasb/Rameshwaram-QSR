---
source_file: "shared-types/providerOrders.ts"
type: "code"
community: "Provider Order Integration (Petpooja/GoSelfServe)"
location: "L52"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Provider_Order_Integration_Petpooja/GoSelfServe
---

# ProviderOrder

## Connections
- [[BaseRecord]] - `inherits` [EXTRACTED]
- [[LiveOrdersPage.tsx]] - `imports` [EXTRACTED]
- [[ProviderOrderDetailModal.tsx]] - `imports` [EXTRACTED]
- [[UpsertOutcome]] - `references` [EXTRACTED]
- [[apiproviderOrders.ts]] - `imports` [EXTRACTED]
- [[goselfserve.ts]] - `imports` [EXTRACTED]
- [[provider-ordersrepository.ts]] - `imports` [EXTRACTED]
- [[shared-typesproviderOrders.ts]] - `contains` [EXTRACTED]

## Source
**From** `shared-types/providerOrders.ts` **(starting line 52):**
```typescript
export interface ProviderOrder extends BaseRecord {
  provider: ProviderName;
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
  itemCount: number;
  items: ProviderOrderItem[];
  taxes: ProviderOrderTax[];
  discounts: ProviderOrderDiscount[];
  partPayments: ProviderOrderPartPayment[];
  providerCreatedAt: string;
  receivedAt: string;
  goselfserveSyncStatus: GoSelfServeSyncStatus;
  goselfserveSyncError: string | null;
  goselfserveSyncedAt: string | null;
}
```

#graphify/code #graphify/EXTRACTED #community/Provider_Order_Integration_Petpooja/GoSelfServe