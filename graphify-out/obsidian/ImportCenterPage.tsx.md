---
source_file: "client/src/modules/import/ImportCenterPage.tsx"
type: "code"
community: "Data Explorer & Import UI"
location: "L1"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Data_Explorer__Import_UI
---

# ImportCenterPage.tsx

## Connections
- [[DATASET_LABELS]] - `imports` [EXTRACTED]
- [[FailureCard()]] - `contains` [EXTRACTED]
- [[Gauge()]] - `contains` [EXTRACTED]
- [[IMPORT_STEPS_1]] - `contains` [EXTRACTED]
- [[ImportBatch]] - `imports` [EXTRACTED]
- [[ImportCenterPage()]] - `contains` [EXTRACTED]
- [[ImportFileResult]] - `imports` [EXTRACTED]
- [[ImportHistory()]] - `contains` [EXTRACTED]
- [[ImportQuality]] - `imports` [EXTRACTED]
- [[ImportStatus]] - `imports` [EXTRACTED]
- [[Metric()]] - `contains` [EXTRACTED]
- [[QualityBlock()]] - `contains` [EXTRACTED]
- [[RejectedRowsBlock()]] - `contains` [EXTRACTED]
- [[SheetImportSummary]] - `imports` [EXTRACTED]
- [[SheetMappings()]] - `contains` [EXTRACTED]
- [[SheetsBlock()]] - `contains` [EXTRACTED]
- [[SuccessCard()]] - `contains` [EXTRACTED]
- [[Tone_2]] - `contains` [EXTRACTED]
- [[apidatasets.ts]] - `imports_from` [EXTRACTED]
- [[businessDate.ts]] - `imports_from` [EXTRACTED]
- [[dateRange()]] - `contains` [EXTRACTED]
- [[fileIcon()]] - `contains` [EXTRACTED]
- [[fileKindLabel()]] - `contains` [EXTRACTED]
- [[fmtBytes()]] - `contains` [EXTRACTED]
- [[formatBusinessDateLong()]] - `imports` [EXTRACTED]
- [[getCurrentBusinessDate()]] - `imports` [EXTRACTED]
- [[pctTone()]] - `contains` [EXTRACTED]
- [[routes.tsx]] - `imports_from` [EXTRACTED]
- [[shared-typesdatasets.ts]] - `imports_from` [EXTRACTED]
- [[statusTone()]] - `contains` [EXTRACTED]
- [[toneColor()]] - `contains` [EXTRACTED]
- [[useDeleteImportBatch()_1]] - `imports` [EXTRACTED]
- [[useImportBatches()_1]] - `imports` [EXTRACTED]
- [[useImportFiles()]] - `imports` [EXTRACTED]
- [[useStagedProgress()_1]] - `contains` [EXTRACTED]

## Source
**Full file:** `client/src/modules/import/ImportCenterPage.tsx`
```tsx
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
```
*(truncated, showing first 400 of 651 lines)*

#graphify/code #graphify/EXTRACTED #community/Data_Explorer__Import_UI