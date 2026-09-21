import { useMemo, useState } from "react";
import { Donut } from "../../components/charts/Donut";
import { useProviderOrderItemSales } from "../../lib/api/providerOrders";
import { getCurrentBusinessDate, shiftDateKey } from "@shared/businessDate";
import { liveSourceFilter, type LiveSalesSource } from "./salesSource";

type RangePreset = "today" | "yesterday" | "week" | "month" | "all";

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

const DONUT_PALETTE = ["var(--brand)", "var(--s1)", "var(--s2)", "var(--s3)", "var(--serious)", "var(--warning)"];

/**
 * Category-level rollup of the same provider_orders item data ItemSalesTab
 * uses. A category of null (the item genuinely carries none) is shown as its
 * own honest "Uncategorized" row rather than folded into an existing category
 * or silently dropped.
 */
export function CategoryPerformanceTab({ source }: { source: LiveSalesSource }) {
  const today = getCurrentBusinessDate();
  const [preset, setPreset] = useState<RangePreset>("today");
  const range = useMemo(() => computeRange(preset, today), [preset, today]);
  const sourceFilter = liveSourceFilter(source);

  const { data, isLoading, isError } = useProviderOrderItemSales({ ...sourceFilter, ...range });

  const rangeLabel =
    data?.businessDateFrom && data.businessDateFrom === data.businessDateTo
      ? data.businessDateFrom
      : data?.businessDateFrom
        ? `${data.businessDateFrom} – ${data.businessDateTo}`
        : "";

  const categories = data?.categories ?? [];
  const totalAmount = categories.reduce((s, c) => s + c.amount, 0);

  return (
    <div>
      <div className="page-head">
        <div>
          <h2 style={{ fontSize: 15, margin: "0 0 4px", color: "var(--ink-2)" }}>Category Performance</h2>
          <p className="page-desc" style={{ margin: 0 }}>
            Revenue and quantity by menu category, from the same live provider_orders item data as Item Sales. Items
            with no category recorded are shown honestly as "Uncategorized", never guessed.
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
      </div>

      {isError ? (
        <p style={{ color: "var(--critical)", fontSize: 13.5 }}>Couldn't load category performance. Check the backend connection and retry.</p>
      ) : isLoading ? (
        <p style={{ color: "var(--muted)", fontSize: 13.5 }}>Loading…</p>
      ) : categories.length === 0 ? (
        <div className="banner-not-connected">No items sold in this range yet.</div>
      ) : (
        <div className="grid2">
          <div className="card" style={{ marginBottom: 0 }}>
            <h3>Revenue by category</h3>
            <p className="h3sub">{rangeLabel}</p>
            <div className="legend">
              {categories.map((c, i) => (
                <span key={c.category ?? "uncategorized"}>
                  <span className="sw" style={{ background: DONUT_PALETTE[i % DONUT_PALETTE.length] }} />
                  {c.category ?? "Uncategorized"}
                </span>
              ))}
            </div>
            <Donut
              data={categories.map((c, i) => ({
                name: c.category ?? "Uncategorized",
                value: c.amount,
                color: DONUT_PALETTE[i % DONUT_PALETTE.length],
              }))}
              centerLabel={`₹${totalAmount.toLocaleString()}`}
              centerSub="total sales"
            />
          </div>
          <div className="card" style={{ marginBottom: 0 }}>
            <h3>Category breakdown</h3>
            <p className="h3sub">{rangeLabel}</p>
            <div className="table-scroll">
              <table>
                <thead>
                  <tr><th>Category</th><th className="num">Qty</th><th className="num">Revenue</th></tr>
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
        </div>
      )}
    </div>
  );
}
