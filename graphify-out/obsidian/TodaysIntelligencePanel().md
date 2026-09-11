---
source_file: "client/src/modules/intelligence/TodaysIntelligencePanel.tsx"
type: "code"
community: "Business Intelligence Engine"
location: "L92"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Business_Intelligence_Engine
---

# TodaysIntelligencePanel()

## Connections
- [[IntelligencePage.tsx]] - `imports` [EXTRACTED]
- [[TodaysIntelligencePanel.tsx]] - `contains` [EXTRACTED]
- [[fmtInr()]] - `calls` [EXTRACTED]
- [[fmtQty()]] - `calls` [EXTRACTED]
- [[formatBusinessDateLong()]] - `calls` [EXTRACTED]
- [[formatHourBucket()]] - `calls` [EXTRACTED]
- [[isUnavailable()]] - `calls` [EXTRACTED]
- [[useTodaysIntelligence()]] - `calls` [EXTRACTED]

## Source
**From** `client/src/modules/intelligence/TodaysIntelligencePanel.tsx` **(starting line 92):**
```tsx
export function TodaysIntelligencePanel({ businessDate }: { businessDate?: string }) {
  const { data, isLoading, isError, error } = useTodaysIntelligence(businessDate);

  if (isLoading) {
    return (
      <div className="card">
        <h3>Today's Intelligence</h3>
        <p className="h3sub">Reading the imported records…</p>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="card">
        <h3>Today's Intelligence</h3>
        <p className="h3sub">Computed from imported records only</p>
        <div className="banner-not-connected" style={{ marginBottom: 0 }}>
          <b>Couldn't reach the intelligence service.</b> No figures are shown rather than stale or guessed ones.
          {error instanceof Error ? ` (${error.message})` : ""}
        </div>
      </div>
    );
  }

  const noSales = isUnavailable(data.salesValue);

  return (
    <div className="card">
      <div className="page-head" style={{ marginBottom: 2 }}>
        <h3>Today's Intelligence</h3>
        <Link to="/intelligence" className="btn small">Full intelligence →</Link>
      </div>
      <p className="h3sub">
        {formatBusinessDateLong(data.businessDate)} business day · trading window starts{" "}
        {String(data.businessDayStartHour).padStart(2, "0")}:00
      </p>

      {noSales && (
        <div className="banner-not-connected">
          <b>Nothing imported for this business day yet.</b> Every row below stays "Insufficient data" until records
          exist — no zeroes are shown in place of missing data. <Link to="/sales-import">Import a report →</Link>
        </div>
      )}

      <div className="glance-grid">
        <MetricRow
          label="Sales"
          metric={data.salesValue}
          format={fmtInr}
          sub={isUnavailable(data.salesQty) ? undefined : `${fmtQty(data.salesQty.value as number)} qty ·`}
        />
        <MetricRow label="Production" metric={data.productionQty} format={fmtQty} sub="qty ·" />
        <MetricRow label="Wastage" metric={data.wastageQty} format={fmtQty} sub="qty ·" />
        <MetricRow label="Efficiency" metric={data.efficiencyPct} format={fmtPct} />
        <MetricRow label="Variance" metric={data.variancePct} format={fmtPct} />
        <MetricRow label="Sell-through" metric={data.sellThroughPct} format={fmtPct} />
        <MetricRow label="Wastage %" metric={data.wastagePct} format={fmtPct} />

        <div className="glance-row">
          <span>Peak hour</span>
          <b>
            {data.hasTimestampedData && data.peakHour ? (
              <span className="metric-val">{data.peakHour.label || formatHourBucket(data.peakHour.hour)}</span>
            ) : (
              <span
                className="metric-val metric-unavailable"
                title="The imported sales reports carry daily totals only — there is no per-transaction clock time to rank hours by."
              >
                Insufficient data
              </span>
            )}
          </b>
          <span className="muted-text">
            {data.hasTimestampedData && data.peakHour ? (
              <>
                <span className="metric-sub">{fmtInr(data.peakHour.salesValue)} </span>
                <BasisTag basis="observed" note="Ranked from per-transaction timestamps in the imported records." />
              </>
            ) : (
              <BasisTag basis="unavailable" note="No timestamped records for this business day." />
            )}
          </span>
        </div>
      </div>

      {!data.hasTimestampedData && (
        <p className="intel-honest-note">
          Hourly and peak-hour analysis is switched off for this business day: the sales PDFs imported so far carry a
          report date but no per-transaction clock time. It turns on automatically the moment a timestamped export is
          imported — nothing here is estimated in the meantime.
        </p>
      )}
    </div>
  );
}
```

#graphify/code #graphify/EXTRACTED #community/Business_Intelligence_Engine