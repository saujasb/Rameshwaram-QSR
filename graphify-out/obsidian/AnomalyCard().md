---
source_file: "client/src/modules/intelligence/IntelligencePage.tsx"
type: "code"
community: "Business Intelligence Engine"
location: "L21"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Business_Intelligence_Engine
---

# AnomalyCard()

## Connections
- [[DATASET_LABELS_SAFE()]] - `calls` [EXTRACTED]
- [[IntelligencePage.tsx]] - `contains` [EXTRACTED]
- [[drilldownPath()]] - `calls` [EXTRACTED]
- [[fmtNum()]] - `calls` [EXTRACTED]

## Source
**From** `client/src/modules/intelligence/IntelligencePage.tsx` **(starting line 21):**
```tsx
function AnomalyCard({ a }: { a: Anomaly }) {
  const drill = drilldownPath(a.drilldownQuery);
  return (
    <div className="anomaly-row">
      <div className="anomaly-head">
        <span className={`pill ${SEVERITY_TONE[a.severity]}`}>{a.severity}</span>
        <b>{ANOMALY_KIND_LABELS[a.kind] ?? a.kind}</b>
        <span className="anomaly-when">
          {a.businessDate}
          {a.hour != null && ` · hour ${String(a.hour).padStart(2, "0")}:00`}
          {a.product && ` · ${a.product}`}
        </span>
      </div>
      <p className="anomaly-headline">{a.headline}</p>
      <div className="anomaly-figures">
        <span><span className="lbl">Expected</span> {fmtNum(a.expected, a.unit)}</span>
        <span><span className="lbl">Actual</span> {fmtNum(a.actual, a.unit)}</span>
        <span><span className="lbl">Variance</span> {a.absoluteVariance >= 0 ? "+" : ""}{fmtNum(a.absoluteVariance, a.unit)} ({a.variancePct >= 0 ? "+" : ""}{a.variancePct.toFixed(1)}%)</span>
      </div>
      <p className="anomaly-basis">Expected basis: {a.expectedBasisNote}</p>
      {a.evidence.length > 0 && (
        <ul className="anomaly-evidence">
          {a.evidence.map((e, i) => (
            <li key={i}>
              <b>{DATASET_LABELS_SAFE(e.datasetType)}</b> — {e.description} ({e.recordCount} record
              {e.recordCount === 1 ? "" : "s"}, {e.quantity.toLocaleString()} units
              {e.amount != null && `, ₹${e.amount.toLocaleString()}`})
            </li>
          ))}
        </ul>
      )}
      {drill && <Link className="btn small" to={drill}>View proving records →</Link>}
    </div>
  );
}
```

#graphify/code #graphify/EXTRACTED #community/Business_Intelligence_Engine