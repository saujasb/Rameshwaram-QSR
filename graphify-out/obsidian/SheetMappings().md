---
source_file: "client/src/modules/import/ImportCenterPage.tsx"
type: "code"
community: "Data Explorer & Import UI"
location: "L139"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Data_Explorer__Import_UI
---

# SheetMappings()

## Connections
- [[ImportCenterPage.tsx]] - `contains` [EXTRACTED]

## Source
**From** `client/src/modules/import/ImportCenterPage.tsx` **(starting line 139):**
```tsx
function SheetMappings({ sheet }: { sheet: SheetImportSummary }) {
  if (!sheet.columnMappings.length) return null;
  return (
    <details className="expander">
      <summary>How columns in “{sheet.sheetName}” were interpreted ({sheet.columnMappings.length})</summary>
      <div className="expander-body table-scroll">
        <table className="compact">
          <thead>
            <tr>
              <th>Field we need</th>
              <th>Column used from the file</th>
              <th>Matched by</th>
              <th className="num">Confidence</th>
            </tr>
          </thead>
          <tbody>
            {sheet.columnMappings.map((m, i) => (
              <tr key={`${m.normalizedField}-${i}`}>
                <td className="mapped-field">{m.normalizedField}</td>
                <td>{m.sourceColumn ?? <span className="import-note">not found in this sheet</span>}</td>
                <td>{m.matchedBy}</td>
                <td className="num">{Math.round(m.confidence)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </details>
  );
}
```

#graphify/code #graphify/EXTRACTED #community/Data_Explorer__Import_UI