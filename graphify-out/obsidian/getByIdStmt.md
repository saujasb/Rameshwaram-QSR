---
source_file: "server/src/entities/provider-orders/repository.ts"
type: "code"
community: "Provider Order Integration (Petpooja/GoSelfServe)"
location: "L113"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Provider_Order_Integration_Petpooja/GoSelfServe
---

# getByIdStmt

## Connections
- [[provider-ordersrepository.ts]] - `contains` [EXTRACTED]

## Source
**From** `server/src/entities/provider-orders/repository.ts` **(starting line 113):**
```typescript
const getByIdStmt = db.prepare(`SELECT * FROM provider_orders WHERE id = ?`);

function rowToOrder(row: any): ProviderOrder {
  return {
    id: row.id,
    provider: row.provider,
    providerOrderId: row.providerOrderId,
    providerInvoiceId: row.providerInvoiceId,
    restaurantId: row.restaurantId,
    restaurantName: row.restaurantName,
    status: row.status,
    orderType: row.orderType,
    orderFrom: row.orderFrom,
    orderFromLabel: row.orderFromLabel,
    subOrderType: row.subOrderType,
    paymentType: row.paymentType,
    tableNo: row.tableNo,
    noOfPersons: row.noOfPersons,
    customerName: row.customerName,
    customerPhone: row.customerPhone,
    coreTotal: row.coreTotal,
    taxTotal: row.taxTotal,
    discountTotal: row.discountTotal,
    packagingCharge: row.packagingCharge,
    serviceCharge: row.serviceCharge,
    deliveryCharges: row.deliveryCharges,
    roundOff: row.roundOff,
    totalAmount: row.totalAmount,
    comment: row.comment,
    biller: row.biller,
    assignee: row.assignee,
    tokenNo: row.tokenNo,
    itemCount: row.itemCount,
    items: JSON.parse(row.itemsJson),
    taxes: JSON.parse(row.taxesJson),
    discounts: JSON.parse(row.discountsJson),
    partPayments: JSON.parse(row.partPaymentsJson),
    providerCreatedAt: row.providerCreatedAt,
    receivedAt: row.receivedAt,
    goselfserveSyncStatus: row.goselfserveSyncStatus,
    goselfserveSyncError: row.goselfserveSyncError,
    goselfserveSyncedAt: row.goselfserveSyncedAt,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}
```

#graphify/code #graphify/EXTRACTED #community/Provider_Order_Integration_Petpooja/GoSelfServe