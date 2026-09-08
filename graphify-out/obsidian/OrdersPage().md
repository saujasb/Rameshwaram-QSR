---
source_file: "client/src/modules/orders/OrdersPage.tsx"
type: "code"
community: "Staff & Shift Operations UI"
location: "L35"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Staff__Shift_Operations_UI
---

# OrdersPage()

## Connections
- [[OrdersPage.tsx]] - `contains` [EXTRACTED]
- [[routes.tsx]] - `imports` [EXTRACTED]

## Source
**From** `client/src/modules/orders/OrdersPage.tsx` **(starting line 35):**
```tsx
export function OrdersPage() {
  return (
    <div>
      <NotConnectedBanner>
        No POS / online-ordering feed is connected yet, so this is not a live order queue. Log orders by hand below to
        track today's volume until an integration is wired up — manual entries are tagged accordingly and never mixed
        with a future live feed.
      </NotConnectedBanner>
      <CrudModulePage<ManualOrderEntry>
        title="Orders"
        description="Hand-logged orders across dine-in, takeaway and delivery."
        hooks={orderHooks}
        columns={columns}
        formFields={formFields}
        defaultValues={{
          channel: "dine_in",
          itemsSummary: "",
          totalAmount: null,
          status: "received",
          receivedAt: new Date().toISOString().slice(0, 16),
          completedAt: null,
          notes: "",
          source: "manual",
        }}
        emptyMessage="No orders logged yet."
        addButtonLabel="Log order"
      />
    </div>
  );
}
```

#graphify/code #graphify/EXTRACTED #community/Staff__Shift_Operations_UI