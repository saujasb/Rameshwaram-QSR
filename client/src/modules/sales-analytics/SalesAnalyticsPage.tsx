import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { DivergingBar } from "../../components/charts/DivergingBar";
import { HBarChart } from "../../components/charts/HBarChart";
import { Donut } from "../../components/charts/Donut";
import { SalesTrendChart } from "../../components/charts/SalesTrendChart";
import { DataFreshnessBadge } from "../../components/DataFreshnessBadge";
import { useAnalyticsSnapshot, usePrioritizedActions } from "../../lib/api/analytics";
import { useSalesSummary, useLatestImportBatch } from "../../lib/api/sales";
import { useProviderOrdersRealtime } from "../../lib/api/providerOrders";
import { getCurrentBusinessDate, shiftDateKey } from "@shared/businessDate";
import { formatInrCompact } from "../../lib/format";
import { SALES_CHANNEL_LABELS } from "@shared/sales";
import { useSalesTargetWithEditor } from "../dashboard/SalesTargetEditor";
import { LiveSalesFeed } from "./LiveSalesFeed";
import { SalesAmountTab } from "./SalesAmountTab";

const SEVERITY_COLOR: Record<string, string> = {
  critical: "var(--critical)",
  serious: "var(--serious)",
  warning: "var(--warning)",
  info: "var(--brand)",
};

const CHANNEL_COLOR: Record<string, string> = {
  petpooja_pos: "var(--s2)",
  kiosk: "var(--s1)",
  petpooja_online: "var(--s3)",
};

type RangePreset = "today" | "yesterday" | "week" | "month" | "all" | "custom";

function computeRange(preset: RangePreset, customFrom: string, customTo: string): { from?: string; to?: string } {
  const today = getCurrentBusinessDate();
  if (preset === "today") return { from: today, to: today };
  if (preset === "yesterday") {
    const y = shiftDateKey(today, -1);
    return { from: y, to: y };
  }
  if (preset === "week") return { from: shiftDateKey(today, -6), to: today };
  if (preset === "month") return { from: shiftDateKey(today, -29), to: today };
  if (preset === "all") return {};
  return { from: customFrom || undefined, to: customTo || undefined };
}

