// Unified ingestion model. PDF and Excel imports both normalize into
// DatasetRecord rows so every downstream analytic, insight and Ramesh answer
// reads one shape -- and every number stays traceable to its source file,
// sheet/page and row.

export type DatasetType = "sales" | "production" | "wastage";
export type SourceType = "pdf" | "excel";

export const DATASET_LABELS: Record<DatasetType, string> = {
  sales: "Sales",
  production: "Production",
  wastage: "Wastage",
};

/** Provenance for a single normalized row -- what file/sheet/page/row it came from. */
export interface SourceRef {
  sourceFile: string;
  sourceType: SourceType;
  sourceSheet: string | null;
  sourcePage: number | null;
  sourceRow: number | null;
}

export type RecordFlag =
  | "missing_timestamp"
  | "missing_product"
  | "negative_quantity"
  | "zero_quantity"
  | "negative_value"
  | "invalid_date"
  | "unparsed_quantity"
  | "suspicious_outlier"
  | "duplicate_in_file";

export const RECORD_FLAG_LABELS: Record<RecordFlag, string> = {
  missing_timestamp: "No transaction time in source (business date derived from report date)",
  missing_product: "Product/item name missing",
  negative_quantity: "Negative quantity",
  zero_quantity: "Zero quantity",
  negative_value: "Negative sales value",
  invalid_date: "Date could not be parsed",
  unparsed_quantity: "Quantity could not be parsed as a number",
  suspicious_outlier: "Value far outside the rest of the file",
  duplicate_in_file: "Same row appears more than once in this file",
};

export interface DatasetRecord {
  id: string;
  datasetType: DatasetType;

  // --- time. rawTimestamp is NEVER overwritten or synthesized. ---
  /** Original transaction timestamp when the source carries one, else null. */
  rawTimestamp: string | null;
  /** Calendar date as it appears in the source. */
  transactionDate: string | null;
  /** Computed via the business-date engine. Always present. */
  businessDate: string;
  /** The start hour used when computing businessDate, recorded for audit. */
  businessDayStartHour: number;
  /** Clock hour 0-23 from rawTimestamp, or null when the source has no time. */
  hour: number | null;
  shift: string | null;

  // --- dimensions ---
  product: string;
  category: string | null;
  outlet: string | null;
  channel: string | null;

  // --- measures ---
  quantity: number;
  salesValue: number | null;
  /** Wastage reason, when the source provides one. */
  reason: string | null;

  // --- provenance ---
  importBatchId: string;
  sourceFile: string;
  sourceType: SourceType;
  sourceSheet: string | null;
  sourcePage: number | null;
  sourceRow: number | null;
  fingerprint: string;
  flags: RecordFlag[];
  createdAt: string;
  updatedAt: string;
}

/** A row that failed validation hard enough that it was NOT imported. */
export interface RejectedRow {
  sourceSheet: string | null;
  sourceRow: number | null;
  reason: string;
  raw: string;
}

export interface QualityIssue {
  code: string;
  severity: "error" | "warning" | "info";
  message: string;
  count: number;
}

export interface ImportQuality {
  /** 0-100. Share of detected rows that imported cleanly, penalized by flags. */
  confidencePct: number;
  /** 0-100. How confident the column/dataset detection was (Excel). 100 for known PDF layouts. */
  mappingConfidencePct: number;
  rowsDetected: number;
  rowsValid: number;
  rowsFlagged: number;
  rowsRejected: number;
  rowsDuplicate: number;
  rowsMissingTimestamp: number;
  issues: QualityIssue[];
}

/** How a source column was matched to a normalized field -- shown in the import preview. */
export interface ColumnMapping {
  normalizedField: string;
  sourceColumn: string | null;
  confidence: number;
  matchedBy: "exact" | "alias" | "fuzzy" | "inferred" | "unmatched";
}

export interface SheetImportSummary {
  sheetName: string;
  detectedDatasetType: DatasetType | null;
  detectionConfidence: number;
  rowsDetected: number;
  rowsImported: number;
  rowsRejected: number;
  columnMappings: ColumnMapping[];
  businessDateFrom: string | null;
  businessDateTo: string | null;
  skippedReason: string | null;
}

export type ImportStatus = "passed" | "warning" | "failed";

/** One upload = one ImportBatch, covering every sheet/page inside the file. */
export interface ImportBatch {
  id: string;
  fileName: string;
  fileSizeBytes: number;
  sourceType: SourceType;
  /** sha256 of the file bytes -- catches re-uploading the identical file. */
  fileHash: string;
  datasetTypes: DatasetType[];
  status: ImportStatus;
  businessDateFrom: string | null;
  businessDateTo: string | null;
  recordsFound: number;
  recordsInserted: number;
  recordsUpdated: number;
  duplicatesSkipped: number;
  recordsRejected: number;
  quality: ImportQuality;
  sheets: SheetImportSummary[];
  rejectedRows: RejectedRow[];
  /** Totals the source itself printed, when present, vs what we computed. */
  reconciliation: {
    expectedQuantity: number | null;
    expectedAmount: number | null;
    actualQuantity: number;
    actualAmount: number;
    quantityDiff: number | null;
    amountDiff: number | null;
  } | null;
  businessDayStartHour: number;
  createdAt: string;
}

export interface DatasetFilter {
  from?: string;
  to?: string;
  datasetType?: DatasetType;
  product?: string;
  outlet?: string;
  shift?: string;
  search?: string;
  page?: number;
  pageSize?: number;
}

export interface PaginatedRecords {
  data: DatasetRecord[];
  pagination: { page: number; pageSize: number; totalItems: number; totalPages: number };
}

export interface DatasetCoverage {
  datasetType: DatasetType;
  recordCount: number;
  businessDateFrom: string | null;
  businessDateTo: string | null;
  hasTimestamps: boolean;
  distinctProducts: number;
}
