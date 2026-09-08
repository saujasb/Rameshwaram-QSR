---
source_file: "client/src/modules/import/ImportCenterPage.tsx"
type: "code"
community: "Data Explorer & Import UI"
location: "L103"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Data_Explorer__Import_UI
---

# QualityBlock()

## Connections
- [[ImportCenterPage.tsx]] - `contains` [EXTRACTED]

## Source
**From** `client/src/modules/import/ImportCenterPage.tsx` **(starting line 103):**
```tsx
function QualityBlock({ quality }: { quality: ImportQuality }) {
  return (
    <div style={{ marginTop: 20, borderTop: "1px solid var(--line)", paddingTop: 16 }}>
      <h3>Extraction quality</h3>
      <p className="h3sub">How much of the file was read cleanly, and how confidently its columns were understood.</p>
      <Gauge label="Extraction confidence" pct={quality.confidencePct} />
      <Gauge label="Column-mapping confidence" pct={quality.mappingConfidencePct} />
      <div className="metric-grid">
        <Metric label="Rows detected" value={quality.rowsDetected} />
        <Metric label="Rows valid" value={quality.rowsValid} />
        <Metric label="Rows flagged" value={quality.rowsFlagged} />
        <Metric label="Rows rejected" value={quality.rowsRejected} />
        <Metric label="Duplicate rows" value={quality.rowsDuplicate} />
        <Metric label="No transaction time" value={quality.rowsMissingTimestamp} />
      </div>
      {quality.rowsMissingTimestamp > 0 && (
        <p className="import-note" style={{ marginTop: 10 }}>
          {quality.rowsMissingTimestamp.toLocaleString()} row(s) carry no per-transaction time in the source, so their
          business date comes from the report date and they cannot appear in hourly analysis.
        </p>
      )}
      {quality.issues.length > 0 && (
        <ul className="issue-list">
          {quality.issues.map((issue, i) => (
            <li key={`${issue.code}-${i}`} className="issue-item">
              <span className={`issue-sev ${issue.severity}`}>{issue.severity}</span>
              <span style={{ flex: 1 }}>{issue.message}</span>
              {issue.count > 0 && <span className="issue-count">×{issue.count.toLocaleString()}</span>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

#graphify/code #graphify/EXTRACTED #community/Data_Explorer__Import_UI