---
source_file: "client/src/modules/live-orders/LiveOrdersPage.tsx"
type: "code"
community: "Provider Order Integration (Petpooja/GoSelfServe)"
location: "L1"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Provider_Order_Integration_Petpooja/GoSelfServe
---

# LiveOrdersPage.tsx

## Connections
- [[ColumnConfig]] - `imports` [EXTRACTED]
- [[DataTable()]] - `imports` [EXTRACTED]
- [[DataTable.tsx]] - `imports_from` [EXTRACTED]
- [[LiveOrdersPage()]] - `contains` [EXTRACTED]
- [[PROVIDER_ORDER_SOURCE_LABELS]] - `imports` [EXTRACTED]
- [[PROVIDER_ORDER_TYPE_LABELS]] - `imports` [EXTRACTED]
- [[ProviderOrder]] - `imports` [EXTRACTED]
- [[ProviderOrderDetailModal()]] - `imports` [EXTRACTED]
- [[ProviderOrderDetailModal.tsx]] - `imports_from` [EXTRACTED]
- [[ProviderOrderFilter]] - `imports` [EXTRACTED]
- [[SOURCE_OPTIONS]] - `contains` [EXTRACTED]
- [[STATUS_OPTIONS]] - `contains` [EXTRACTED]
- [[StatusBadge()]] - `imports` [EXTRACTED]
- [[StatusBadge.tsx]] - `imports_from` [EXTRACTED]
- [[TYPE_OPTIONS]] - `contains` [EXTRACTED]
- [[apiproviderOrders.ts]] - `imports_from` [EXTRACTED]
- [[columns_7]] - `contains` [EXTRACTED]
- [[itemsSummary()]] - `indirect_call` [INFERRED]
- [[money()_3]] - `contains` [EXTRACTED]
- [[routes.tsx]] - `imports_from` [EXTRACTED]
- [[shared-typesproviderOrders.ts]] - `imports_from` [EXTRACTED]
- [[types.ts]] - `imports_from` [EXTRACTED]
- [[useProviderOrders()]] - `imports` [EXTRACTED]

## Source
**Full file:** `client/src/modules/live-orders/LiveOrdersPage.tsx`
```tsx
import { useMemo, useState } from "react";
import { DataTable } from "../../components/table/DataTable";
import { StatusBadge } from "../../components/StatusBadge";
import { useProviderOrders } from "../../lib/api/providerOrders";
import { PROVIDER_ORDER_SOURCE_LABELS, PROVIDER_ORDER_TYPE_LABELS } from "@shared/providerOrders";
import type { ProviderOrder, ProviderOrderFilter } from "@shared/providerOrders";
import type { ColumnConfig } from "../../components/crud/types";
import { ProviderOrderDetailModal } from "./ProviderOrderDetailModal";

function money(n: number): string {
  return `₹${n.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
}

function itemsSummary(order: ProviderOrder): string {
  if (order.items.length === 0) return "—";
  const first = order.items[0];
  const extra = order.items.length - 1;
  return `${first.quantity}× ${first.name}${extra > 0 ? ` +${extra} more` : ""}`;
}

const columns: ColumnConfig<ProviderOrder>[] = [
  {
    key: "providerCreatedAt",
    label: "Order Time",
    sortable: true,
    render: (r) => {
      const d = new Date(r.providerCreatedAt.replace(" ", "T"));
      return <span title={r.providerCreatedAt}>{Number.isNaN(d.getTime()) ? r.providerCreatedAt : d.toLocaleString()}</span>;
    },
  },
  {
    key: "orderFromLabel",
    label: "Source",
    sortable: true,
    render: (r) => (
      <div>
        <div style={{ fontWeight: 600 }}>{PROVIDER_ORDER_SOURCE_LABELS[r.orderFrom]}</div>
        <div style={{ fontSize: 11, color: "var(--muted)", textTransform: "capitalize" }}>{r.provider}</div>
      </div>
    ),
  },
  {
    key: "providerOrderId",
    label: "Order",
    sortable: true,
    render: (r) => (
      <div>
        <div style={{ fontWeight: 600 }}>#{r.providerOrderId}</div>
        <div style={{ fontSize: 11, color: "var(--muted)" }}>{PROVIDER_ORDER_TYPE_LABELS[r.orderType]}{r.tableNo ? ` · ${r.tableNo}` : ""}</div>
      </div>
    ),
  },
  { key: "paymentType", label: "Payment", sortable: true },
  { key: "customerName", label: "Customer", render: (r) => r.customerName || "—" },
  { key: "itemsSummary", label: "Items", render: itemsSummary },
  { key: "totalAmount", label: "Total", numeric: true, sortable: true, render: (r) => money(r.totalAmount) },
  {
    key: "status",
    label: "Status",
    sortable: true,
    render: (r) => <StatusBadge label={r.status} tone={r.status === "success" ? "ok" : "over"} />,
  },
];

