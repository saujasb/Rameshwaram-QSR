---
source_file: "server/src/entities/datasets/excel.ts"
type: "code"
community: "Dataset Import & Normalization Pipeline"
location: "L165"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Dataset_Import__Normalization_Pipeline
---

# extractRows()

## Connections
- [[coerceDateKey()]] - `calls` [EXTRACTED]
- [[coerceNumber()]] - `calls` [EXTRACTED]
- [[coerceText()]] - `calls` [EXTRACTED]
- [[coerceTimestamp()]] - `calls` [EXTRACTED]
- [[excel.ts]] - `contains` [EXTRACTED]
- [[looksLikeFormula()]] - `calls` [EXTRACTED]
- [[parseWorkbook()]] - `calls` [EXTRACTED]

## Source
**From** `server/src/entities/datasets/excel.ts` **(starting line 165):**
```typescript
function extractRows(
  grid: unknown[][],
  headerRowIdx: number,
  plan: HeaderPlan,
  datasetType: DatasetType,
  sheetName: string
) {
  const rows: RawRowInput[] = [];
```

#graphify/code #graphify/EXTRACTED #community/Dataset_Import__Normalization_Pipeline