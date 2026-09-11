---
source_file: "client/src/modules/sales-analytics/SalesImportPage.tsx"
type: "code"
community: "Sales Import UI"
location: "L79"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Sales_Import_UI
---

# SalesImportPage()

## Connections
- [[SalesImportPage.tsx]] - `contains` [EXTRACTED]
- [[getCurrentBusinessDate()]] - `calls` [EXTRACTED]
- [[handleDrop()]] - `contains` [EXTRACTED]
- [[handleSubmit()]] - `contains` [EXTRACTED]
- [[routes.tsx]] - `imports` [EXTRACTED]
- [[useDeleteImportBatch()]] - `calls` [EXTRACTED]
- [[useImportBatches()]] - `calls` [EXTRACTED]
- [[useImportSalesPdf()]] - `calls` [EXTRACTED]
- [[useStagedProgress()]] - `calls` [EXTRACTED]
- [[validationTone()]] - `calls` [EXTRACTED]

## Source
**From** `client/src/modules/sales-analytics/SalesImportPage.tsx` **(starting line 79):**
```tsx
export function SalesImportPage() {
  const [file, setFile] = useState<File | null>(null);
  const [businessDate, setBusinessDate] = useState(getCurrentBusinessDate());
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const importMutation = useImportSalesPdf();
  const { data: batches } = useImportBatches();
  const deleteMutation = useDeleteImportBatch();
  const progressStep = useStagedProgress(importMutation.isPending, IMPORT_STEPS.length);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!file) return;
    importMutation.mutate({ file, businessDate });
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragging(false);
    const dropped = e.dataTransfer.files?.[0];
    if (dropped) setFile(dropped);
  }

  const error = importMutation.error as ImportError | null;

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Sales Data Import</h1>
          <p className="page-desc">
            Upload a daily sales-export PDF from the Kiosk, PetPooja counter POS, or PetPooja Online. It's parsed,
            checked against the report's own totals, and merged into the sales data behind the Dashboard and Sales &amp;
            Revenue pages. Safe to re-upload the same file — duplicate rows are skipped, never double-counted.
          </p>
        </div>
      </div>

      <div className="card">
        <h3>Import Sales Data</h3>
        <p className="h3sub">PDF only, one business day per file.</p>
        <form onSubmit={handleSubmit}>
          <div
            className={`dropzone${isDragging ? " dragging" : ""}${file ? " has-file" : ""}`}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            role="button"
            tabIndex={0}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf,.pdf"
              style={{ display: "none" }}
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
            {file ? (
              <>
                <div className="dropzone-icon">📄</div>
                <div className="dropzone-title">{file.name}</div>
                <div className="dropzone-sub">{(file.size / 1024).toFixed(0)} KB · click or drop to replace</div>
              </>
            ) : (
              <>
                <div className="dropzone-icon">⇧</div>
                <div className="dropzone-title">Drag &amp; drop your sales PDF here</div>
                <div className="dropzone-sub">or</div>
                <button
                  type="button"
                  className="btn primary small"
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                >
                  Browse Files
                </button>
                <div className="dropzone-sub" style={{ marginTop: 8 }}>
                  Supported format: PDF
                </div>
              </>
            )}
          </div>

          <div className="form-grid" style={{ marginTop: 14 }}>
            <div className="field">
              <label>Business date</label>
              <input type="date" value={businessDate} onChange={(e) => setBusinessDate(e.target.value)} />
            </div>
          </div>
          <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 10 }}>
            Only used when the report itself has no date printed in it (Kiosk exports). PetPooja reports carry their
            own date — if it doesn't match what's set here, the import is rejected rather than silently relabeled.
          </p>
          <div className="btn-row">
            <button type="submit" className="btn primary" disabled={!file || importMutation.isPending}>
              Import
            </button>
          </div>
        </form>
      </div>

      {importMutation.isPending && (
        <div className="card">
          <h3>Processing…</h3>
          <div className="progress-steps">
            {IMPORT_STEPS.map((label, i) => (
              <div key={label} className={`progress-step${i < progressStep ? " done" : i === progressStep ? " active" : ""}`}>
                <span className="progress-step-dot" />
                {label}
              </div>
            ))}
          </div>
        </div>
      )}

      {error && (
        <div className="card" style={{ borderLeft: "3px solid var(--critical)" }}>
          <h3 style={{ color: "var(--critical)" }}>Import failed</h3>
          <p>{error.message}</p>
          {error.detail && <p style={{ color: "var(--ink-2)", fontSize: 13 }}>{error.detail}</p>}
        </div>
      )}

      {importMutation.data && <ImportResultCard batch={importMutation.data} />}

      <div className="card">
        <h3>Import history</h3>
        {!batches?.length && (
          <div className="empty-state">
            <p>No imports yet — upload a report above to get started.</p>
          </div>
        )}
        {batches && batches.length > 0 && (
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>File</th>
                  <th>Channel</th>
                  <th>Business date</th>
                  <th className="num">Records</th>
                  <th className="num">New</th>
                  <th className="num">Updated</th>
                  <th className="num">Dupes</th>
                  <th>Validation</th>
                  <th>Imported</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {batches.map((b) => (
                  <tr key={b.id}>
                    <td>{b.fileName}</td>
                    <td>{SALES_CHANNEL_LABELS[b.channel]}</td>
                    <td>{b.businessDate}</td>
                    <td className="num">{b.recordsFound}</td>
                    <td className="num">{b.recordsInserted}</td>
                    <td className="num">{b.recordsUpdated}</td>
                    <td className="num">{b.duplicatesSkipped}</td>
                    <td>
                      <span className={`pill ${validationTone(b.validation.status)}`}>{b.validation.status}</span>
                    </td>
                    <td style={{ fontSize: 12, color: "var(--ink-2)" }}>{new Date(b.createdAt).toLocaleString()}</td>
                    <td>
                      <button
                        className="btn small"
                        onClick={() => {
                          if (confirm(`Remove this import (${b.fileName})? Rows later corrected by a newer import won't be affected.`)) {
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
    </div>
  );
}
```

#graphify/code #graphify/EXTRACTED #community/Sales_Import_UI