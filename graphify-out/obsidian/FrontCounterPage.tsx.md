---
source_file: "client/src/modules/front-counter/FrontCounterPage.tsx"
type: "code"
community: "Order Operations Pages"
location: "L1"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Order_Operations_Pages
---

# FrontCounterPage.tsx

## Connections
- [[CHANNEL_OPTIONS]] - `imports` [EXTRACTED]
- [[ColumnConfig]] - `imports` [EXTRACTED]
- [[CrudModulePage()]] - `imports` [EXTRACTED]
- [[CrudModulePage.tsx]] - `imports_from` [EXTRACTED]
- [[FormFieldConfig]] - `imports` [EXTRACTED]
- [[FrontCounterPage()]] - `contains` [EXTRACTED]
- [[ManualOrderEntry]] - `imports` [EXTRACTED]
- [[NotConnectedBanner()]] - `imports` [EXTRACTED]
- [[NotConnectedBanner.tsx]] - `imports_from` [EXTRACTED]
- [[STATUS_OPTIONS_1]] - `imports` [EXTRACTED]
- [[StatusBadge()]] - `imports` [EXTRACTED]
- [[StatusBadge.tsx]] - `imports_from` [EXTRACTED]
- [[channelHelpers.ts]] - `imports_from` [EXTRACTED]
- [[columns_9]] - `contains` [EXTRACTED]
- [[entities.ts]] - `imports_from` [EXTRACTED]
- [[formFields_8]] - `contains` [EXTRACTED]
- [[orderHooks]] - `imports` [EXTRACTED]
- [[orders.ts]] - `imports_from` [EXTRACTED]
- [[routes.tsx]] - `imports_from` [EXTRACTED]
- [[types.ts]] - `imports_from` [EXTRACTED]
- [[useFrontCounterOrders()]] - `contains` [EXTRACTED]

## Source
**Full file:** `client/src/modules/front-counter/FrontCounterPage.tsx`
```tsx
import { CrudModulePage } from "../../components/crud/CrudModulePage";
import { StatusBadge } from "../../components/StatusBadge";
import { NotConnectedBanner } from "../../components/NotConnectedBanner";
import { orderHooks } from "../../lib/api/orders";
import type { ManualOrderEntry } from "@shared/entities";
import type { ColumnConfig, FormFieldConfig } from "../../components/crud/types";
import { CHANNEL_OPTIONS, STATUS_OPTIONS } from "../orders/channelHelpers";

function useFrontCounterOrders() {
  const { data, ...rest } = orderHooks.useList();
  return { ...rest, data: data?.filter((o) => o.channel === "dine_in" || o.channel === "takeaway") };
}

const columns: ColumnConfig<ManualOrderEntry>[] = [
  { key: "receivedAt", label: "Received", render: (r) => new Date(r.receivedAt).toLocaleString() },
  { key: "channel", label: "Channel", render: (r) => CHANNEL_OPTIONS.find((o) => o.value === r.channel)?.label ?? r.channel },
  { key: "itemsSummary", label: "Items" },
  { key: "totalAmount", label: "Amount", numeric: true, render: (r) => (r.totalAmount != null ? `₹${r.totalAmount}` : "—") },
  {
    key: "status",
    label: "Status",
    render: (r) => <StatusBadge label={r.status} tone={r.status === "completed" ? "ok" : "neutral"} />,
  },
];

const formFields: FormFieldConfig[] = [
  { key: "channel", label: "Channel", type: "select", required: true, options: CHANNEL_OPTIONS.filter((o) => o.value !== "delivery") },
  { key: "itemsSummary", label: "Items", type: "textarea", required: true },
  { key: "totalAmount", label: "Total amount (₹)", type: "number" },
  { key: "receivedAt", label: "Received at", type: "datetime", required: true },
  { key: "status", label: "Status", type: "select", required: true, options: STATUS_OPTIONS },
];

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