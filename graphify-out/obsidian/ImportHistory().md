---
source_file: "client/src/modules/import/ImportCenterPage.tsx"
type: "code"
community: "Data Explorer & Import UI"
location: "L360"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Data_Explorer__Import_UI
---

# ImportHistory()

## Connections
- [[ImportCenterPage.tsx]] - `contains` [EXTRACTED]
- [[dateRange()]] - `calls` [EXTRACTED]
- [[statusTone()]] - `calls` [EXTRACTED]
- [[useDeleteImportBatch()_1]] - `calls` [EXTRACTED]
- [[useImportBatches()_1]] - `calls` [EXTRACTED]

## Source
**From** `client/src/modules/import/ImportCenterPage.tsx` **(starting line 360):**
```tsx
function ImportHistory() {
  const { data: batches, isLoading } = useImportBatches();
  const deleteMutation = useDeleteImportBatch();

  return (
    <div className="card">
      <h3>Import history</h3>
      <p className="h3sub">Every upload, with what it added and how it scored. Undo removes only that upload's rows.</p>
      {isLoading && <p className="import-note">Loading imports…</p>}
      {!isLoading && !batches?.length && (
        <div className="empty-state">
          <p>No imports yet — drop a PDF or Excel export above and it will appear here.</p>
        </div>
      )}
      {!!batches?.length && (
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>File</th>
                <th>Source</th>
                <th>Datasets</th>
                <th>Business dates</th>
                <th className="num">Records</th>
                <th className="num">New</th>
                <th className="num">Dupes</th>
                <th className="num">Rejected</th>
                <th className="num">Quality</th>
                <th>Status</th>
                <th>Imported</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {batches.map((b) => (
                <tr key={b.id}>
                  <td>{b.fileName}</td>
                  <td>{b.sourceType === "excel" ? "Excel" : "PDF"}</td>
                  <td>{b.datasetTypes.map((d) => DATASET_LABELS[d]).join(", ") || "—"}</td>
                  <td>{dateRange(b.businessDateFrom, b.businessDateTo)}</td>
                  <td className="num">{b.recordsFound.toLocaleString()}</td>
                  <td className="num">{b.recordsInserted.toLocaleString()}</td>
                  <td className="num">{b.duplicatesSkipped.toLocaleString()}</td>
                  <td className="num">{b.recordsRejected.toLocaleString()}</td>
                  <td className="num">{Math.round(b.quality.confidencePct)}%</td>
                  <td>
                    <span className={`pill ${statusTone(b.status)}`}>{b.status}</span>
                  </td>
                  <td className="import-note">{new Date(b.createdAt).toLocaleString()}</td>
                  <td>
                    <button
                      className="btn small"
                      disabled={deleteMutation.isPending}
                      onClick={() => {
                        if (
                          confirm(
                            `Remove this import (${b.fileName})? Rows later corrected by a newer import won't be affected.`
                          )
                        ) {
                          deleteMutation.mutate(b.id);
                        }
                      }}
                    >
                      Undo
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
```

#graphify/code #graphify/EXTRACTED #community/Data_Explorer__Import_UI