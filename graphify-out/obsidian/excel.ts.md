---
source_file: "server/src/entities/datasets/excel.ts"
type: "code"
community: "Dataset Import & Normalization Pipeline"
location: "L1"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Dataset_Import__Normalization_Pipeline
---

# excel.ts

## Connections
- [[DatasetType]] - `imports` [EXTRACTED]
- [[ExcelParseResult]] - `contains` [EXTRACTED]
- [[ExcelSheetResult]] - `contains` [EXTRACTED]
- [[HeaderPlan]] - `imports` [EXTRACTED]
- [[NormalizedField]] - `imports` [EXTRACTED]
- [[RawRowInput]] - `imports` [EXTRACTED]
- [[SheetImportSummary]] - `imports` [EXTRACTED]
- [[buildHeaderPlan()]] - `imports` [EXTRACTED]
- [[coerce.ts]] - `imports_from` [EXTRACTED]
- [[coerceDateKey()]] - `imports` [EXTRACTED]
- [[coerceNumber()]] - `imports` [EXTRACTED]
- [[coerceText()]] - `imports` [EXTRACTED]
- [[coerceTimestamp()]] - `imports` [EXTRACTED]
- [[columnMap.ts]] - `imports_from` [EXTRACTED]
- [[datasetsimportPipeline.ts]] - `imports_from` [EXTRACTED]
- [[detectDatasetType()]] - `imports` [EXTRACTED]
- [[emptySheet()]] - `contains` [EXTRACTED]
- [[extractRows()]] - `contains` [EXTRACTED]
- [[findHeaderRow()]] - `imports` [EXTRACTED]
- [[looksLikeFormula()]] - `imports` [EXTRACTED]
- [[looksLikeSpreadsheet()]] - `contains` [EXTRACTED]
- [[missingRequiredFields()]] - `imports` [EXTRACTED]
- [[normalize.ts]] - `imports_from` [EXTRACTED]
- [[parseWorkbook()]] - `contains` [EXTRACTED]
- [[shared-typesdatasets.ts]] - `imports_from` [EXTRACTED]

