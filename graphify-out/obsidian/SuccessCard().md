---
source_file: "client/src/modules/import/ImportCenterPage.tsx"
type: "code"
community: "Data Explorer & Import UI"
location: "L247"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Data_Explorer__Import_UI
---

# SuccessCard()

## Connections
- [[ImportCenterPage.tsx]] - `contains` [EXTRACTED]
- [[dateRange()]] - `calls` [EXTRACTED]
- [[fmtBytes()]] - `calls` [EXTRACTED]
- [[pctTone()]] - `calls` [EXTRACTED]
- [[statusTone()]] - `calls` [EXTRACTED]
- [[toneColor()]] - `calls` [EXTRACTED]

## Source
**From** `client/src/modules/import/ImportCenterPage.tsx` **(starting line 247):**
```tsx
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
```

#graphify/code #graphify/EXTRACTED #community/Data_Explorer__Import_UI