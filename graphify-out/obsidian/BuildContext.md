---
source_file: "server/src/entities/datasets/normalize.ts"
type: "code"
community: "Dataset Import & Normalization Pipeline"
location: "L35"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Dataset_Import__Normalization_Pipeline
---

# BuildContext

## Connections
- [[SourceType]] - `references` [EXTRACTED]
- [[normalize.ts]] - `contains` [EXTRACTED]

## Source
**From** `server/src/entities/datasets/normalize.ts` **(starting line 35):**
```typescript
export interface BuildContext {
  importBatchId: string;
  sourceFile: string;
  sourceType: SourceType;
  businessDayStartHour: number;
  /** Fallback business date for aggregated rows with no per-row date. */
  fallbackBusinessDate: string | null;
}
```

#graphify/code #graphify/EXTRACTED #community/Dataset_Import__Normalization_Pipeline