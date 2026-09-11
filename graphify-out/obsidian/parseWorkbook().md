---
source_file: "server/src/entities/datasets/excel.ts"
type: "code"
community: "Dataset Import & Normalization Pipeline"
location: "L28"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Dataset_Import__Normalization_Pipeline
---

# parseWorkbook()

## Connections
- [[buildHeaderPlan()]] - `calls` [EXTRACTED]
- [[coerceText()]] - `calls` [EXTRACTED]
- [[datasetsimportPipeline.ts]] - `imports` [EXTRACTED]
- [[detectDatasetType()]] - `calls` [EXTRACTED]
- [[emptySheet()]] - `calls` [EXTRACTED]
- [[excel.ts]] - `contains` [EXTRACTED]
- [[extractRows()]] - `calls` [EXTRACTED]
- [[findHeaderRow()]] - `calls` [EXTRACTED]
- [[missingRequiredFields()]] - `calls` [EXTRACTED]
- [[runImport()]] - `calls` [EXTRACTED]

## Source
**From** `server/src/entities/datasets/excel.ts` **(starting line 28):**
```typescript
export function parseWorkbook(
  buffer: Buffer,
  options: { datasetOverrides?: Record<string, DatasetType>; businessDayStartHour: number }
```

#graphify/code #graphify/EXTRACTED #community/Dataset_Import__Normalization_Pipeline