function LiveSalesSection() {
  const today = getCurrentBusinessDate();
  const yesterday = shiftDateKey(today, -1);
  const lastWeek = shiftDateKey(today, -7);
  const [preset, setPreset] = useState<RangePreset>("today");
  const [customFrom, setCustomFrom] = useState(today);
  const [customTo, setCustomTo] = useState(today);
  const range = useMemo(() => computeRange(preset, customFrom, customTo), [preset, customFrom, customTo]);
  const { data: sales } = useSalesSummary(range.from, range.to);
  const { data: todaySales } = useSalesSummary(today, today);
  const { target, openEditor, editor } = useSalesTargetWithEditor();
  const targetPct = target?.amount ? ((todaySales?.totalAmount ?? 0) / target.amount) * 100 : null;

  const rangeLabel =
    sales?.businessDateFrom && sales.businessDateFrom === sales.businessDateTo
      ? sales.businessDateFrom
      : sales?.businessDateFrom
        ? `${sales.businessDateFrom} – ${sales.businessDateTo}`
        : "";

  return (
    <>
      <h2 style={{ fontSize: 15, margin: "0 0 4px", color: "var(--ink-2)" }}>
        <span className="tag neutral" style={{ fontSize: 10, marginRight: 8, verticalAlign: 1 }}>📄 BACKUP / MANUAL</span>
        Overview — from imported PDF reports
      </h2>
      <p className="page-desc" style={{ margin: "0 0 10px" }}>
        For live, automatically-updating figures see the <b>Live Feed</b> and <b>Sales Amount</b> tabs above — those come
        straight from Petpooja, no upload required.
      </p>
      <div className="filters-bar">
        <select value={preset} onChange={(e) => setPreset(e.target.value as RangePreset)}>
          <option value="today">Today</option>
          <option value="yesterday">Yesterday</option>
          <option value="week">Last 7 days</option>
          <option value="month">Last 30 days</option>
          <option value="all">All time</option>
          <option value="custom">Custom range</option>
        </select>
        {preset === "custom" && (
          <>
            <input type="date" value={customFrom} onChange={(e) => setCustomFrom(e.target.value)} />
            <input type="date" value={customTo} onChange={(e) => setCustomTo(e.target.value)} />
          </>
        )}
        <Link to="/sales-import" className="btn small">Import a report →</Link>
      </div>

      {!sales || sales.totalAmount === 0 ? (
        <div className="banner-not-connected" style={{ marginBottom: 18 }}>
          No sales data imported for this range yet. <Link to="/sales-import">Upload a sales PDF</Link> to populate
          Total Sales, Sales by Channel, Top Items, Category performance and the Sales Trend below — nothing here is
          invented.
        </div>
      ) : (
        <>
          <div className="kpis" style={{ marginBottom: 18 }}>
            <div className="kpi good">
              <div className="lab">Total Sales</div>
              <div className="val">{formatInrCompact(sales.totalAmount)}</div>
              <div className="note">{sales.totalQuantity.toLocaleString()} items · {rangeLabel}</div>
            </div>
            {sales.byChannel.map((c) => (
              <div className="kpi good" key={c.channel}>
                <div className="lab">{SALES_CHANNEL_LABELS[c.channel]}</div>
                <div className="val">{formatInrCompact(c.amount)}</div>
                <div className="note">{c.quantity.toLocaleString()} items</div>
              </div>
            ))}
            <button className={`kpi ${targetPct == null ? "notconn" : targetPct >= 100 ? "good" : targetPct >= 85 ? "warn" : "crit"}`} onClick={openEditor}>
              <div className="lab">Target Achievement</div>
              <div className="val">{targetPct != null ? `${Math.round(targetPct)}%` : "Set a target"}</div>
              <div className="note">{target?.amount ? `today vs ₹${target.amount.toLocaleString()} · click to edit` : "click to set a daily target"}</div>
            </button>
            <div className={`kpi ${sales.hasHourlyData ? "good" : "notconn"}`}>
              <div className="lab">Hourly breakdown</div>
              <div className="val" style={sales.hasHourlyData ? undefined : { fontSize: 14.5 }}>
                {sales.hasHourlyData ? "Available" : "Not available"}
              </div>
              <div className="note">{sales.hasHourlyData ? "per-order timestamps found" : "these reports have no per-order time data"}</div>
            </div>
          </div>
          {editor}

          <div className="grid2">
            <div className="card" style={{ marginBottom: 0 }}>
              <h3>Sales by channel</h3>
              <p className="h3sub">{rangeLabel}</p>
              <div className="legend">
                {sales.byChannel.map((c) => (
                  <span key={c.channel}>
                    <span className="sw" style={{ background: CHANNEL_COLOR[c.channel] ?? "var(--brand)" }} />
                    {SALES_CHANNEL_LABELS[c.channel]}
                  </span>
                ))}
              </div>
              <Donut
                data={sales.byChannel.map((c) => ({
                  name: SALES_CHANNEL_LABELS[c.channel],
                  value: c.amount,
                  color: CHANNEL_COLOR[c.channel] ?? "var(--brand)",
                }))}
                centerLabel={`₹${sales.totalAmount.toLocaleString()}`}
                centerSub="total sales"
              />
            </div>
            <div className="card" style={{ marginBottom: 0 }}>
              <h3>Top items</h3>
              <p className="h3sub">By revenue, {rangeLabel}</p>
              <HBarChart
                data={sales.topItems.map((t) => ({ name: t.itemName, value: t.amount }))}
                defaultColor="var(--brand)"
                valueFormatter={(v) => `₹${v.toLocaleString()}`}
              />
            </div>
          </div>

          <div className="card" style={{ marginTop: 18 }}>
            <h3>Category performance</h3>
            <p className="h3sub">Revenue by menu category, {rangeLabel}</p>
            <div className="table-scroll">
              <table>
                <thead>
                  <tr><th>Category</th><th className="num">Qty</th><th className="num">Revenue</th></tr>
                </thead>
                <tbody>
                  {sales.byCategory.map((c) => (
                    <tr key={c.category}>
                      <td>{c.category}</td>
                      <td className="num">{c.quantity.toLocaleString()}</td>
                      <td className="num">₹{c.amount.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="card">
            <h3>Sales trend</h3>
            <p className="h3sub">By business date · target shown as dashed line</p>
            <SalesTrendChart
              data={sales.dailyTrend}
              target={target?.amount}
              markers={[
                { businessDate: today, label: "Today", color: "var(--brand)" },
                { businessDate: yesterday, label: "Yesterday", color: "var(--s2)" },
                { businessDate: lastWeek, label: "Last week", color: "var(--s3)" },
              ]}
            />
          </div>
        </>
      )}
    </>
  );
}

type SalesTab = "overview" | "live" | "amount";

const TAB_LABELS: Record<SalesTab, string> = {
  overview: "Overview",
  live: "🟢 Live Feed",
  amount: "Sales Amount",
};

export function SalesAnalyticsPage() {
  const { data: snap, isLoading } = useAnalyticsSnapshot();
  const { data: actions } = usePrioritizedActions();
  const { data: latestBatch } = useLatestImportBatch();
  const connection = useProviderOrdersRealtime();
  const [tab, setTab] = useState<SalesTab>("overview");

  if (isLoading || !snap) return <p style={{ color: "var(--muted)" }}>Loading…</p>;

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Sales & Revenue</h1>
          <p className="page-desc">
            <b>Live Feed</b> and <b>Sales Amount</b> stream straight from Petpooja (primary source) the moment an order
            is billed. <b>Overview</b> holds the PDF-import figures (backup / manual source) plus the one-day
            operations snapshot from <b>{snap.reportDate}</b> — a separate, one-time report.
          </p>
        </div>
        <DataFreshnessBadge lastSyncedAt={latestBatch?.createdAt ?? null} />
      </div>

      <div className="filters-bar" style={{ marginBottom: 18 }}>
        {(Object.keys(TAB_LABELS) as SalesTab[]).map((t) => (
          <button
            key={t}
            className="btn small"
            onClick={() => setTab(t)}
            style={tab === t ? { background: "var(--brand)", color: "var(--on-brand, #fff)", borderColor: "var(--brand)" } : undefined}
          >
            {TAB_LABELS[t]}
          </button>
        ))}
      </div>

      {tab === "live" && <LiveSalesFeed connection={connection} />}
      {tab === "amount" && <SalesAmountTab connection={connection} />}
      {tab === "overview" && (
      <>

      <LiveSalesSection />

      <h2 style={{ fontSize: 15, margin: "26px 0 10px", color: "var(--ink-2)" }}>One-day operations snapshot — {snap.reportDate}</h2>

      <div className="kpis" style={{ marginBottom: 18 }}>
        <div className="kpi good"><div className="lab">Items Sold</div><div className="val">{snap.itemsSold.toLocaleString()}</div><div className="note">across 3 channels</div></div>
        <div className="kpi good"><div className="lab">Production</div><div className="val">{snap.productionKg} kg</div><div className="note">2 shifts combined</div></div>
        <div className="kpi ser"><div className="lab">Wastage</div><div className="val">{snap.wastagePct}%</div><div className="note">{snap.wastageKg} kg · target &lt;2% · <Link to="/wastage">see tracker</Link></div></div>
        <div className="kpi crit"><div className="lab">Variance breaches</div><div className="val">{snap.varianceBreaches} items</div><div className="note">outside ±10% band</div></div>
        <div className="kpi warn"><div className="lab">Recipe vs actual</div><div className="val">₹{snap.recipeVsActualRupees.toLocaleString()}</div><div className="note">net consumption gap</div></div>
      </div>

      <div className="grid2">
        <div className="card" style={{ marginBottom: 0 }}>
          <h3>Sales by channel</h3>
          <p className="h3sub">{snap.reportDate}</p>
          <div className="legend">
            <span><span className="sw" style={{ background: "var(--s1)" }} />Kiosk</span>
            <span><span className="sw" style={{ background: "var(--s2)" }} />PetPooja (Counter/POS)</span>
            <span><span className="sw" style={{ background: "var(--s3)" }} />Online</span>
          </div>
          <Donut
            data={[
              { name: "PetPooja (Counter/POS)", value: snap.channelMix[0].value, color: "var(--s2)" },
              { name: "Kiosk", value: snap.channelMix[1].value, color: "var(--s1)" },
              { name: "Online", value: snap.channelMix[2].value, color: "var(--s3)" },
            ]}
            centerLabel={snap.itemsSold.toLocaleString()}
            centerSub="items sold"
          />
        </div>
        <div className="card" style={{ marginBottom: 0 }}>
          <h3>Top 10 sellers</h3>
          <p className="h3sub">{snap.reportDate}</p>
          <HBarChart data={snap.topSellers.map((t) => ({ name: t.name, value: t.unitsSold }))} defaultColor="var(--brand)" />
        </div>
      </div>

      <div className="card" style={{ marginTop: 18 }}>
        <h3>Production vs sales variance</h3>
        <p className="h3sub">Kilograms. Right of zero = over-produced; left = under-produced vs sales. {snap.reportDate}.</p>
        <div className="legend">
          <span><span className="sw" style={{ background: "var(--s2)" }} />Over-produced</span>
          <span><span className="sw" style={{ background: "var(--s1)" }} />Under-produced</span>
        </div>
        <DivergingBar
          data={snap.variance.map((v) => ({
            name: v.name,
            value: v.netDiffKg,
            tooltip: `${v.name}: produced ${v.producedKg}kg, consumed ${v.consumedKg}kg, sold ${v.soldPlates} plates — ${v.variancePct > 0 ? "+" : ""}${v.variancePct}%`,
          }))}
          valueFormatter={(v) => `${v > 0 ? "+" : ""}${v.toFixed(1)}kg`}
        />
      </div>

      <div className="card">
        <h3>Cost reconciliation — recipe vs actual (₹)</h3>
        <p className="h3sub">Left of zero = under-consumed vs recipe. Right of zero = over-consumed vs sales. {snap.reportDate}.</p>
        <div className="legend">
          <span><span className="sw" style={{ background: "var(--s1)" }} />Under-consumed</span>
          <span><span className="sw" style={{ background: "var(--s2)" }} />Over-consumed</span>
        </div>
        <DivergingBar
          data={snap.costVariance.map((c) => ({ name: c.name, value: c.varianceRupees }))}
          valueFormatter={(v) => `₹${v > 0 ? "+" : ""}${v.toLocaleString()}`}
        />
      </div>

      {actions && actions.length > 0 && (
        <div className="card">
          <h3>Prioritised actions from the {snap.reportDate} report</h3>
          {actions.map((a, i) => (
            <div className="action" key={a.id}>
              <div className="rank" style={{ background: SEVERITY_COLOR[a.severity] }}>{i + 1}</div>
              <div className="body"><b>{a.title}</b><p>{a.detail}</p></div>
              <div className="impact">{a.impact}</div>
            </div>
          ))}
        </div>
      )}
      </>
      )}
    </div>
  );
}
