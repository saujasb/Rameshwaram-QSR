---
source_file: "client/src/modules/kitchen/KitchenPage.tsx"
type: "code"
community: "Order Operations Pages"
location: "L34"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Order_Operations_Pages
---

# KitchenPage()

## Connections
- [[KitchenPage.tsx]] - `contains` [EXTRACTED]
- [[routes.tsx]] - `imports` [EXTRACTED]
- [[useKitchenQueue()]] - `calls` [EXTRACTED]

## Source
**From** `client/src/modules/kitchen/KitchenPage.tsx` **(starting line 34):**
```tsx
export function KitchenPage() {
  const update = orderHooks.useUpdate();
  const { data: queue } = useKitchenQueue();
  const busyLoad = queue?.length ?? 0;
  const kitchenState = busyLoad === 0 ? { label: "Normal", tone: "good" } : busyLoad <= 4 ? { label: "Busy", tone: "warn" } : { label: "Overloaded", tone: "crit" };

  return (
    <div>
      <NotConnectedBanner>
        No Kitchen Display System (KDS) is connected yet, so prep times and SLA breaches aren't measured automatically.
        This queue reflects manually-logged orders only.
      </NotConnectedBanner>
      <div className="card">
        <h3>Kitchen status</h3>
        <p className="h3sub">Based on manually-logged orders currently in the queue — not a live KDS signal.</p>
        <span className={`status-dot ${kitchenState.tone}`} /> <b>{kitchenState.label}</b> · {busyLoad} order(s) in queue
      </div>
      <CrudModulePage<ManualOrderEntry>
        title="Kitchen Queue"
        description="Orders currently received, accepted, preparing, ready, or delayed. Advance status as the kitchen works through them."
        hooks={{ useList: useKitchenQueue, useCreate: orderHooks.useCreate, useUpdate: orderHooks.useUpdate, useRemove: orderHooks.useRemove }}
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
        emptyMessage="Kitchen queue is empty."
        addButtonLabel="Log order"
        renderDetail={(record) => {
          const next = NEXT_STATUS[record.status];
          return next ? (
            <div className="btn-row" style={{ marginTop: 0, marginBottom: 14 }}>
              <button
                className="btn small"
                onClick={() =>
                  update.mutate({
                    id: record.id,
                    patch: { status: next, completedAt: next === "completed" ? new Date().toISOString() : null },
                  })
                }
              >
                Advance to "{STATUS_OPTIONS.find((o) => o.value === next)?.label}"
              </button>
            </div>
          ) : null;
        }}
      />
    </div>
  );
}
```

#graphify/code #graphify/EXTRACTED #community/Order_Operations_Pages