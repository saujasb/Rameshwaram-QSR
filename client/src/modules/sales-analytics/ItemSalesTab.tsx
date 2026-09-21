import { useMemo, useState } from "react";
import { useProviderOrderItemSales } from "../../lib/api/providerOrders";
import { getCurrentBusinessDate, shiftDateKey } from "@shared/businessDate";
import { liveSourceFilter, type LiveSalesSource } from "./salesSource";

type RangePreset = "today" | "yesterday" | "week" | "month" | "all";
type SortDir = "asc" | "desc";

function computeRange(preset: RangePreset, today: string): { from?: string; to?: string } {
  if (preset === "today") return { from: today, to: today };
  if (preset === "yesterday") {
    const y = shiftDateKey(today, -1);
    return { from: y, to: y };
  }
  if (preset === "week") return { from: shiftDateKey(today, -6), to: today };
  if (preset === "month") return { from: shiftDateKey(today, -29), to: today };
  return {};
}

/**
 * Combined item-sales list, sourced from provider_orders.itemsJson (server-
 * side aggregated, see getProviderOrderItemSales) -- never add-ons/variants,
 * per the brief. One sortable list, never split into "highest"/"lowest"
 * sections; the sort direction just flips which end is on top.
 */
export function ItemSalesTab({ source }: { source: LiveSalesSource }) {
  const today = getCurrentBusinessDate();
  const [preset, setPreset] = useState<RangePreset>("today");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const range = useMemo(() => computeRange(preset, today), [preset, today]);
  const sourceFilter = liveSourceFilter(source);

  const { data, isLoading, isError } = useProviderOrderItemSales({ ...sourceFilter, ...range });

  const rangeLabel =
    data?.businessDateFrom && data.businessDateFrom === data.businessDateTo
      ? data.businessDateFrom
      : data?.businessDateFrom
        ? `${data.businessDateFrom} – ${data.businessDateTo}`
        : "";

  const sortedItems = useMemo(() => {
    const items = data?.items ?? [];
    const copy = [...items];
    copy.sort((a, b) => (sortDir === "asc" ? a.quantity - b.quantity : b.quantity - a.quantity));
    return copy;
  }, [data, sortDir]);

  return (
    <div>
      <div className="page-head">
        <div>
          <h2 style={{ fontSize: 15, margin: "0 0 4px", color: "var(--ink-2)" }}>Item Sales</h2>
          <p className="page-desc" style={{ margin: 0 }}>
            Every sold item across the selected source and date range, aggregated straight from provider_orders — one
            combined list, sorted by quantity.
          </p>
        </div>
      </div>

      <div className="filters-bar">
        <select value={preset} onChange={(e) => setPreset(e.target.value as RangePreset)}>
          <option value="today">Today</option>
          <option value="yesterday">Yesterday</option>
          <option value="week">Last 7 days</option>
          <option value="month">Last 30 days</option>
          <option value="all">All time</option>
        </select>
        <select value={sortDir} onChange={(e) => setSortDir(e.target.value as SortDir)}>
          <option value="desc">Quantity: highest → lowest</option>
          <option value="asc">Quantity: lowest → highest</option>
        </select>
      </div>

      {isError ? (
        <p style={{ color: "var(--critical)", fontSize: 13.5 }}>Couldn't load item sales. Check the backend connection and retry.</p>
      ) : isLoading ? (
        <p style={{ color: "var(--muted)", fontSize: 13.5 }}>Loading…</p>
      ) : sortedItems.length === 0 ? (
        <div className="banner-not-connected">No items sold in this range yet.</div>
      ) : (
        <div className="card">
          <h3>Items sold</h3>
          <p className="h3sub">{rangeLabel}</p>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Category</th>
                  <th className="num">Qty sold</th>
                  <th className="num">Sales amount</th>
                </tr>
              </thead>
              <tbody>
                {sortedItems.map((item) => (
                  <tr key={item.name}>
                    <td>{item.name}</td>
                    <td>{item.category ?? <span style={{ color: "var(--muted)" }}>Uncategorized</span>}</td>
                    <td className="num">{item.quantity.toLocaleString()}</td>
                    <td className="num">₹{item.amount.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
