---
source_file: "client/src/modules/delivery/DeliveryPage.tsx"
type: "code"
community: "Order Operations Pages"
location: "L35"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Order_Operations_Pages
---

# DeliveryPage()

## Connections
- [[DeliveryPage.tsx]] - `contains` [EXTRACTED]
- [[routes.tsx]] - `imports` [EXTRACTED]
- [[useDeliveryOrders()]] - `indirect_call` [INFERRED]

## Source
**From** `client/src/modules/delivery/DeliveryPage.tsx` **(starting line 35):**
```tsx
export function DeliveryPage() {
  return (
    <div>
      <NotConnectedBanner>
        No aggregator (Swiggy/Zomato-style) integration is connected yet. These are hand-logged delivery orders only.
      </NotConnectedBanner>
      <CrudModulePage<ManualOrderEntry>
        title="Delivery"
        description="Delivery-channel orders only."
        hooks={{ useList: useDeliveryOrders, useCreate: orderHooks.useCreate, useUpdate: orderHooks.useUpdate, useRemove: orderHooks.useRemove }}
        columns={columns}
        formFields={formFields}
        defaultValues={{
          channel: "delivery",
          itemsSummary: "",
          totalAmount: null,
          status: "received",
          receivedAt: new Date().toISOString().slice(0, 16),
          completedAt: null,
          notes: "",
          source: "manual",
        }}
        emptyMessage="No delivery orders logged."
        addButtonLabel="Log delivery order"
      />
    </div>
  );
}
```

#graphify/code #graphify/EXTRACTED #community/Order_Operations_Pages