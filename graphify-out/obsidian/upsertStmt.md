---
source_file: "server/src/entities/provider-orders/repository.ts"
type: "code"
community: "Provider Order Integration (Petpooja/GoSelfServe)"
location: "L59"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Provider_Order_Integration_Petpooja/GoSelfServe
---

# upsertStmt

## Connections
- [[provider-ordersrepository.ts]] - `contains` [EXTRACTED]

## Source
**From** `server/src/entities/provider-orders/repository.ts` **(starting line 59):**
```typescript
const upsertStmt = db.prepare(`
  INSERT INTO provider_orders (
    id, provider, providerOrderId, providerInvoiceId, restaurantId, restaurantName,
    status, orderType, orderFrom, orderFromLabel, subOrderType, paymentType, tableNo,
    noOfPersons, customerName, customerPhone, coreTotal, taxTotal, discountTotal,
    packagingCharge, serviceCharge, deliveryCharges, roundOff, totalAmount, comment,
    biller, assignee, tokenNo, itemCount, itemsJson, taxesJson, discountsJson,
    partPaymentsJson, rawPayloadJson, providerCreatedAt, receivedAt,
    goselfserveSyncStatus, createdAt, updatedAt
  ) VALUES (
    @id, @provider, @providerOrderId, @providerInvoiceId, @restaurantId, @restaurantName,
    @status, @orderType, @orderFrom, @orderFromLabel, @subOrderType, @paymentType, @tableNo,
    @noOfPersons, @customerName, @customerPhone, @coreTotal, @taxTotal, @discountTotal,
    @packagingCharge, @serviceCharge, @deliveryCharges, @roundOff, @totalAmount, @comment,
    @biller, @assignee, @tokenNo, @itemCount, @itemsJson, @taxesJson, @discountsJson,
```

#graphify/code #graphify/EXTRACTED #community/Provider_Order_Integration_Petpooja/GoSelfServe