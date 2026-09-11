---
source_file: "client/src/modules/orders/OrdersPage.tsx"
type: "code"
community: "Order Operations Pages"
location: "L1"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Order_Operations_Pages
---

# OrdersPage.tsx

## Connections
- [[CHANNEL_OPTIONS]] - `imports` [EXTRACTED]
- [[ColumnConfig]] - `imports` [EXTRACTED]
- [[CrudModulePage()]] - `imports` [EXTRACTED]
- [[CrudModulePage.tsx]] - `imports_from` [EXTRACTED]
- [[FormFieldConfig]] - `imports` [EXTRACTED]
- [[ManualOrderEntry]] - `imports` [EXTRACTED]
- [[NotConnectedBanner()]] - `imports` [EXTRACTED]
- [[NotConnectedBanner.tsx]] - `imports_from` [EXTRACTED]
- [[OrdersPage()]] - `contains` [EXTRACTED]
- [[STATUS_OPTIONS_1]] - `imports` [EXTRACTED]
- [[StatusBadge()]] - `imports` [EXTRACTED]
- [[StatusBadge.tsx]] - `imports_from` [EXTRACTED]
- [[channelHelpers.ts]] - `imports_from` [EXTRACTED]
- [[columns_11]] - `contains` [EXTRACTED]
- [[entities.ts]] - `imports_from` [EXTRACTED]
- [[formFields_10]] - `contains` [EXTRACTED]
- [[orderHooks]] - `imports` [EXTRACTED]
- [[orders.ts]] - `imports_from` [EXTRACTED]
- [[routes.tsx]] - `imports_from` [EXTRACTED]
- [[types.ts]] - `imports_from` [EXTRACTED]

## Source
**Full file:** `client/src/modules/orders/OrdersPage.tsx`
```tsx
import { CrudModulePage } from "../../components/crud/CrudModulePage";
import { StatusBadge } from "../../components/StatusBadge";
import { NotConnectedBanner } from "../../components/NotConnectedBanner";
import { orderHooks } from "../../lib/api/orders";
import type { ManualOrderEntry } from "@shared/entities";
import type { ColumnConfig, FormFieldConfig } from "../../components/crud/types";
import { CHANNEL_OPTIONS, STATUS_OPTIONS } from "./channelHelpers";

const columns: ColumnConfig<ManualOrderEntry>[] = [
  { key: "receivedAt", label: "Received", render: (r) => new Date(r.receivedAt).toLocaleString() },
  { key: "channel", label: "Channel", render: (r) => CHANNEL_OPTIONS.find((o) => o.value === r.channel)?.label ?? r.channel },
  { key: "itemsSummary", label: "Items" },
  { key: "totalAmount", label: "Amount", numeric: true, render: (r) => (r.totalAmount != null ? `₹${r.totalAmount}` : "—") },
  {
    key: "status",
    label: "Status",
    render: (r) => (
      <StatusBadge
        label={r.status}
        tone={r.status === "completed" ? "ok" : r.status === "cancelled" || r.status === "delayed" ? "over" : "neutral"}
      />
    ),
  },
];

const formFields: FormFieldConfig[] = [
  { key: "channel", label: "Channel", type: "select", required: true, options: CHANNEL_OPTIONS },
  { key: "itemsSummary", label: "Items", type: "textarea", required: true, placeholder: "2x Masala Dosa, 1x Filter Coffee…" },
  { key: "totalAmount", label: "Total amount (₹)", type: "number" },
  { key: "receivedAt", label: "Received at", type: "datetime", required: true },
  { key: "status", label: "Status", type: "select", required: true, options: STATUS_OPTIONS },
  { key: "notes", label: "Notes", type: "textarea" },
];

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

#graphify/code #graphify/EXTRACTED #community/Order_Operations_Pages