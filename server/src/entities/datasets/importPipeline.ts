import { createHash, randomUUID } from "node:crypto";
import type {
  DatasetRecord,
  DatasetType,
  ImportBatch,
  ImportStatus,
  QualityIssue,
  RejectedRow,
  SheetImportSummary,
  SourceType,
} from "../../../../shared-types/datasets.js";
import { isDateKey } from "../../../../shared-types/businessDate.js";
import { buildRecord, scoreQuality, tallyFlags, type RawRowInput } from "./normalize.js";
import { parseWorkbook, looksLikeSpreadsheet } from "./excel.js";
import { adaptPdf, looksLikePdf } from "./pdfAdapter.js";
import { getBusinessDayStartHour, insertImportBatch, upsertRecords, findBatchByFileHash } from "./repository.js";

export interface ImportRequest {
  fileName: string;
  buffer: Buffer;
  /** Required for sources that print no date (Kiosk PDFs). */
  businessDate?: string;
  /** Per-sheet dataset type corrections from the import preview. */
  datasetOverrides?: Record<string, DatasetType>;
  /** Set true to import a byte-identical file again on purpose. */
  allowDuplicateFile?: boolean;
}

export type ImportOutcome =
  | { ok: true; batch: ImportBatch }
  | { ok: false; error: string; detail?: string; duplicateOf?: ImportBatch };

const VALIDATION_EPSILON = 0.5;

