---
source_file: "server/src/entities/datasets/columnMap.ts"
type: "code"
community: "Dataset Import & Normalization Pipeline"
location: "L1"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Dataset_Import__Normalization_Pipeline
---

# columnMap.ts

## Connections
- [[ALIASES]] - `contains` [EXTRACTED]
- [[ColumnMapping]] - `imports` [EXTRACTED]
- [[DATASET_SIGNALS]] - `contains` [EXTRACTED]
- [[DatasetType]] - `imports` [EXTRACTED]
- [[FieldMatch]] - `contains` [EXTRACTED]
- [[HeaderPlan]] - `contains` [EXTRACTED]
- [[NormalizedField]] - `contains` [EXTRACTED]
- [[RELEVANT_BY_DATASET]] - `contains` [EXTRACTED]
- [[REQUIRED_BY_DATASET]] - `contains` [EXTRACTED]
- [[SHEET_NAME_SIGNALS]] - `contains` [EXTRACTED]
- [[buildHeaderPlan()]] - `contains` [EXTRACTED]
- [[canonical()]] - `contains` [EXTRACTED]
- [[detectDatasetType()]] - `contains` [EXTRACTED]
- [[excel.ts]] - `imports_from` [EXTRACTED]
- [[findHeaderRow()]] - `contains` [EXTRACTED]
- [[matchField()]] - `contains` [EXTRACTED]
- [[missingRequiredFields()]] - `contains` [EXTRACTED]
- [[shared-typesdatasets.ts]] - `imports_from` [EXTRACTED]

