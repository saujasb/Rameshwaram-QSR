---
source_file: "client/src/modules/sales-analytics/SalesAnalyticsPage.tsx"
type: "code"
community: "Dashboard & Sales Trend Visualization"
location: "L43"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Dashboard__Sales_Trend_Visualization
---

# LiveSalesSection()

## Connections
- [[SalesAnalyticsPage.tsx]] - `contains` [EXTRACTED]
- [[computeRange()]] - `calls` [EXTRACTED]
- [[formatInrCompact()]] - `calls` [EXTRACTED]
- [[getCurrentBusinessDate()]] - `calls` [EXTRACTED]
- [[shiftDateKey()]] - `calls` [EXTRACTED]
- [[useSalesSummary()]] - `calls` [EXTRACTED]
- [[useSalesTargetWithEditor()]] - `calls` [EXTRACTED]

## Source
**From** `client/src/modules/sales-analytics/SalesAnalyticsPage.tsx` **(starting line 43):**
```tsx
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
      <h2 style={{ fontSize: 15, margin: "0 0 10px", color: "var(--ink-2)" }}>Live sales — from imported reports</h2>
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
```

#graphify/code #graphify/EXTRACTED #community/Dashboard__Sales_Trend_Visualization