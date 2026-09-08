---
source_file: "server/src/entities/provider-orders/providers/petpooja.ts"
type: "code"
community: "Provider Order Integration (Petpooja/GoSelfServe)"
location: "L98"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Provider_Order_Integration_Petpooja/GoSelfServe
---

# normalizePetpoojaPayload()

## Connections
- [[PetpoojaPayloadError]] - `calls` [EXTRACTED]
- [[mapDiscount()]] - `indirect_call` [INFERRED]
- [[mapItem()]] - `indirect_call` [INFERRED]
- [[mapOrderFrom()]] - `calls` [EXTRACTED]
- [[mapOrderType()]] - `calls` [EXTRACTED]
- [[mapPartPayment()]] - `indirect_call` [INFERRED]
- [[mapStatus()]] - `calls` [EXTRACTED]
- [[mapTax()]] - `indirect_call` [INFERRED]
- [[num()]] - `calls` [EXTRACTED]
- [[providerspetpooja.ts]] - `contains` [EXTRACTED]
- [[webhook.ts]] - `imports` [EXTRACTED]

## Source
**From** `server/src/entities/provider-orders/providers/petpooja.ts` **(starting line 98):**
```typescript
export function normalizePetpoojaPayload(body: any): NormalizedPetpoojaOrder {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    throw new PetpoojaPayloadError("Request body must be a JSON object.");
  }
  if (body.event !== "orderdetails") {
    throw new PetpoojaPayloadError(`Unsupported event type ${JSON.stringify(body.event)}; expected "orderdetails".`);
  }
  const props = body.properties;
  if (!props || typeof props !== "object") {
    throw new PetpoojaPayloadError("Missing properties object.");
  }
  const restaurant = props.Restaurant ?? {};
  const customer = props.Customer ?? {};
  const order = props.Order;
  if (!order || typeof order !== "object") {
    throw new PetpoojaPayloadError("Missing properties.Order object.");
  }
  if (order.orderID == null) throw new PetpoojaPayloadError("Order.orderID is required.");
  if (typeof order.order_type !== "string") throw new PetpoojaPayloadError("Order.order_type is required.");
  if (typeof order.status !== "string") throw new PetpoojaPayloadError("Order.status is required.");

  const rawOrderFrom = str(order.order_from, "POS");
  const items = Array.isArray(props.OrderItem) ? props.OrderItem.map(mapItem) : [];

  return {
    provider: "petpooja",
    providerOrderId: String(order.orderID),
    providerInvoiceId: str(order.customer_invoice_id, String(order.orderID)),
    restaurantId: str(restaurant.restID),
    restaurantName: str(restaurant.res_name),
    status: mapStatus(order.status),
    orderType: mapOrderType(order.order_type),
    orderFrom: mapOrderFrom(rawOrderFrom),
    orderFromLabel: rawOrderFrom,
    subOrderType: str(order.sub_order_type),
    paymentType: str(order.payment_type),
    tableNo: str(order.table_no),
    noOfPersons: num(order.no_of_persons),
    customerName: str(customer.name),
    customerPhone: str(customer.phone),
    coreTotal: num(order.core_total),
    taxTotal: num(order.tax_total),
    discountTotal: num(order.discount_total),
    packagingCharge: num(order.packaging_charge),
    serviceCharge: num(order.service_charge),
    deliveryCharges: num(order.delivery_charges),
    roundOff: num(order.round_off),
    totalAmount: num(order.total),
    comment: str(order.comment),
    biller: str(order.biller),
    assignee: str(order.assignee),
    tokenNo: str(order.token_no),
    items,
    taxes: Array.isArray(props.Tax) ? props.Tax.map(mapTax) : [],
    discounts: Array.isArray(props.Discount) ? props.Discount.map(mapDiscount) : [],
    partPayments: Array.isArray(order.part_payments) ? order.part_payments.map(mapPartPayment) : [],
    providerCreatedAt: str(order.created_on),
    rawPayload: body,
  };
}
```

#graphify/code #graphify/EXTRACTED #community/Provider_Order_Integration_Petpooja/GoSelfServe