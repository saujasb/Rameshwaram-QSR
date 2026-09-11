---
source_file: "server/src/entities/datasets/columnMap.ts"
type: "code"
community: "Dataset Import & Normalization Pipeline"
location: "L143"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Dataset_Import__Normalization_Pipeline
---

# detectDatasetType()

## Connections
- [[canonical()]] - `indirect_call` [INFERRED]
- [[columnMap.ts]] - `contains` [EXTRACTED]
- [[excel.ts]] - `imports` [EXTRACTED]
- [[parseWorkbook()]] - `calls` [EXTRACTED]

## Source
**From** `server/src/entities/datasets/columnMap.ts` **(starting line 143):**
```typescript
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
```

#graphify/code #graphify/EXTRACTED #community/Dataset_Import__Normalization_Pipeline