const STATUS_OPTIONS: { value: ProviderOrderFilter["status"] | ""; label: string }[] = [
  { value: "", label: "All statuses" },
  { value: "success", label: "Success" },
  { value: "cancelled", label: "Cancelled" },
];

const TYPE_OPTIONS: { value: ProviderOrderFilter["orderType"] | ""; label: string }[] = [
  { value: "", label: "All order types" },
  { value: "dine_in", label: "Dine In" },
  { value: "pick_up", label: "Pick Up" },
  { value: "delivery", label: "Delivery" },
];

const SOURCE_OPTIONS: { value: ProviderOrderFilter["orderFrom"] | ""; label: string }[] = [
  { value: "", label: "All sources" },
  { value: "pos", label: "POS" },
  { value: "zomato", label: "Zomato" },
  { value: "swiggy", label: "Swiggy" },
  { value: "other", label: "Other aggregator" },
];

export function LiveOrdersPage() {
  const [status, setStatus] = useState<ProviderOrderFilter["status"] | "">("");
  const [orderType, setOrderType] = useState<ProviderOrderFilter["orderType"] | "">("");
  const [orderFrom, setOrderFrom] = useState<ProviderOrderFilter["orderFrom"] | "">("");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<ProviderOrder | null>(null);

  const filter: ProviderOrderFilter = useMemo(
    () => ({
      status: status || undefined,
      orderType: orderType || undefined,
      orderFrom: orderFrom || undefined,
      search: search.trim() || undefined,
    }),
    [status, orderType, orderFrom, search]
  );

  const { data, isLoading, isError } = useProviderOrders(filter);

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Live Orders</h1>
          <p className="page-desc">
            Real-time orders pushed from Petpooja POS on bill print — dine-in, pickup, delivery, and aggregators
            (Zomato / Swiggy) all land here as they happen.
          </p>
        </div>
        <span className="freshness good">
          <span className="status-dot good" /> Live · auto-refreshing every 15s
        </span>
      </div>

      <div className="filters-bar">
        <select value={status} onChange={(e) => setStatus(e.target.value as typeof status)}>
          {STATUS_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        <select value={orderType} onChange={(e) => setOrderType(e.target.value as typeof orderType)}>
          {TYPE_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        <select value={orderFrom} onChange={(e) => setOrderFrom(e.target.value as typeof orderFrom)}>
          {SOURCE_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        <input placeholder="Search order #, customer…" value={search} onChange={(e) => setSearch(e.target.value)} style={{ minWidth: 220 }} />
      </div>

      <div className="card">
        {isError ? (
          <p style={{ color: "var(--critical)", fontSize: 13.5 }}>Couldn't load live orders. Check the backend connection and retry.</p>
        ) : isLoading ? (
          <p style={{ color: "var(--muted)", fontSize: 13.5 }}>Loading…</p>
        ) : (
          <DataTable
            columns={columns}
            rows={data ?? []}
            onRowClick={(r) => setSelected(r)}
            emptyMessage="No orders yet. They'll appear here the moment a bill prints on Petpooja."
          />
        )}
      </div>

      {selected && <ProviderOrderDetailModal order={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
```

#graphify/code #graphify/EXTRACTED #community/Provider_Order_Integration_Petpooja/GoSelfServe