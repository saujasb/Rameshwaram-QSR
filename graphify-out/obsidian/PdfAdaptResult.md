---
source_file: "server/src/entities/datasets/pdfAdapter.ts"
type: "code"
community: "Dataset Import & Normalization Pipeline"
location: "L9"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Dataset_Import__Normalization_Pipeline
---

# PdfAdaptResult

## Connections
- [[RawRowInput]] - `references` [EXTRACTED]
- [[SheetImportSummary]] - `references` [EXTRACTED]
- [[pdfAdapter.ts]] - `contains` [EXTRACTED]

## Source
**From** `server/src/entities/datasets/pdfAdapter.ts` **(starting line 9):**
```typescript
export interface PdfAdaptResult {
  ok: boolean;
  error?: string;
  detail?: string;
  rows: RawRowInput[];
  /** The report's own printed date, when it carries one. */
  reportDate: string | null;
  channel: string | null;
  summary: SheetImportSummary | null;
  parsingErrors: string[];
  reconciliation: {
    expectedQuantity: number | null;
    expectedAmount: number | null;
    actualQuantity: number;
    actualAmount: number;
  } | null;
}
```

#graphify/code #graphify/EXTRACTED #community/Dataset_Import__Normalization_Pipeline