export async function runImport(req: ImportRequest): Promise<ImportOutcome> {
  const { fileName, buffer } = req;

  if (req.businessDate && !isDateKey(req.businessDate)) {
    return { ok: false, error: "businessDate must be in YYYY-MM-DD format." };
  }

  const isPdf = looksLikePdf(buffer);
  const isExcel = !isPdf && looksLikeSpreadsheet(buffer);
  if (!isPdf && !isExcel) {
    return {
      ok: false,
      error: "Unsupported file.",
      detail:
        "Only PDF (.pdf) and Excel (.xlsx/.xls) files are accepted. The file's contents didn't match either format, regardless of its extension.",
    };
  }
  const sourceType: SourceType = isPdf ? "pdf" : "excel";

  const fileHash = createHash("sha256").update(buffer).digest("hex");
  if (!req.allowDuplicateFile) {
    const prior = findBatchByFileHash(fileHash);
    if (prior) {
      return {
        ok: false,
        error: "This exact file has already been imported.",
        detail: `Imported as "${prior.fileName}" on ${new Date(prior.createdAt).toLocaleString("en-IN")} covering ${prior.businessDateFrom ?? "?"}${prior.businessDateTo && prior.businessDateTo !== prior.businessDateFrom ? ` to ${prior.businessDateTo}` : ""}. Re-import only if you mean to.`,
        duplicateOf: prior,
      };
    }
  }

  const businessDayStartHour = getBusinessDayStartHour();
  const importBatchId = randomUUID();

  let rawRows: RawRowInput[] = [];
  const sheets: SheetImportSummary[] = [];
  const extraIssues: QualityIssue[] = [];
  let reconciliation: ImportBatch["reconciliation"] = null;
  let fallbackBusinessDate: string | null = req.businessDate ?? null;

  if (isPdf) {
    const adapted = await adaptPdf(buffer, req.businessDate);
    if (!adapted.ok) return { ok: false, error: adapted.error!, detail: adapted.detail };
    rawRows = adapted.rows;
    if (adapted.summary) sheets.push(adapted.summary);
    fallbackBusinessDate = adapted.reportDate;
    if (adapted.reconciliation) {
      reconciliation = {
        ...adapted.reconciliation,
        quantityDiff:
          adapted.reconciliation.expectedQuantity != null
            ? adapted.reconciliation.actualQuantity - adapted.reconciliation.expectedQuantity
            : null,
        amountDiff:
          adapted.reconciliation.expectedAmount != null
            ? adapted.reconciliation.actualAmount - adapted.reconciliation.expectedAmount
            : null,
      };
    }
    for (const e of adapted.parsingErrors) {
      extraIssues.push({ code: "pdf_parse_note", severity: "warning", message: e, count: 1 });
    }
  } else {
    let parsed;
    try {
      parsed = parseWorkbook(buffer, { datasetOverrides: req.datasetOverrides, businessDayStartHour });
    } catch (err) {
      return {
        ok: false,
        error: "The spreadsheet could not be read.",
        detail: err instanceof Error ? err.message : String(err),
      };
    }

    let formulaCells = 0;
    for (const s of parsed.sheets) {
      sheets.push(s.summary);
      rawRows.push(...s.rows);
      formulaCells += s.formulaCells;
    }

    if (formulaCells > 0) {
      extraIssues.push({
        code: "formula_text_cells",
        severity: "warning",
        message: `${formulaCells} cell(s) contain text that a spreadsheet would run as a formula. Stored as inert text and escaped on export.`,
        count: formulaCells,
      });
    }

    const importable = parsed.sheets.filter((s) => s.rows.length > 0);
    if (importable.length === 0) {
      const reasons = parsed.sheets
        .filter((s) => s.summary.skippedReason)
        .map((s) => `"${s.summary.sheetName}": ${s.summary.skippedReason}`);
      return {
        ok: false,
        error: "No importable data found in this spreadsheet.",
        detail: reasons.length ? reasons.join(" | ") : "Every sheet was empty or unrecognized.",
      };
    }
  }

  // ---- normalize + validate ----
  const records: DatasetRecord[] = [];
  const rejectedRows: RejectedRow[] = [];

  for (const row of rawRows) {
    const outcome = buildRecord(row, {
      importBatchId,
      sourceFile: fileName,
      sourceType,
      businessDayStartHour,
      fallbackBusinessDate,
    });
    if (outcome.ok) records.push(outcome.record);
    else rejectedRows.push({ sourceSheet: outcome.sourceSheet, sourceRow: outcome.sourceRow, reason: outcome.reason, raw: outcome.raw });
  }

  if (records.length === 0) {
    return {
      ok: false,
      error: "Every row in this file was rejected.",
      detail: rejectedRows.slice(0, 3).map((r) => `row ${r.sourceRow ?? "?"}: ${r.reason}`).join(" | "),
    };
  }

  const upsert = upsertRecords(records);

  const dates = records.map((r) => r.businessDate).sort();
  const businessDateFrom = dates[0] ?? null;
  const businessDateTo = dates[dates.length - 1] ?? null;

  const mappingConfidencePct = sheets.length
    ? Math.round(
        sheets.reduce((s, sh) => {
          const known = sh.columnMappings.filter((m) => m.confidence > 0);
          const avg = known.length ? known.reduce((a, m) => a + m.confidence, 0) / known.length : 1;
          return s + avg * 100;
        }, 0) / sheets.length
      )
    : 100;

  // Source-printed totals vs what we computed (PDF reports carry these).
  if (reconciliation) {
    const qtyOff = reconciliation.quantityDiff != null && Math.abs(reconciliation.quantityDiff) > VALIDATION_EPSILON;
    const amtOff = reconciliation.amountDiff != null && Math.abs(reconciliation.amountDiff) > VALIDATION_EPSILON;
    if (qtyOff || amtOff) {
      extraIssues.push({
        code: "totals_mismatch",
        severity: "error",
        message: `Extracted totals don't match the report's own printed total (qty diff ${reconciliation.quantityDiff?.toFixed(2)}, value diff ${reconciliation.amountDiff?.toFixed(2)}).`,
        count: 1,
      });
    }
  }

  const quality = scoreQuality({
    rowsDetected: rawRows.length,
    rowsInserted: upsert.inserted,
    rowsUpdated: upsert.updated,
    rowsDuplicate: upsert.duplicates,
    rowsRejected: rejectedRows.length,
    flagCounts: tallyFlags(records),
    mappingConfidencePct,
    extraIssues,
  });

  const hasError = quality.issues.some((i) => i.severity === "error");
  const hasWarning = quality.issues.some((i) => i.severity === "warning");
  const status: ImportStatus = hasError ? "failed" : hasWarning || rejectedRows.length > 0 ? "warning" : "passed";

  const datasetTypes = [...new Set(records.map((r) => r.datasetType))];

  const batch: ImportBatch = {
    id: importBatchId,
    fileName,
    fileSizeBytes: buffer.byteLength,
    sourceType,
    fileHash,
    datasetTypes,
    status,
    businessDateFrom,
    businessDateTo,
    recordsFound: rawRows.length,
    recordsInserted: upsert.inserted,
    recordsUpdated: upsert.updated,
    duplicatesSkipped: upsert.duplicates,
    recordsRejected: rejectedRows.length,
    quality,
    sheets,
    rejectedRows: rejectedRows.slice(0, 200),
    reconciliation,
    businessDayStartHour,
    createdAt: new Date().toISOString(),
  };

  insertImportBatch(batch);
  return { ok: true, batch };
}
