import { useMemo, useState } from "react";
import { Donut } from "../../components/charts/Donut";
import { SalesTrendChart } from "../../components/charts/SalesTrendChart";
import { useProviderOrderSalesSummary, useProviderOrders, type RealtimeStatus } from "../../lib/api/providerOrders";
import { PROVIDER_ORDER_TYPE_LABELS, SALES_CHANNEL_DISPLAY_LABELS } from "@shared/providerOrders";
import { getCurrentBusinessDate, shiftDateKey } from "@shared/businessDate";
import { formatInrCompact } from "../../lib/format";
import { SALES_SOURCE_LABELS, liveSourceFilter, type LiveSalesSource } from "./salesSource";

const TYPE_COLOR: Record<string, string> = {
  dine_in: "var(--s1)",
  pick_up: "var(--s2)",
  delivery: "var(--s3)",
  other: "var(--muted)",
};

const CHANNEL_COLOR: Record<string, string> = {
  petpooja_pos: "var(--s2)",
  kiosk: "var(--s1)",
  petpooja_online: "var(--s3)",
  other: "var(--muted)",
};

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

/**
 * Sales Amount tab -- same source of truth as the Live Feed (provider_orders,
 * status = 'success', scoped to whichever live source is selected). Never
 * reads dataset_records / the PDF import, per the brief: "Do NOT calculate
 * sales from the PDF if live provider orders are available."
 */
