---
source_file: "server/src/entities/datasets/normalize.ts"
type: "code"
community: "Dataset Import & Normalization Pipeline"
location: "L13"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Dataset_Import__Normalization_Pipeline
---

# RawRowInput

## Connections
- [[DatasetType]] - `references` [EXTRACTED]
- [[ExcelSheetResult]] - `references` [EXTRACTED]
- [[PdfAdaptResult]] - `references` [EXTRACTED]
- [[datasetsimportPipeline.ts]] - `imports` [EXTRACTED]
- [[excel.ts]] - `imports` [EXTRACTED]
- [[normalize.ts]] - `contains` [EXTRACTED]
- [[pdfAdapter.ts]] - `imports` [EXTRACTED]

## Source
**From** `server/src/entities/datasets/normalize.ts` **(starting line 13):**
```typescript
export interface RawRowInput {
  datasetType: DatasetType;
  /** Full transaction timestamp when the source had one. Never synthesized. */
  rawTimestamp: string | null;
  /** Calendar date from the source (or the report's own date for aggregated rows). */
  transactionDate: string | null;
  hour: number | null;
  shift: string | null;
  product: string | null;
  category: string | null;
  outlet: string | null;
  channel: string | null;
  quantity: number | null;
  salesValue: number | null;
  reason: string | null;
  sourceSheet: string | null;
  sourcePage: number | null;
  sourceRow: number | null;
  /** True for pre-aggregated daily totals (PDF item-wise reports). */
  aggregated: boolean;
}
```

#graphify/code #graphify/EXTRACTED #community/Dataset_Import__Normalization_Pipeline