## Source
**Full file:** `server/src/entities/datasets/excel.ts`
```typescript
import * as XLSX from "xlsx";
import type { DatasetType, SheetImportSummary } from "../../../../shared-types/datasets.js";
import { buildHeaderPlan, detectDatasetType, findHeaderRow, missingRequiredFields, type HeaderPlan, type NormalizedField } from "./columnMap.js";
import { coerceNumber, coerceText, coerceTimestamp, coerceDateKey, looksLikeFormula } from "./coerce.js";
import type { RawRowInput } from "./normalize.js";

export interface ExcelSheetResult {
  summary: SheetImportSummary;
  rows: RawRowInput[];
  /** Cells whose text would be executed as a formula by a spreadsheet. */
  formulaCells: number;
}

export interface ExcelParseResult {
  sheets: ExcelSheetResult[];
}

const MAX_ROWS_PER_SHEET = 200000;

/**
 * Reads a workbook and normalizes every sheet it can recognize.
 *
 * Parsing is deliberately defensive: SheetJS is told not to evaluate formulas
 * and we only ever read cell *values*, so an uploaded spreadsheet is treated
 * strictly as data. `datasetOverrides` lets the operator correct a
 * misclassified sheet from the import preview.
 */
export function parseWorkbook(
  buffer: Buffer,
  options: { datasetOverrides?: Record<string, DatasetType>; businessDayStartHour: number }
): ExcelParseResult {
  const wb = XLSX.read(buffer, {
    type: "buffer",
    cellDates: true,
    cellFormula: false,
    cellHTML: false,
    dense: false,
  });

  const sheets: ExcelSheetResult[] = [];

  for (const sheetName of wb.SheetNames) {
    const ws = wb.Sheets[sheetName];
    if (!ws) continue;

    const grid = XLSX.utils.sheet_to_json<unknown[]>(ws, {
      header: 1,
      raw: true,
      defval: null,
      blankrows: false,
   }) as unknown[][];

    if (!grid || grid.length === 0) {
      sheets.push(emptySheet(sheetName, "Sheet is empty"));
      continue;
    }

    const headerRowIdx = findHeaderRow(grid);
    const headers = (grid[headerRowIdx] ?? []).map((h) => coerceText(h) ?? "");
    if (headers.filter(Boolean).length < 2) {
      sheets.push(emptySheet(sheetName, "No recognizable header row found"));
      continue;
    }

    const override = options.datasetOverrides?.[sheetName];
    const detected = override
      ? { datasetType: override as DatasetType, confidence: 1 }
      : detectDatasetType(sheetName, headers);

    if (!detected.datasetType) {
      sheets.push({
        summary: {
          sheetName,
          detectedDatasetType: null,
          detectionConfidence: detected.confidence,
          rowsDetected: Math.max(0, grid.length - headerRowIdx - 1),
          rowsImported: 0,
          rowsRejected: 0,
          columnMappings: [],
          businessDateFrom: null,
          businessDateTo: null,
          skippedReason:
            "Could not tell whether this sheet is sales, production or wastage. Re-upload choosing the dataset type for this sheet.",
        },
        rows: [],
        formulaCells: 0,
      });
      continue;
    }

    const datasetType = detected.datasetType;
    const plan = buildHeaderPlan(headers, datasetType);
    const missing = missingRequiredFields(plan, datasetType);
    if (missing.length > 0) {
      sheets.push({
        summary: {
          sheetName,
          detectedDatasetType: datasetType,
          detectionConfidence: detected.confidence,
          rowsDetected: Math.max(0, grid.length - headerRowIdx - 1),
          rowsImported: 0,
          rowsRejected: 0,
          columnMappings: plan.mappings,
          businessDateFrom: null,
          businessDateTo: null,
          skippedReason: `Required column(s) not found: ${missing.join(", ")}. Found headers: ${headers.filter(Boolean).join(", ")}`,
        },
        rows: [],
        formulaCells: 0,
      });
      continue;
    }

    const { rows, formulaCells, dateFrom, dateTo, detectedCount } = extractRows(
      grid,
      headerRowIdx,
      plan,
      datasetType,
      sheetName
    );

    sheets.push({
      summary: {
        sheetName,
        detectedDatasetType: datasetType,
        detectionConfidence: detected.confidence,
        rowsDetected: detectedCount,
        rowsImported: rows.length,
        rowsRejected: 0, // rejection happens in normalize(); reported at batch level
        columnMappings: plan.mappings,
        businessDateFrom: dateFrom,
        businessDateTo: dateTo,
        skippedReason: null,
      },
      rows,
      formulaCells,
    });
  }

  return { sheets };
}

function emptySheet(sheetName: string, reason: string): ExcelSheetResult {
  return {
    summary: {
      sheetName,
      detectedDatasetType: null,
      detectionConfidence: 0,
      rowsDetected: 0,
      rowsImported: 0,
      rowsRejected: 0,
      columnMappings: [],
      businessDateFrom: null,
      businessDateTo: null,
      skippedReason: reason,
    },
    rows: [],
    formulaCells: 0,
  };
}

/** Sub-total / grand-total lines that must not be imported as products. */
const TOTAL_ROW_RE = /^(sub\s*total|subtotal|total|grand\s*total|g\.?\s*total|sum)\b/i;

function extractRows(
  grid: unknown[][],
  headerRowIdx: number,
  plan: HeaderPlan,
  datasetType: DatasetType,
  sheetName: string
) {
  const rows: RawRowInput[] = [];
  let formulaCells = 0;
  let dateFrom: string | null = null;
  let dateTo: string | null = null;
  let detectedCount = 0;

  const cell = (row: unknown[], field: NormalizedField): unknown => {
    const idx = plan.indexes[field];
    return idx == null ? null : row[idx];
  };

  const limit = Math.min(grid.length, headerRowIdx + 1 + MAX_ROWS_PER_SHEET);

  for (let r = headerRowIdx + 1; r < limit; r++) {
    const row = grid[r];
    if (!row || row.every((c) => c == null || String(c).trim() === "")) continue;

    const product = coerceText(cell(row, "product"));
    // Skip the report's own total lines -- they are summaries, not products.
    if (product && TOTAL_ROW_RE.test(product)) continue;

    detectedCount++;

    for (const c of row) if (looksLikeFormula(c)) formulaCells++;

    const ts = coerceTimestamp(cell(row, "timestamp"), cell(row, "date"), cell(row, "time"));
    const dateOnly = ts ? ts.dateKey : coerceDateKey(cell(row, "date") ?? cell(row, "timestamp"));

    const quantity = coerceNumber(cell(row, "quantity"));
    const salesValue = datasetType === "sales" ? coerceNumber(cell(row, "salesValue")) : null;

    rows.push({
      datasetType,
      rawTimestamp: ts?.iso ?? null,
      transactionDate: dateOnly,
      hour: ts?.hour ?? null,
      shift: coerceText(cell(row, "shift")),
      product,
      category: coerceText(cell(row, "category")),
      outlet: coerceText(cell(row, "outlet")),
      channel: null,
      quantity,
      salesValue,
      reason: datasetType === "wastage" ? coerceText(cell(row, "reason")) : null,
      sourceSheet: sheetName,
      sourcePage: null,
      sourceRow: r + 1, // 1-based, matching what the user sees in Excel
      aggregated: false,
    });

    if (dateOnly) {
      if (!dateFrom || dateOnly < dateFrom) dateFrom = dateOnly;
      if (!dateTo || dateOnly > dateTo) dateTo = dateOnly;
    }
  }

  return { rows, formulaCells, dateFrom, dateTo, detectedCount };
}

/** Cheap magic-byte check so a renamed executable can't reach the parser. */
export function looksLikeSpreadsheet(buffer: Buffer): boolean {
  if (buffer.length < 8) return false;
  // XLSX/XLSM are ZIP archives: "PK\x03\x04"
  if (buffer[0] === 0x50 && buffer[1] === 0x4b) return true;
  // Legacy XLS (BIFF8) OLE2 compound file magic
  const ole = [0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1];
  return ole.every((b, i) => buffer[i] === b);
}
```

#graphify/code #graphify/EXTRACTED #community/Dataset_Import__Normalization_Pipeline