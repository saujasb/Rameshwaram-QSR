---
source_file: "client/src/modules/intelligence/TopInsightsPanel.tsx"
type: "code"
community: "Data Explorer & Import UI"
location: "L73"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Data_Explorer__Import_UI
---

# MissingDataNote()

## Connections
- [[TopInsightsPanel.tsx]] - `contains` [EXTRACTED]
- [[useDatasetCoverage()]] - `calls` [EXTRACTED]

## Source
**From** `client/src/modules/intelligence/TopInsightsPanel.tsx` **(starting line 73):**
```tsx
function MissingDataNote() {
  const { data: coverage } = useDatasetCoverage();
  const present = new Set((coverage ?? []).filter((c) => c.recordCount > 0).map((c) => c.datasetType));
  const allTypes: DatasetType[] = ["sales", "production", "wastage"];
  const missing = allTypes.filter((t) => !present.has(t));
  const hasTimestamps = (coverage ?? []).some((c) => c.hasTimestamps);

  return (
    <div className="empty-state">
      <p style={{ margin: 0, maxWidth: 520 }}>
        No insights yet. Insights are only emitted when the underlying records can prove every field — what, how much,
        when, where and the rupee or quantity impact — so nothing is shown until the data supports it.
      </p>
      <p style={{ margin: "10px 0 0", maxWidth: 520, color: "var(--muted)", fontSize: 13 }}>
        {missing.length === allTypes.length ? (
          <>Nothing has been imported yet. Sales, production and wastage records are all missing.</>
        ) : missing.length > 0 ? (
          <>
            Missing so far: <b>{missing.map((m) => DATASET_LABELS[m]).join(", ")}</b>. Production-vs-sales variance,
            wastage and efficiency insights need those datasets before they can be computed.
          </>
        ) : !hasTimestamps ? (
          <>
            All three datasets are present, but none of the imported records carry per-transaction clock times, so
            hour-of-day and peak-window insights stay unavailable.
          </>
        ) : (
          <>Not enough history yet — comparisons need at least a few business days on file.</>
        )}
      </p>
      <Link to="/sales-import" className="btn small" style={{ marginTop: 14 }}>
        Import a report →
      </Link>
    </div>
  );
}
```

#graphify/code #graphify/EXTRACTED #community/Data_Explorer__Import_UI