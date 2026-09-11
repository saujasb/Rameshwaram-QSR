---
source_file: "client/src/modules/sales-analytics/SalesImportPage.tsx"
type: "code"
community: "Sales Import UI"
location: "L1"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Sales_Import_UI
---

# SalesImportPage.tsx

## Connections
- [[IMPORT_STEPS]] - `contains` [EXTRACTED]
- [[ImportError]] - `imports` [EXTRACTED]
- [[ImportResultCard()]] - `contains` [EXTRACTED]
- [[ImportValidationStatus]] - `imports` [EXTRACTED]
- [[SALES_CHANNEL_LABELS]] - `imports` [EXTRACTED]
- [[SalesImportBatch]] - `imports` [EXTRACTED]
- [[SalesImportPage()]] - `contains` [EXTRACTED]
- [[apisales.ts]] - `imports_from` [EXTRACTED]
- [[businessDate.ts]] - `imports_from` [EXTRACTED]
- [[getCurrentBusinessDate()]] - `imports` [EXTRACTED]
- [[routes.tsx]] - `imports_from` [EXTRACTED]
- [[shared-typessales.ts]] - `imports_from` [EXTRACTED]
- [[useDeleteImportBatch()]] - `imports` [EXTRACTED]
- [[useImportBatches()]] - `imports` [EXTRACTED]
- [[useImportSalesPdf()]] - `imports` [EXTRACTED]
- [[useStagedProgress()]] - `contains` [EXTRACTED]
- [[validationTone()]] - `contains` [EXTRACTED]

## Source
**Full file:** `client/src/modules/sales-analytics/SalesImportPage.tsx`
```tsx
import { useEffect, useRef, useState } from "react";
import type { DragEvent, FormEvent } from "react";
import { getCurrentBusinessDate } from "@shared/businessDate";
import { SALES_CHANNEL_LABELS } from "@shared/sales";
import type { SalesImportBatch, ImportValidationStatus } from "@shared/sales";
import { useImportBatches, useImportSalesPdf, useDeleteImportBatch, type ImportError } from "../../lib/api/sales";

const IMPORT_STEPS = ["Reading PDF", "Extracting transactions", "Validating data", "Calculating business dates", "Checking duplicates", "Updating dashboard"];

function useStagedProgress(active: boolean, stepCount: number, stepDurationMs = 850): number {
  const [step, setStep] = useState(0);
  useEffect(() => {
    if (!active) {
      setStep(0);
      return;
    }
    const id = setInterval(() => setStep((s) => Math.min(s + 1, stepCount - 1)), stepDurationMs);
    return () => clearInterval(id);
  }, [active, stepCount, stepDurationMs]);
  return step;
}

function validationTone(status: ImportValidationStatus): "good" | "warn" | "crit" {
  if (status === "passed") return "good";
  if (status === "failed") return "crit";
  return "warn";
}

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