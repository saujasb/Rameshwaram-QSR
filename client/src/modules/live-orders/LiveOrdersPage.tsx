import { useEffect, useMemo, useState } from "react";
import { DataTable } from "../../components/table/DataTable";
import { StatusBadge } from "../../components/StatusBadge";
import { useProviderOrdersPage, type ProviderOrdersPageFilter } from "../../lib/api/providerOrders";
import { PROVIDER_ORDER_SOURCE_LABELS, PROVIDER_ORDER_TYPE_LABELS, classifyOnlinePlatform } from "@shared/providerOrders";
import type { ProviderOrder, ProviderOrderFilter } from "@shared/providerOrders";
import type { ColumnConfig } from "../../components/crud/types";
import { DateRangeControl } from "../../components/DateRangeControl";
import { PageSizeSelect, PaginationFooter, pageSizeFor, type PageSizeOption } from "../../components/Pagination";
import { defaultDateRange, resolveInstantRange, type DateRangeValue } from "../../lib/dateRange";
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
    render: (r) => {
      // Swiggy/Zomato orders are ONE combined "Online" reporting category,
      // never split into separate top-level sources -- the actual aggregator
      // still shows underneath as the platform, exactly like the provider
      // name shows for every other order.
      const online = classifyOnlinePlatform(r);
      if (online.isOnline) {
        return (
          <div>
            <div style={{ fontWeight: 600 }}>Online</div>
            <div style={{ fontSize: 11, color: "var(--muted)" }}>{online.platformLabel ?? "Petpooja"}</div>
          </div>
        );
      }
      return (
        <div>
          <div style={{ fontWeight: 600 }}>{PROVIDER_ORDER_SOURCE_LABELS[r.orderFrom]}</div>
          <div style={{ fontSize: 11, color: "var(--muted)", textTransform: "capitalize" }}>{r.provider}</div>
        </div>
      );
    },
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
  const [dateRange, setDateRange] = useState<DateRangeValue>(defaultDateRange);
  const [pageSizeOption, setPageSizeOption] = useState<PageSizeOption>("20");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<ProviderOrder | null>(null);

  // Same 04:30 outlet business-day boundary as Sales & Revenue (see
  // lib/dateRange.ts), as explicit-offset instants for the paginated list.
  const { from, to } = useMemo(() => resolveInstantRange(dateRange), [dateRange]);

  // Any change that changes *what* is being shown should snap back to page 1,
  // otherwise a user filtering from page 6 of "Today" would land on an
  // out-of-range page for a narrower result set.
  useEffect(() => {
    setPage(1);
  }, [status, orderType, orderFrom, search, from, to, pageSizeOption]);

  const filter: ProviderOrdersPageFilter = useMemo(
    () => ({
      status: status || undefined,
      orderType: orderType || undefined,
      orderFrom: orderFrom || undefined,
      search: search.trim() || undefined,
      from,
      to,
      page,
      // "All" = no cap on the total, still paged 100 at a time.
      pageSize: pageSizeFor(pageSizeOption),
    }),
    [status, orderType, orderFrom, search, from, to, page, pageSizeOption]
  );

  const { data, isLoading, isError } = useProviderOrdersPage(filter);
  const orders = data?.orders ?? [];
  const total = data?.total ?? 0;
  const pageSize = data?.pageSize ?? pageSizeFor(pageSizeOption);

  const emptyMessage =
    dateRange.preset === "today" && !status && !orderType && !orderFrom && !search
      ? "No orders yet. They'll appear here the moment a bill prints on Petpooja."
      : "No orders found for the selected date range and filters.";

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
        <DateRangeControl value={dateRange} onChange={setDateRange} />
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
        <PageSizeSelect value={pageSizeOption} onChange={setPageSizeOption} />
      </div>

      <div className="card">
        {isError ? (
          <p style={{ color: "var(--critical)", fontSize: 13.5 }}>Couldn't load live orders. Check the backend connection and retry.</p>
        ) : isLoading && !data ? (
          <p style={{ color: "var(--muted)", fontSize: 13.5 }}>Loading…</p>
        ) : (
          <>
            <DataTable
              columns={columns}
              rows={orders}
              onRowClick={(r) => setSelected(r)}
              emptyMessage={emptyMessage}
              paginate={false}
            />
            <PaginationFooter page={page} pageSize={pageSize} total={total} rowsOnPage={orders.length} onPageChange={setPage} />
          </>
        )}
      </div>

      {selected && <ProviderOrderDetailModal order={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
