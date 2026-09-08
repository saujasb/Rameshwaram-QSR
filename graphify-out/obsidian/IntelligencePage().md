---
source_file: "client/src/modules/intelligence/IntelligencePage.tsx"
type: "code"
community: "Business Intelligence Engine"
location: "L57"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Business_Intelligence_Engine
---

# IntelligencePage()

## Connections
- [[DATASET_LABELS_SAFE()]] - `calls` [EXTRACTED]
- [[IntelligencePage.tsx]] - `contains` [EXTRACTED]
- [[routes.tsx]] - `imports` [EXTRACTED]
- [[useAnomalies()]] - `calls` [EXTRACTED]
- [[useReconciliation()]] - `calls` [EXTRACTED]

## Source
**From** `client/src/modules/intelligence/IntelligencePage.tsx` **(starting line 57):**
```tsx
export function IntelligencePage() {
  const { data: anomalies, isLoading: anomaliesLoading } = useAnomalies();
  const { data: recon, isLoading: reconLoading } = useReconciliation();

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Business Intelligence</h1>
          <p className="page-desc">
            Reconciliation, anomalies and evidence-backed insights computed from imported records only. Anything the data
            can't support is shown as <i>Insufficient data</i> rather than estimated.
          </p>
        </div>
      </div>

      <TodaysIntelligencePanel />
      <TopInsightsPanel limit={12} />

      <div className="card">
        <h3>Anomalies</h3>
        <p className="h3sub">Each one states expected vs actual, the variance, and the records that prove it.</p>
        {anomaliesLoading && <p style={{ color: "var(--muted)" }}>Checking for anomalies…</p>}
        {!anomaliesLoading && (anomalies?.length ?? 0) === 0 && (
          <div className="empty-state" style={{ padding: "22px 20px" }}>
            <p style={{ color: "var(--muted)", fontSize: 13.5, margin: 0 }}>
              No anomalies detected. Detection compares each business day against prior days, so it needs several days of
              imported history before it can flag anything.
            </p>
          </div>
        )}
        {(anomalies ?? []).map((a) => <AnomalyCard key={a.id} a={a} />)}
      </div>

      <div className="card">
        <h3>Reconciliation — production vs sales vs wastage</h3>
        <p className="h3sub">Expected balance = production − sales − wastage, per business day.</p>

        {reconLoading && <p style={{ color: "var(--muted)" }}>Reconciling…</p>}

        {recon && recon.missingDatasets.length > 0 && (
          <div className="banner-not-connected" style={{ marginBottom: 14 }}>
            <b>Partial reconciliation.</b> No{" "}
            {recon.missingDatasets.map((d) => DATASET_LABELS_SAFE(d).toLowerCase()).join(" or ")} records have been
            imported, so the ratios that depend on them can't be computed and are shown as insufficient data rather than
            zero. <Link to="/data-import">Import those reports</Link> to complete this view.
          </div>
        )}

        {recon && recon.rows.length > 0 ? (
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Business date</th>
                  <th className="num">Production</th><th className="num">Sales</th><th className="num">Wastage</th>
                  <th className="num">Expected balance</th><th className="num">Sell-through</th>
                  <th className="num">Wastage %</th><th className="num">Efficiency</th><th className="num">Variance</th>
                </tr>
              </thead>
              <tbody>
                {recon.rows.map((r) => (
                  <tr key={r.businessDate}>
                    <td><b>{r.businessDate}</b></td>
                    <td className="num"><MetricValue metric={r.productionQty} format={fmtQty} /></td>
                    <td className="num"><MetricValue metric={r.salesQty} format={fmtQty} /></td>
                    <td className="num"><MetricValue metric={r.wastageQty} format={fmtQty} /></td>
                    <td className="num"><MetricValue metric={r.expectedBalance} format={fmtQty} /></td>
                    <td className="num"><MetricValue metric={r.sellThroughPct} format={fmtPct} /></td>
                    <td className="num"><MetricValue metric={r.wastagePct} format={fmtPct} /></td>
                    <td className="num"><MetricValue metric={r.efficiencyPct} format={fmtPct} /></td>
                    <td className="num"><MetricValue metric={r.variancePct} format={fmtPct} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          !reconLoading && (
            <div className="empty-state" style={{ padding: "22px 20px" }}>
              <p style={{ color: "var(--muted)", fontSize: 13.5, margin: 0 }}>
                Nothing to reconcile yet — import sales, production or wastage data to populate this table.
              </p>
            </div>
          )
        )}
      </div>
    </div>
  );
}
```

#graphify/code #graphify/EXTRACTED #community/Business_Intelligence_Engine