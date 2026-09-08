---
source_file: "client/src/modules/delivery/DeliveryPage.tsx"
type: "code"
community: "Order Operations Pages"
location: "L1"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Order_Operations_Pages
---

# DeliveryPage.tsx

## Connections
- [[ColumnConfig]] - `imports` [EXTRACTED]
- [[CrudModulePage()]] - `imports` [EXTRACTED]
- [[CrudModulePage.tsx]] - `imports_from` [EXTRACTED]
- [[DeliveryPage()]] - `contains` [EXTRACTED]
- [[FormFieldConfig]] - `imports` [EXTRACTED]
- [[ManualOrderEntry]] - `imports` [EXTRACTED]
- [[NotConnectedBanner()]] - `imports` [EXTRACTED]
- [[NotConnectedBanner.tsx]] - `imports_from` [EXTRACTED]
- [[STATUS_OPTIONS_1]] - `imports` [EXTRACTED]
- [[StatusBadge()]] - `imports` [EXTRACTED]
- [[StatusBadge.tsx]] - `imports_from` [EXTRACTED]
- [[channelHelpers.ts]] - `imports_from` [EXTRACTED]
- [[columns_8]] - `contains` [EXTRACTED]
- [[entities.ts]] - `imports_from` [EXTRACTED]
- [[formFields_7]] - `contains` [EXTRACTED]
- [[orderHooks]] - `imports` [EXTRACTED]
- [[orders.ts]] - `imports_from` [EXTRACTED]
- [[routes.tsx]] - `imports_from` [EXTRACTED]
- [[types.ts]] - `imports_from` [EXTRACTED]
- [[useDeliveryOrders()]] - `contains` [EXTRACTED]

## Source
**Full file:** `client/src/modules/delivery/DeliveryPage.tsx`
```tsx
import { CrudModulePage } from "../../components/crud/CrudModulePage";
import { StatusBadge } from "../../components/StatusBadge";
import { NotConnectedBanner } from "../../components/NotConnectedBanner";
import { orderHooks } from "../../lib/api/orders";
import type { ManualOrderEntry } from "@shared/entities";
import type { ColumnConfig, FormFieldConfig } from "../../components/crud/types";
import { STATUS_OPTIONS } from "../orders/channelHelpers";

function useDeliveryOrders() {
  const { data, ...rest } = orderHooks.useList();
  return { ...rest, data: data?.filter((o) => o.channel === "delivery") };
}

const columns: ColumnConfig<ManualOrderEntry>[] = [
  { key: "receivedAt", label: "Received", render: (r) => new Date(r.receivedAt).toLocaleString() },
  { key: "itemsSummary", label: "Items" },
  { key: "totalAmount", label: "Amount", numeric: true, render: (r) => (r.totalAmount != null ? `₹${r.totalAmount}` : "—") },
  {
    key: "status",
    label: "Status",
    render: (r) => (
      <StatusBadge label={r.status} tone={r.status === "completed" ? "ok" : r.status === "cancelled" || r.status === "delayed" ? "over" : "neutral"} />
    ),
  },
];

const formFields: FormFieldConfig[] = [
  { key: "itemsSummary", label: "Items", type: "textarea", required: true },
  { key: "totalAmount", label: "Total amount (₹)", type: "number" },
  { key: "receivedAt", label: "Received at", type: "datetime", required: true },
  { key: "status", label: "Status", type: "select", required: true, options: STATUS_OPTIONS },
  { key: "notes", label: "Notes", type: "textarea", placeholder: "Aggregator, delivery partner, ETA…" },
];

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