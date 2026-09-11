---
source_file: "client/src/modules/sales-analytics/SalesImportPage.tsx"
type: "code"
community: "Sales Import UI"
location: "L29"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Sales_Import_UI
---

# ImportResultCard()

## Connections
- [[SalesImportPage.tsx]] - `contains` [EXTRACTED]
- [[validationTone()]] - `calls` [EXTRACTED]

## Source
**From** `client/src/modules/sales-analytics/SalesImportPage.tsx` **(starting line 29):**
```tsx
function ImportResultCard({ batch }: { batch: SalesImportBatch }) {
  const tone = validationTone(batch.validation.status);
  const title =
    tone === "good" ? "Sales Import Complete" : tone === "crit" ? "Import Completed — Validation Failed" : "Import Completed With Warnings";
  const borderColor = tone === "good" ? "var(--good)" : tone === "crit" ? "var(--critical)" : "var(--warning)";

  return (
    <div className="card" style={{ borderLeft: `3px solid ${borderColor}` }}>
      <h3>{title}</h3>
      <p className="h3sub">
        {batch.fileName} · {SALES_CHANNEL_LABELS[batch.channel]} · business date {batch.businessDate}
      </p>
      <div className="kpis" style={{ marginTop: 4 }}>
        <div className="kpi good">
          <div className="lab">Records found</div>
          <div className="val">{batch.recordsFound.toLocaleString()}</div>
          <div className="note">in this file</div>
        </div>
        <div className="kpi good">
          <div className="lab">New records</div>
          <div className="val">{batch.recordsInserted.toLocaleString()}</div>
          <div className="note">inserted</div>
        </div>
        <div className="kpi warn">
          <div className="lab">Updated</div>
          <div className="val">{batch.recordsUpdated.toLocaleString()}</div>
          <div className="note">corrected re-export</div>
        </div>
        <div className="kpi notconn">
          <div className="lab">Duplicates skipped</div>
          <div className="val">{batch.duplicatesSkipped.toLocaleString()}</div>
          <div className="note">already on file</div>
        </div>
        <div className={`kpi ${tone}`}>
          <div className="lab">Validation</div>
          <div className="val">{tone === "good" ? "✓ Passed" : tone === "crit" ? "✗ Failed" : "⚠ Warning"}</div>
          <div className="note">₹{batch.validation.actualAmount.toLocaleString()} parsed</div>
        </div>
      </div>
      {batch.validation.notes.length > 0 && (
        <ul style={{ marginTop: 14, paddingLeft: 18, fontSize: 13, color: "var(--ink-2)" }}>
          {batch.validation.notes.map((note, i) => (
            <li key={i}>{note}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

#graphify/code #graphify/EXTRACTED #community/Sales_Import_UI