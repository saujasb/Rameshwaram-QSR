---
source_file: "client/src/modules/import/ImportCenterPage.tsx"
type: "code"
community: "Data Explorer & Import UI"
location: "L214"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Data_Explorer__Import_UI
---

# RejectedRowsBlock()

## Connections
- [[ImportCenterPage.tsx]] - `contains` [EXTRACTED]

## Source
**From** `client/src/modules/import/ImportCenterPage.tsx` **(starting line 214):**
```tsx
function RejectedRowsBlock({ batch }: { batch: ImportBatch }) {
  if (!batch.rejectedRows.length) return null;
  return (
    <details className="expander">
      <summary>
        {batch.rejectedRows.length.toLocaleString()} row(s) were not imported — see exactly which and why
      </summary>
      <div className="expander-body table-scroll">
        <table className="compact">
          <thead>
            <tr>
              <th>Sheet / page</th>
              <th className="num">Row</th>
              <th>Reason it was rejected</th>
              <th>Row as it appears in the file</th>
            </tr>
          </thead>
          <tbody>
            {batch.rejectedRows.map((r, i) => (
              <tr key={i}>
                <td>{r.sourceSheet ?? "—"}</td>
                <td className="num">{r.sourceRow ?? "—"}</td>
                <td>{r.reason}</td>
                <td className="mono">{r.raw}</td>
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