export function SalesAmountTab({ connection, source }: { connection: RealtimeStatus; source: LiveSalesSource }) {
  const today = getCurrentBusinessDate();
  const [preset, setPreset] = useState<RangePreset>("today");
  const range = useMemo(() => computeRange(preset, today), [preset, today]);
  const label = SALES_SOURCE_LABELS[source];
  const sourceFilter = liveSourceFilter(source);
  const combined = source === "combined";

  const { data: summary } = useProviderOrderSalesSummary({ ...sourceFilter, ...range });
  const { data: todaySummary } = useProviderOrderSalesSummary({ ...sourceFilter, from: today, to: today });
  const { data: recentOrders } = useProviderOrders({ ...sourceFilter, status: "success" });

  const rangeLabel =
    summary?.businessDateFrom && summary.businessDateFrom === summary.businessDateTo
      ? summary.businessDateFrom
      : summary?.businessDateFrom
        ? `${summary.businessDateFrom} – ${summary.businessDateTo}`
        : "";

  return (
    <div>
      <div className="page-head">
        <div>
          <h2 style={{ fontSize: 15, margin: "0 0 4px", color: "var(--ink-2)" }}>
            Sales Amount — {combined ? "all live sources combined" : `live ${label} orders`}
          </h2>
          <p className="page-desc" style={{ margin: 0 }}>
            Computed directly from successful provider_orders — the same source as the Live Feed above, never the PDF import.
          </p>
        </div>
        <span className={`freshness ${connection === "live" ? "good" : "warn"}`}>
          <span className={`status-dot ${connection === "live" ? "good" : "warn"}`} />
          {connection === "live" ? "Live" : "Polling"}
        </span>
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

      {!summary || summary.totalOrders === 0 ? (
        <div className="banner-not-connected" style={{ marginBottom: 18 }}>
          No successful {combined ? "" : `${label} `}orders in this range yet. They'll show up here the moment one comes in.
        </div>
      ) : (
        <>
          <div className="kpis" style={{ marginBottom: 18 }}>
            <div className="kpi good">
              <div className="lab">Total Sales</div>
              <div className="val">{formatInrCompact(summary.totalAmount)}</div>
              <div className="note">{summary.totalOrders.toLocaleString()} orders · {rangeLabel}</div>
            </div>
            <div className="kpi good">
              <div className="lab">Today's Sales</div>
              <div className="val">{formatInrCompact(todaySummary?.totalAmount ?? 0)}</div>
              <div className="note">{(todaySummary?.totalOrders ?? 0).toLocaleString()} orders today</div>
            </div>
            <div className="kpi good">
              <div className="lab">Number of Orders</div>
              <div className="val">{summary.totalOrders.toLocaleString()}</div>
              <div className="note">{rangeLabel}</div>
            </div>
            <div className="kpi good">
              <div className="lab">Average Order Value</div>
              <div className="val">{formatInrCompact(summary.averageOrderValue)}</div>
              <div className="note">per successful order</div>
            </div>
          </div>

          <div className="grid2">
            <div className="card" style={{ marginBottom: 0 }}>
              <h3>Sales by order type</h3>
              <p className="h3sub">{rangeLabel}</p>
              <div className="legend">
                {summary.byOrderType.map((t) => (
                  <span key={t.orderType}>
                    <span className="sw" style={{ background: TYPE_COLOR[t.orderType] ?? "var(--brand)" }} />
                    {PROVIDER_ORDER_TYPE_LABELS[t.orderType]}
                  </span>
                ))}
              </div>
              <Donut
                data={summary.byOrderType.map((t) => ({
                  name: PROVIDER_ORDER_TYPE_LABELS[t.orderType],
                  value: t.amount,
                  color: TYPE_COLOR[t.orderType] ?? "var(--brand)",
                }))}
                centerLabel={`₹${summary.totalAmount.toLocaleString()}`}
                centerSub="total sales"
              />
            </div>
            {combined ? (
              <div className="card" style={{ marginBottom: 0 }}>
                <h3>Sales by channel</h3>
                <p className="h3sub">{rangeLabel}</p>
                <div className="legend">
                  {summary.byChannel.map((c) => (
                    <span key={c.channel}>
                      <span className="sw" style={{ background: CHANNEL_COLOR[c.channel] ?? "var(--brand)" }} />
                      {SALES_CHANNEL_DISPLAY_LABELS[c.channel]}
                    </span>
                  ))}
                </div>
                <Donut
                  data={summary.byChannel.map((c) => ({
                    name: SALES_CHANNEL_DISPLAY_LABELS[c.channel],
                    value: c.amount,
                    color: CHANNEL_COLOR[c.channel] ?? "var(--brand)",
                  }))}
                  centerLabel={`₹${summary.totalAmount.toLocaleString()}`}
                  centerSub="total sales"
                />
              </div>
            ) : (
              <div className="card" style={{ marginBottom: 0 }}>
                <h3>Recent sales</h3>
                <p className="h3sub">Latest successful {label} orders</p>
                <div className="table-scroll">
                  <table>
                    <thead>
                      <tr><th>Order</th><th>Type</th><th className="num">Amount</th></tr>
                    </thead>
                    <tbody>
                      {(recentOrders ?? []).slice(0, 10).map((o) => (
                        <tr key={o.id}>
                          <td>#{o.providerOrderId}</td>
                          <td>{PROVIDER_ORDER_TYPE_LABELS[o.orderType]}</td>
                          <td className="num">₹{o.totalAmount.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {combined && (
            <div className="card" style={{ marginTop: 18 }}>
              <h3>Recent sales</h3>
              <p className="h3sub">Latest successful orders across all sources</p>
              <div className="table-scroll">
                <table>
                  <thead>
                    <tr><th>Order</th><th>Source</th><th>Type</th><th className="num">Amount</th></tr>
                  </thead>
                  <tbody>
                    {(recentOrders ?? []).slice(0, 10).map((o) => (
                      <tr key={o.id}>
                        <td>#{o.providerOrderId}</td>
                        <td>{SALES_SOURCE_LABELS[o.provider]}</td>
                        <td>{PROVIDER_ORDER_TYPE_LABELS[o.orderType]}</td>
                        <td className="num">₹{o.totalAmount.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className="card">
            <h3>Sales over time</h3>
            <p className="h3sub">By business date</p>
            <SalesTrendChart data={summary.dailyTrend} markers={[{ businessDate: today, label: "Today", color: "var(--brand)" }]} />
          </div>
        </>
      )}
    </div>
  );
}
