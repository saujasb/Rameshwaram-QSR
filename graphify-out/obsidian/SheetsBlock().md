---
source_file: "client/src/modules/import/ImportCenterPage.tsx"
type: "code"
community: "Data Explorer & Import UI"
location: "L170"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Data_Explorer__Import_UI
---

# SheetsBlock()

## Connections
- [[ImportCenterPage.tsx]] - `contains` [EXTRACTED]
- [[dateRange()]] - `calls` [EXTRACTED]

## Source
**From** `client/src/modules/import/ImportCenterPage.tsx` **(starting line 170):**
```tsx
function SheetsBlock({ sheets }: { sheets: SheetImportSummary[] }) {
  if (!sheets.length) return null;
  return (
    <div style={{ marginTop: 20, borderTop: "1px solid var(--line)", paddingTop: 16 }}>
      <h3>What was found in each sheet / page</h3>
      <p className="h3sub">Every sheet is listed, including the ones that were skipped and why.</p>
      <div className="table-scroll">
        <table className="compact">
          <thead>
            <tr>
              <th>Sheet</th>
              <th>Detected as</th>
              <th className="num">Detection</th>
              <th className="num">Rows detected</th>
              <th className="num">Rows imported</th>
              <th className="num">Rows rejected</th>
              <th>Business dates</th>
            </tr>
          </thead>
          <tbody>
            {sheets.map((s, i) => (
              <tr key={`${s.sheetName}-${i}`} className={s.skippedReason ? "sheet-skipped" : undefined}>
                <td>
                  {s.sheetName}
                  {s.skippedReason && <div className="import-note">Skipped — {s.skippedReason}</div>}
                </td>
                <td>{s.detectedDatasetType ? DATASET_LABELS[s.detectedDatasetType] : <span className="import-note">Not recognised</span>}</td>
                <td className="num">{Math.round(s.detectionConfidence)}%</td>
                <td className="num">{s.rowsDetected.toLocaleString()}</td>
                <td className="num">{s.rowsImported.toLocaleString()}</td>
                <td className="num">{s.rowsRejected.toLocaleString()}</td>
                <td>{dateRange(s.businessDateFrom, s.businessDateTo)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {sheets.map((s, i) => (
        <SheetMappings key={`map-${s.sheetName}-${i}`} sheet={s} />
      ))}
    </div>
  );
}
```

#graphify/code #graphify/EXTRACTED #community/Data_Explorer__Import_UI