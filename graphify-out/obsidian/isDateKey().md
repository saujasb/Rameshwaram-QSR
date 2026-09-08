---
source_file: "shared-types/businessDate.ts"
type: "code"
community: "Dataset Import & Normalization Pipeline"
location: "L33"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Dataset_Import__Normalization_Pipeline
---

# isDateKey()

## Connections
- [[businessDate.ts]] - `contains` [EXTRACTED]
- [[datasetsimportPipeline.ts]] - `imports` [EXTRACTED]
- [[explicitDates()]] - `calls` [EXTRACTED]
- [[intents.ts]] - `imports` [EXTRACTED]
- [[runImport()]] - `calls` [EXTRACTED]

## Source
**From** `shared-types/businessDate.ts` **(starting line 33):**
```typescript
export function isDateKey(value: unknown): value is string {
  return typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value);
}
```

#graphify/code #graphify/EXTRACTED #community/Dataset_Import__Normalization_Pipeline