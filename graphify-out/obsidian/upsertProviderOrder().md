---
source_file: "server/src/entities/provider-orders/repository.ts"
type: "code"
community: "Provider Order Integration (Petpooja/GoSelfServe)"
location: "L173"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Provider_Order_Integration_Petpooja/GoSelfServe
---

# upsertProviderOrder()

## Connections
- [[provider-ordersrepository.ts]] - `contains` [EXTRACTED]
- [[rowToOrder()]] - `calls` [EXTRACTED]
- [[webhook.ts]] - `imports` [EXTRACTED]

## Source
**From** `server/src/entities/provider-orders/repository.ts` **(starting line 173):**
```typescript
export function upsertProviderOrder(input: NormalizedPetpoojaOrder): UpsertOutcome {
  const existing = findExistingStmt.get(input.provider, input.providerOrderId) as
    | { id: string; rawPayloadJson: string }
    | undefined;

  const now = new Date().toISOString();
  const rawPayloadJson = JSON.stringify(input.rawPayload);
  const isDuplicate = existing != null && existing.rawPayloadJson === rawPayloadJson;
  const id = existing?.id ?? randomUUID();

  upsertStmt.run({
    id,
    provider: input.provider,
    providerOrderId: input.providerOrderId,
    providerInvoiceId: input.providerInvoiceId,
    restaurantId: input.restaurantId,
    restaurantName: input.restaurantName,
    status: input.status,
    orderType: input.orderType,
    orderFrom: input.orderFrom,
    orderFromLabel: input.orderFromLabel,
    subOrderType: input.subOrderType,
    paymentType: input.paymentType,
    tableNo: input.tableNo,
    noOfPersons: input.noOfPersons,
    customerName: input.customerName,
    customerPhone: input.customerPhone,
    coreTotal: input.coreTotal,
    taxTotal: input.taxTotal,
    discountTotal: input.discountTotal,
    packagingCharge: input.packagingCharge,
    serviceCharge: input.serviceCharge,
    deliveryCharges: input.deliveryCharges,
    roundOff: input.roundOff,
    totalAmount: input.totalAmount,
    comment: input.comment,
    biller: input.biller,
    assignee: input.assignee,
    tokenNo: input.tokenNo,
    itemCount: input.items.length,
    itemsJson: JSON.stringify(input.items),
    taxesJson: JSON.stringify(input.taxes),
    discountsJson: JSON.stringify(input.discounts),
    partPaymentsJson: JSON.stringify(input.partPayments),
    rawPayloadJson,
    providerCreatedAt: input.providerCreatedAt,
    receivedAt: now,
    createdAt: now,
    updatedAt: now,
  });

  const row = getByIdStmt.get(id);
  return { order: rowToOrder(row), isNew: !existing, isDuplicate: !!existing && isDuplicate };
}
```

#graphify/code #graphify/EXTRACTED #community/Provider_Order_Integration_Petpooja/GoSelfServe