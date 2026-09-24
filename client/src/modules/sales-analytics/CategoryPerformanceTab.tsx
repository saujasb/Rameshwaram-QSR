import { useMemo, useState } from "react";
import { DateRangeControl } from "../../components/DateRangeControl";
import { defaultDateRange, resolveBusinessDateRange, type DateRangeValue } from "../../lib/dateRange";
import { useProviderOrderItemSales } from "../../lib/api/providerOrders";
import { liveSourceFilter, type LiveSalesSource } from "./salesSource";

/**
 * Category-level rollup of the same provider_orders item data ItemSalesTab
 * uses. A category of null (the item genuinely carries none) is shown as its
 * own honest "Uncategorized" row rather than folded into an existing category
 * or silently dropped.
 */
export function CategoryPerformanceTab({ source }: { source: LiveSalesSource }) {
  const [dateRange, setDateRange] = useState<DateRangeValue>(defaultDateRange);
  const range = useMemo(() => resolveBusinessDateRange(dateRange), [dateRange]);
  const sourceFilter = liveSourceFilter(source);

  const { data, isLoading, isError } = useProviderOrderItemSales({ ...sourceFilter, ...range });

  const rangeLabel =
    data?.businessDateFrom && data.businessDateFrom === data.businessDateTo
      ? data.businessDateFrom
      : data?.businessDateFrom
        ? `${data.businessDateFrom} – ${data.businessDateTo}`
        : "";

  const categories = data?.categories ?? [];

  return (
    <div>
      <div className="page-head">
        <div>
          <h2 style={{ fontSize: 15, margin: "0 0 4px", color: "var(--ink-2)" }}>Category Wise Sales</h2>
          <p className="page-desc" style={{ margin: 0 }}>
            Revenue and quantity by menu category, from the same live provider_orders item data as Item Sales. Items
            with no category recorded are shown honestly as "Uncategorized", never guessed.
          </p>
        </div>
      </div>

      <div className="filters-bar">
        <DateRangeControl value={dateRange} onChange={setDateRange} />
      </div>

      {isError ? (
        <p style={{ color: "var(--critical)", fontSize: 13.5 }}>Couldn't load category wise sales. Check the backend connection and retry.</p>
      ) : isLoading ? (
        <p style={{ color: "var(--muted)", fontSize: 13.5 }}>Loading…</p>
      ) : categories.length === 0 ? (
        <div className="banner-not-connected">No items sold in this range yet.</div>
      ) : (
        <div className="card">
          <h3>Category breakdown</h3>
          <p className="h3sub">{rangeLabel}</p>
          <div className="table-scroll">
            <table>
              <thead>
                <tr><th>Category</th><th className="num">Quantity</th><th className="num">Revenue</th></tr>
              </thead>
              <tbody>
                {categories.map((c) => (
                  <tr key={c.category ?? "uncategorized"}>
                    <td>{c.category ?? <span style={{ color: "var(--muted)" }}>Uncategorized</span>}</td>
                    <td className="num">{c.quantity.toLocaleString()}</td>
                    <td className="num">₹{c.amount.toLocaleString()}</td>
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
