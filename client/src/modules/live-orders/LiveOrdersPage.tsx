import { useEffect, useMemo, useState } from "react";
import { DataTable } from "../../components/table/DataTable";
import { StatusBadge } from "../../components/StatusBadge";
import { useProviderOrdersPage, type ProviderOrdersPageFilter } from "../../lib/api/providerOrders";
import { PROVIDER_ORDER_SOURCE_LABELS, PROVIDER_ORDER_TYPE_LABELS, classifyOnlinePlatform } from "@shared/providerOrders";
import type { ProviderOrder, ProviderOrderFilter } from "@shared/providerOrders";
import { getBusinessDayBounds, getCurrentBusinessDate, shiftDateKey } from "@shared/businessDate";
import type { ColumnConfig } from "../../components/crud/types";
import { ProviderOrderDetailModal } from "./ProviderOrderDetailModal";

type DatePreset = "today" | "yesterday" | "last7" | "custom";
type PageSizeOption = "10" | "20" | "50" | "100" | "all";

/**
 * Resolves a UI preset to an inclusive-from/exclusive-to instant range using
 * the SAME 04:30 outlet business-day boundary as Sales & Revenue and the
 * Overview (shared-types/businessDate.ts) -- not a midnight-to-midnight
 * calendar day. getBusinessDayBounds() returns explicit +05:30-offset
 * instants, so these are safe to send to the server regardless of its
 * runtime timezone (local dev vs. Vercel's UTC default).
 */
function resolveDateRange(preset: DatePreset, customFrom: string, customTo: string): { from?: string; to?: string } {
  const today = getCurrentBusinessDate();
  if (preset === "today") {
    const { start, end } = getBusinessDayBounds(today);
    return { from: start, to: end };
  }
  if (preset === "yesterday") {
    const { start, end } = getBusinessDayBounds(shiftDateKey(today, -1));
    return { from: start, to: end };
  }
  if (preset === "last7") {
    const { start } = getBusinessDayBounds(shiftDateKey(today, -6));
    const { end } = getBusinessDayBounds(today);
    return { from: start, to: end };
  }
  if (!customFrom || !customTo) return {};
  const { start } = getBusinessDayBounds(customFrom);
  const { end } = getBusinessDayBounds(customTo);
  return { from: start, to: end };
}

/** First, last, current ± 2 neighbors, with "…" gaps -- e.g. 1 … 4 5 [6] 7 8 … 45 */
function pageNumbers(current: number, count: number): (number | "…")[] {
  if (count <= 1) return [1];
  const pages: (number | "…")[] = [1];
  const low = Math.max(2, current - 2);
  const high = Math.min(count - 1, current + 2);
  if (low > 2) pages.push("…");
  for (let p = low; p <= high; p++) pages.push(p);
  if (high < count - 1) pages.push("…");
  pages.push(count);
  return pages;
}

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

const DATE_PRESET_OPTIONS: { value: DatePreset; label: string }[] = [
  { value: "today", label: "Today" },
  { value: "yesterday", label: "Yesterday" },
  { value: "last7", label: "Last 7 Days" },
  { value: "custom", label: "Custom" },
];

const PAGE_SIZE_OPTIONS: { value: PageSizeOption; label: string }[] = [
  { value: "10", label: "Show: 10" },
  { value: "20", label: "Show: 20" },
  { value: "50", label: "Show: 50" },
  { value: "100", label: "Show: 100" },
  { value: "all", label: "Show: All" },
];

export function LiveOrdersPage() {
  const [status, setStatus] = useState<ProviderOrderFilter["status"] | "">("");
  const [orderType, setOrderType] = useState<ProviderOrderFilter["orderType"] | "">("");
  const [orderFrom, setOrderFrom] = useState<ProviderOrderFilter["orderFrom"] | "">("");
  const [search, setSearch] = useState("");
  const [datePreset, setDatePreset] = useState<DatePreset>("today");
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");
  const [pageSizeOption, setPageSizeOption] = useState<PageSizeOption>("20");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<ProviderOrder | null>(null);

  const { from, to } = useMemo(
    () => resolveDateRange(datePreset, customFrom, customTo),
    [datePreset, customFrom, customTo]
  );

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
      pageSize: pageSizeOption === "all" ? "all" : Number(pageSizeOption),
    }),
    [status, orderType, orderFrom, search, from, to, page, pageSizeOption]
  );

  const { data, isLoading, isError } = useProviderOrdersPage(filter);
  const orders = data?.orders ?? [];
  const total = data?.total ?? 0;
  const pageSize = data?.pageSize ?? 20;
  const pageCount = pageSizeOption === "all" ? 1 : Math.max(1, Math.ceil(total / pageSize));
  const rangeStart = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const rangeEnd = total === 0 ? 0 : Math.min(total, rangeStart + orders.length - 1);
  const truncatedAll = pageSizeOption === "all" && total > orders.length;

  const emptyMessage =
    datePreset === "today" && !status && !orderType && !orderFrom && !search
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
        <select value={datePreset} onChange={(e) => setDatePreset(e.target.value as DatePreset)}>
          {DATE_PRESET_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        {datePreset === "custom" && (
          <>
            <input type="date" value={customFrom} onChange={(e) => setCustomFrom(e.target.value)} aria-label="Start date" />
            <input type="date" value={customTo} onChange={(e) => setCustomTo(e.target.value)} aria-label="End date" />
          </>
        )}
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
        <select value={pageSizeOption} onChange={(e) => setPageSizeOption(e.target.value as PageSizeOption)}>
          {PAGE_SIZE_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
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
            {total > 0 && (
              <div className="table-footer">
                <span>
                  Showing {rangeStart}–{rangeEnd} of {total}
                  {truncatedAll && " (narrow the date range or reduce page size to see the rest)"}
                </span>
                {pageSizeOption !== "all" && pageCount > 1 && (
                  <div className="pager">
                    <button disabled={page === 1} onClick={() => setPage(1)}>« First</button>
                    <button disabled={page === 1} onClick={() => setPage((p) => p - 1)}>← Prev</button>
                    {pageNumbers(page, pageCount).map((p, i) =>
                      p === "…" ? (
                        <span key={`ellipsis-${i}`} className="pager-ellipsis">…</span>
                      ) : (
                        <button key={p} className={p === page ? "current" : undefined} onClick={() => setPage(p)}>
                          {p}
                        </button>
                      )
                    )}
                    <button disabled={page === pageCount} onClick={() => setPage((p) => p + 1)}>Next →</button>
                    <button disabled={page === pageCount} onClick={() => setPage(pageCount)}>Last »</button>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {selected && <ProviderOrderDetailModal order={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
