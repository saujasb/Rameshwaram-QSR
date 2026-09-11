---
source_file: "client/src/modules/settings/SettingsPage.tsx"
type: "code"
community: "Data Explorer & Import UI"
location: "L159"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Data_Explorer__Import_UI
---

# CoverageCard()

## Connections
- [[SettingsPage.tsx]] - `contains` [EXTRACTED]
- [[formatBusinessDateLong()]] - `calls` [EXTRACTED]
- [[useDatasetCoverage()]] - `calls` [EXTRACTED]

## Source
**From** `client/src/modules/settings/SettingsPage.tsx` **(starting line 159):**
```tsx
function CoverageCard() {
  const { data: coverage, isLoading } = useDatasetCoverage();
  const rows = coverage ?? [];
  const noTimestampRows = rows.filter((c) => !c.hasTimestamps);

  return (
    <div className="card">
      <h3>Data coverage</h3>
      <p className="h3sub">What has actually been imported so far, per dataset — and what each source does not carry.</p>

      {isLoading && <p style={MUTED}>Loading coverage…</p>}

      {!isLoading && rows.length === 0 && (
        <div className="empty-state">
          <p>Nothing imported yet. Once files are imported in the Data Import Center, their coverage appears here.</p>
        </div>
      )}

      {rows.length > 0 && (
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Dataset</th>
                <th className="num">Records</th>
                <th>Business dates covered</th>
                <th className="num">Distinct products</th>
                <th>Hourly analysis</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((c) => (
                <tr key={c.datasetType}>
                  <td>{DATASET_LABELS[c.datasetType]}</td>
                  <td className="num">{c.recordCount.toLocaleString()}</td>
                  <td>
                    {c.businessDateFrom && c.businessDateTo
                      ? c.businessDateFrom === c.businessDateTo
                        ? formatBusinessDateLong(c.businessDateFrom)
                        : `${formatBusinessDateLong(c.businessDateFrom)} → ${formatBusinessDateLong(c.businessDateTo)}`
                      : "—"}
                  </td>
                  <td className="num">{c.distinctProducts.toLocaleString()}</td>
                  <td>
                    {c.hasTimestamps ? (
                      <span className="pill good" style={{ marginTop: 0 }}>
                        Available
                      </span>
                    ) : (
                      <span className="pill notconn" style={{ marginTop: 0 }}>
                        Not available
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {noTimestampRows.length > 0 && (
        <div className="callout notconn">
          Hourly analysis is unavailable for{" "}
          {noTimestampRows.map((c) => DATASET_LABELS[c.datasetType]).join(", ")} because the source files carry no
          per-transaction time — only a report date. Those rows are still counted in daily totals; they just cannot be
          split across hours, and no hourly figure is estimated for them.
        </div>
      )}
    </div>
  );
}
```

#graphify/code #graphify/EXTRACTED #community/Data_Explorer__Import_UI