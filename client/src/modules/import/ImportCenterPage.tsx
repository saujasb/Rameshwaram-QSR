import { useEffect, useRef, useState } from "react";
import type { DragEvent, FormEvent, KeyboardEvent } from "react";
import { formatBusinessDateLong, getCurrentBusinessDate } from "@shared/businessDate";
import { DATASET_LABELS } from "@shared/datasets";
import type { ImportBatch, ImportQuality, ImportStatus, SheetImportSummary } from "@shared/datasets";
import {
  useDeleteImportBatch,
  useImportBatches,
  useImportFiles,
  type ImportFileResult,
} from "../../lib/api/datasets";
import "./importCenter.css";

const ACCEPT = ".pdf,.xlsx,.xls,.xlsm";

/** Presentational pacing only — the server call is one request, so these are the
 *  stages the importer runs through, not per-stage progress reported back to us. */
const IMPORT_STEPS = [
  "Uploading",
  "Reading file",
  "Detecting schema",
  "Extracting rows",
  "Validating",
  "Deduplicating",
  "Calculating business dates",
  "Import complete",
];

function useStagedProgress(active: boolean, stepCount: number, stepDurationMs = 750): number {
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

type Tone = "good" | "warn" | "crit";

function statusTone(status: ImportStatus): Tone {
  if (status === "passed") return "good";
  if (status === "failed") return "crit";
  return "warn";
}

function pctTone(pct: number): Tone {
  if (pct >= 90) return "good";
  if (pct >= 70) return "warn";
  return "crit";
}

function toneColor(tone: Tone): string {
  return tone === "good" ? "var(--good)" : tone === "crit" ? "var(--critical)" : "var(--warning)";
}

function fmtBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function fileIcon(name: string): string {
  return /\.(xlsx|xls|xlsm)$/i.test(name) ? "▦" : "▤";
}

function fileKindLabel(name: string): string {
  return /\.(xlsx|xls|xlsm)$/i.test(name) ? "Excel workbook" : "PDF report";
}

function dateRange(from: string | null, to: string | null): string {
  if (!from && !to) return "No dates";
  if (from && to && from !== to) return `${formatBusinessDateLong(from)} → ${formatBusinessDateLong(to)}`;
  const single = from ?? to;
  return single ? formatBusinessDateLong(single) : "No dates";
}

function Gauge({ label, pct }: { label: string; pct: number }) {
  const clamped = Math.max(0, Math.min(100, Math.round(pct)));
  return (
    <div className="gauge">
      <span className="gauge-label">{label}</span>
      <span className="gauge-track">
        <span className={`gauge-fill ${pctTone(clamped)}`} style={{ width: `${clamped}%` }} />
      </span>
      <span className="gauge-val">{clamped}%</span>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="metric">
      <div className="lab">{label}</div>
      <div className="val">{value.toLocaleString()}</div>
    </div>
  );
}

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

function SuccessCard({ batch }: { batch: ImportBatch }) {
  const tone = statusTone(batch.status);
  const title =
    tone === "good"
      ? "Sales Import Complete"
      : tone === "crit"
        ? "Import Completed — Validation Failed"
        : "Import Completed With Warnings";
  const qualityTone = pctTone(batch.quality.confidencePct);

  return (
    <div className="card" style={{ borderLeft: `3px solid ${toneColor(tone)}` }}>
      <h3>{title}</h3>
      <p className="h3sub">
        {batch.fileName} · {batch.sourceType === "excel" ? "Excel workbook" : "PDF report"} ·{" "}
        {batch.datasetTypes.length ? batch.datasetTypes.map((d) => DATASET_LABELS[d]).join(", ") : "No dataset detected"} ·{" "}
        {fmtBytes(batch.fileSizeBytes)}
      </p>
      <div className="kpis" style={{ marginTop: 4 }}>
        <div className="kpi good">
          <div className="lab">Records found</div>
          <div className="val">{batch.recordsFound.toLocaleString()}</div>
          <div className="note">rows read from this file</div>
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
        <div className={`kpi ${batch.recordsRejected > 0 ? "crit" : "good"}`}>
          <div className="lab">Rejected</div>
          <div className="val">{batch.recordsRejected.toLocaleString()}</div>
          <div className="note">not imported</div>
        </div>
        <div className="kpi notconn">
          <div className="lab">Business dates</div>
          <div className="val">{dateRange(batch.businessDateFrom, batch.businessDateTo)}</div>
          <div className="note">bucketed from {String(batch.businessDayStartHour).padStart(2, "0")}:00</div>
        </div>
        <div className={`kpi ${qualityTone}`}>
          <div className="lab">Quality score</div>
          <div className="val">{Math.round(batch.quality.confidencePct)}%</div>
          <div className="note">clean rows vs rows detected</div>
        </div>
        <div className={`kpi ${tone}`}>
          <div className="lab">Validation</div>
          <div className="val">{tone === "good" ? "✓ Passed" : tone === "crit" ? "✗ Failed" : "⚠ Warning"}</div>
          <div className="note">{batch.quality.issues.length} issue(s) noted</div>
        </div>
      </div>

      <QualityBlock quality={batch.quality} />
      <SheetsBlock sheets={batch.sheets} />
      <RejectedRowsBlock batch={batch} />
    </div>
  );
}

function FailureCard({
  result,
  onImportAnyway,
  pending,
}: {
  result: ImportFileResult;
  onImportAnyway: (fileName: string) => void;
  pending: boolean;
}) {
  const dup = result.duplicateOf;
  return (
    <div className="card" style={{ borderLeft: "3px solid var(--critical)" }}>
      <h3 style={{ color: dup ? "var(--warning)" : "var(--critical)" }}>
        {dup ? "Already imported — nothing was changed" : "Import failed"}
      </h3>
      <p className="h3sub">{result.fileName}</p>
      {dup ? (
        <>
          <p style={{ margin: 0 }}>
            This is the same file that was already imported as <b>{dup.fileName}</b> on{" "}
            {new Date(dup.createdAt).toLocaleString()}, covering {dateRange(dup.businessDateFrom, dup.businessDateTo)}.
            Nothing was imported again, so no number was double-counted.
          </p>
          <p className="import-note" style={{ marginTop: 8 }}>
            If this really is a fresh export that happens to be byte-identical, you can force it through — rows that
            already exist will still be de-duplicated on their own fingerprints.
          </p>
          <div className="btn-row">
            <button className="btn" disabled={pending} onClick={() => onImportAnyway(result.fileName)}>
              Import anyway
            </button>
          </div>
        </>
      ) : (
        <>
          <p style={{ margin: 0 }}>{result.error ?? "The file could not be imported."}</p>
          {result.detail && (
            <p style={{ color: "var(--ink-2)", fontSize: 13, marginTop: 6 }}>{result.detail}</p>
          )}
        </>
      )}
    </div>
  );
}

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

export function ImportCenterPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [businessDate, setBusinessDate] = useState(getCurrentBusinessDate());
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const importMutation = useImportFiles();
  const progressStep = useStagedProgress(importMutation.isPending, IMPORT_STEPS.length - 1);

  function addFiles(incoming: FileList | null) {
    if (!incoming?.length) return;
    const next = Array.from(incoming);
    setFiles((prev) => [...prev, ...next.filter((f) => !prev.some((p) => p.name === f.name && p.size === f.size))]);
  }

  function openPicker() {
    fileInputRef.current?.click();
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragging(false);
    addFiles(e.dataTransfer.files);
  }

  function handleKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openPicker();
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!files.length) return;
    importMutation.mutate({ files, businessDate });
  }

  function importAnyway(fileName: string) {
    const file = files.find((f) => f.name === fileName);
    if (!file) return;
    importMutation.mutate({ files: [file], businessDate, allowDuplicateFile: true });
  }

  const results = importMutation.data;
  const uploadError = importMutation.error;

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Data Import Center</h1>
          <p className="page-desc">
            One place for every source file. Drop Kiosk or PetPooja sales PDFs and PetPooja / back-office Excel workbooks
            — several at once. Each file is read sheet by sheet, its columns are matched to the fields the dashboard
            needs, rows are validated and de-duplicated, and every number stays traceable to the file, sheet and row it
            came from. Re-uploading the same file never double-counts.
          </p>
        </div>
      </div>

      <div className="card">
        <h3>Upload source files</h3>
        <p className="h3sub">PDF, XLSX, XLS or XLSM. Multiple files per upload; each becomes its own import batch.</p>
        <form onSubmit={handleSubmit}>
          <div
            className={`dropzone${isDragging ? " dragging" : ""}${files.length ? " has-file" : ""}`}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={openPicker}
            onKeyDown={handleKeyDown}
            role="button"
            tabIndex={0}
            aria-label="Drag and drop source files here, or press Enter to browse"
          >
            <input
              ref={fileInputRef}
              id="import-files"
              type="file"
              multiple
              accept={ACCEPT}
              style={{ display: "none" }}
              onChange={(e) => {
                addFiles(e.target.files);
                e.target.value = "";
              }}
            />
            <div className="dropzone-icon">{files.length ? "▦" : "⇧"}</div>
            <div className="dropzone-title">
              {files.length ? `${files.length} file(s) ready to import` : "Drag & drop your sales, production or wastage exports here"}
            </div>
            <div className="dropzone-sub">or</div>
            <button
              type="button"
              className="btn primary small"
              onClick={(e) => {
                e.stopPropagation();
                openPicker();
              }}
            >
              Browse Files
            </button>
            <div className="dropzone-sub" style={{ marginTop: 8 }}>
              Supported formats: PDF, XLSX, XLS, XLSM
            </div>
          </div>

          {files.length > 0 && (
            <ul className="file-queue">
              {files.map((f) => (
                <li className="file-queue-item" key={`${f.name}-${f.size}`}>
                  <span className="file-queue-icon" aria-hidden="true">
                    {fileIcon(f.name)}
                  </span>
                  <span className="file-queue-body">
                    <span className="file-queue-name">{f.name}</span>
                    <span className="file-queue-meta">
                      {fileKindLabel(f.name)} · {fmtBytes(f.size)}
                    </span>
                  </span>
                  <button
                    type="button"
                    className="btn small"
                    disabled={importMutation.isPending}
                    aria-label={`Remove ${f.name} from the upload queue`}
                    onClick={() => setFiles((prev) => prev.filter((p) => !(p.name === f.name && p.size === f.size)))}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}

          <div className="form-grid" style={{ marginTop: 14 }}>
            <div className="field">
              <label htmlFor="import-business-date">Business date (fallback only)</label>
              <input
                id="import-business-date"
                type="date"
                value={businessDate}
                onChange={(e) => setBusinessDate(e.target.value)}
                disabled={importMutation.isPending}
              />
            </div>
          </div>
          <p className="import-note" style={{ marginTop: 10 }}>
            Used only for sources that print no date inside them (Kiosk PDFs). Excel and PetPooja files carry their own
            dates and are always trusted over this field — if a file's own date contradicts what's set here, the import
            is rejected rather than silently relabeled.
          </p>
          <div className="btn-row">
            <button type="submit" className="btn primary" disabled={!files.length || importMutation.isPending}>
              {importMutation.isPending
                ? "Importing…"
                : files.length === 1
                  ? "Import 1 file"
                  : `Import ${files.length} files`}
            </button>
            {files.length > 0 && !importMutation.isPending && (
              <button type="button" className="btn" onClick={() => setFiles([])}>
                Clear queue
              </button>
            )}
          </div>
        </form>
      </div>

      {importMutation.isPending && (
        <div className="card" aria-live="polite" aria-busy="true">
          <h3>Processing {files.length} file(s)…</h3>
          <p className="h3sub">Stages the importer runs through. Large workbooks can take a few moments.</p>
          <div className="progress-steps">
            {IMPORT_STEPS.map((label, i) => (
              <div
                key={label}
                className={`progress-step${i < progressStep ? " done" : i === progressStep ? " active" : ""}`}
              >
                <span className="progress-step-dot" />
                {label}
              </div>
            ))}
          </div>
        </div>
      )}

      {uploadError && (
        <div className="card" style={{ borderLeft: "3px solid var(--critical)" }} role="alert">
          <h3 style={{ color: "var(--critical)" }}>Upload could not be completed</h3>
          <p style={{ margin: 0 }}>{(uploadError as Error).message}</p>
          <p className="import-note" style={{ marginTop: 6 }}>
            Nothing was imported. Check that the server is reachable and try again.
          </p>
        </div>
      )}

      {results?.map((r, i) =>
        r.ok && r.batch ? (
          <SuccessCard key={`${r.fileName}-${i}`} batch={r.batch} />
        ) : (
          <FailureCard
            key={`${r.fileName}-${i}`}
            result={r}
            pending={importMutation.isPending}
            onImportAnyway={importAnyway}
          />
        )
      )}

      <ImportHistory />
    </div>
  );
}