## Source
**Full file:** `server/src/entities/datasets/columnMap.ts`
```typescript
import type { ColumnMapping, DatasetType } from "../../../../shared-types/datasets.js";

// Excel exports don't agree on column names, so we map by alias rather than
// hard-coding one vendor's header row. Matching is case/space/punctuation
// insensitive, tried exact -> alias -> fuzzy(substring), and every decision is
// reported back to the UI with a confidence so the user can override it.

export type NormalizedField =
  | "timestamp"
  | "date"
  | "time"
  | "product"
  | "category"
  | "quantity"
  | "salesValue"
  | "outlet"
  | "shift"
  | "reason";

const ALIASES: Record<NormalizedField, string[]> = {
  timestamp: ["timestamp", "date time", "datetime", "transaction time", "txn time", "order time", "bill time", "invoice time", "created at"],
  date: ["date", "transaction date", "txn date", "business date", "order date", "bill date", "invoice date", "sale date", "day"],
  time: ["time", "hour", "transaction hour", "order hour", "slot"],
  product: ["product", "item", "item name", "product name", "sku", "menu item", "dish", "particulars", "description"],
  category: ["category", "item category", "product category", "group", "menu group", "department", "section"],
  quantity: ["quantity", "qty", "qty.", "units", "count", "nos", "no of units", "sold qty", "produced qty", "wastage qty", "waste qty", "pcs"],
  salesValue: ["amount", "sales", "sales value", "total", "total (rs)", "total amount", "net amount", "value", "revenue", "gross amount", "net sales", "grand total"],
  outlet: ["outlet", "store", "branch", "location", "restaurant", "restaurant name", "site", "unit"],
  shift: ["shift", "session", "day part", "daypart", "shift name"],
  reason: ["reason", "wastage reason", "waste reason", "cause", "remark", "remarks", "note", "notes"],
};

/** Header tokens that indicate the sheet is a given dataset type. */
const DATASET_SIGNALS: Record<DatasetType, string[]> = {
  sales: ["sales", "revenue", "amount", "bill", "invoice", "sold", "order"],
  production: ["production", "produced", "prepared", "prep", "batch", "output", "made"],
  wastage: ["wastage", "waste", "wasted", "spoilage", "discard", "dump", "reason"],
};

const SHEET_NAME_SIGNALS: Record<DatasetType, RegExp> = {
  sales: /\b(sales|revenue|bill|invoice|sold)\b/i,
  production: /\b(production|produced|prep|prepared|output)\b/i,
  wastage: /\b(wastage|waste|spoilage|discard|dump)\b/i,
};

export function canonical(header: string): string {
  return String(header ?? "")
    .toLowerCase()
    .replace(/[₹$]/g, "")
    .replace(/[_\-./\\]+/g, " ")
    .replace(/\((.*?)\)/g, " $1 ")
    .replace(/[^a-z0-9 ]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

interface FieldMatch {
  index: number | null;
  sourceColumn: string | null;
  confidence: number;
  matchedBy: ColumnMapping["matchedBy"];
}

function matchField(field: NormalizedField, headers: string[]): FieldMatch {
  const canonHeaders = headers.map(canonical);
  const aliases = ALIASES[field];

  for (let i = 0; i < canonHeaders.length; i++) {
    if (canonHeaders[i] && canonHeaders[i] === canonical(field)) {
      return { index: i, sourceColumn: headers[i], confidence: 1, matchedBy: "exact" };
    }
  }
  for (const alias of aliases) {
    const idx = canonHeaders.indexOf(alias);
    if (idx !== -1) return { index: idx, sourceColumn: headers[idx], confidence: 0.95, matchedBy: "alias" };
  }
  // Fuzzy: an alias appears as a whole word inside the header (e.g. "Total Qty. Sold").
  for (const alias of aliases) {
    for (let i = 0; i < canonHeaders.length; i++) {
      const h = canonHeaders[i];
      if (!h) continue;
      if (h === alias) continue;
      const asWord = new RegExp(`\\b${alias.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`);
      if (asWord.test(h)) {
        return { index: i, sourceColumn: headers[i], confidence: 0.75, matchedBy: "fuzzy" };
      }
    }
  }
  return { index: null, sourceColumn: null, confidence: 0, matchedBy: "unmatched" };
}

export interface HeaderPlan {
  indexes: Partial<Record<NormalizedField, number>>;
  mappings: ColumnMapping[];
  /** 0-100 average confidence across the fields that matter for this dataset. */
  mappingConfidencePct: number;
}

/** Fields that must resolve for a sheet to be importable at all. */
const REQUIRED_BY_DATASET: Record<DatasetType, NormalizedField[]> = {
  sales: ["product", "quantity"],
  production: ["product", "quantity"],
  wastage: ["product", "quantity"],
};

const RELEVANT_BY_DATASET: Record<DatasetType, NormalizedField[]> = {
  sales: ["timestamp", "date", "time", "product", "category", "quantity", "salesValue", "outlet", "shift"],
  production: ["timestamp", "date", "time", "product", "category", "quantity", "outlet", "shift"],
  wastage: ["timestamp", "date", "time", "product", "category", "quantity", "reason", "outlet", "shift"],
};

export function buildHeaderPlan(headers: string[], datasetType: DatasetType): HeaderPlan {
  const indexes: Partial<Record<NormalizedField, number>> = {};
  const mappings: ColumnMapping[] = [];
  const relevant = RELEVANT_BY_DATASET[datasetType];

  for (const field of relevant) {
    const m = matchField(field, headers);
    if (m.index != null) indexes[field] = m.index;
    mappings.push({
      normalizedField: field,
      sourceColumn: m.sourceColumn,
      confidence: m.confidence,
      matchedBy: m.matchedBy,
    });
  }

  const scored = mappings.filter((m) => REQUIRED_BY_DATASET[datasetType].includes(m.normalizedField as NormalizedField) || m.confidence > 0);
  const avg = scored.length ? scored.reduce((s, m) => s + m.confidence, 0) / scored.length : 0;

  return { indexes, mappings, mappingConfidencePct: Math.round(avg * 100) };
}

export function missingRequiredFields(plan: HeaderPlan, datasetType: DatasetType): NormalizedField[] {
  return REQUIRED_BY_DATASET[datasetType].filter((f) => plan.indexes[f] == null);
}

/**
 * Infers what a sheet holds, from its name and its headers. Returns null when
 * nothing scores above the floor -- the caller then asks the user rather than
 * guessing.
 */
export function detectDatasetType(
  sheetName: string,
  headers: string[]
): { datasetType: DatasetType | null; confidence: number } {
  const scores: Record<DatasetType, number> = { sales: 0, production: 0, wastage: 0 };

  for (const type of Object.keys(SHEET_NAME_SIGNALS) as DatasetType[]) {
    if (SHEET_NAME_SIGNALS[type].test(sheetName)) scores[type] += 0.6;
  }

  const canonHeaders = headers.map(canonical);
  for (const type of Object.keys(DATASET_SIGNALS) as DatasetType[]) {
    for (const signal of DATASET_SIGNALS[type]) {
      if (canonHeaders.some((h) => h.includes(signal))) scores[type] += 0.14;
    }
  }

  // A "reason" column is a strong wastage tell; a money column leans sales.
  if (canonHeaders.some((h) => ALIASES.reason.includes(h))) scores.wastage += 0.3;
  if (canonHeaders.some((h) => ALIASES.salesValue.includes(h))) scores.sales += 0.2;

  const best = (Object.keys(scores) as DatasetType[]).reduce((a, b) => (scores[a] >= scores[b] ? a : b));
  const confidence = Math.min(1, scores[best]);
  if (confidence < 0.45) return { datasetType: null, confidence };
  return { datasetType: best, confidence };
}

/**
 * Finds the header row: Excel exports often carry title/metadata rows above the
 * real table. We scan the first rows and pick the one that resolves the most
 * known aliases.
 */
export function findHeaderRow(rows: unknown[][], maxScan = 12): number {
  let bestRow = 0;
  let bestScore = -1;
  const allAliases = new Set(Object.values(ALIASES).flat());

  for (let r = 0; r < Math.min(rows.length, maxScan); r++) {
    const cells = (rows[r] ?? []).map((c) => canonical(String(c ?? "")));
    const nonEmpty = cells.filter(Boolean).length;
    if (nonEmpty < 2) continue;
    let score = 0;
    for (const cell of cells) {
      if (!cell) continue;
      if (allAliases.has(cell)) score += 2;
      else if ([...allAliases].some((a) => new RegExp(`\\b${a.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`).test(cell))) score += 1;
    }
    if (score > bestScore) {
      bestScore = score;
      bestRow = r;
    }
  }
  return bestScore <= 0 ? 0 : bestRow;
}
```

#graphify/code #graphify/EXTRACTED #community/Dataset_Import__Normalization_Pipeline