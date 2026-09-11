---
source_file: "client/src/modules/front-counter/FrontCounterPage.tsx"
type: "code"
community: "Order Operations Pages"
location: "L34"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Order_Operations_Pages
---

# FrontCounterPage()

## Connections
- [[FrontCounterPage.tsx]] - `contains` [EXTRACTED]
- [[routes.tsx]] - `imports` [EXTRACTED]
- [[useFrontCounterOrders()]] - `indirect_call` [INFERRED]

## Source
**From** `client/src/modules/front-counter/FrontCounterPage.tsx` **(starting line 34):**
```tsx
export function FrontCounterPage() {
  return (
    <div>
      <NotConnectedBanner>
        No POS terminal feed is connected yet. Dine-in and takeaway orders logged here are manual entries.
      </NotConnectedBanner>
      <CrudModulePage<ManualOrderEntry>
        title="Front Counter"
        description="Dine-in and takeaway orders."
        hooks={{ useList: useFrontCounterOrders, useCreate: orderHooks.useCreate, useUpdate: orderHooks.useUpdate, useRemove: orderHooks.useRemove }}
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
        emptyMessage="No front counter orders logged."
        addButtonLabel="Log order"
      />
    </div>
  );
}
```

#graphify/code #graphify/EXTRACTED #community/Order_Operations_Pages