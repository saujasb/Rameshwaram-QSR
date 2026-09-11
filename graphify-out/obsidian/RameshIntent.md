---
source_file: "shared-types/ramesh.ts"
type: "code"
community: "Ramesh AI Query Engine"
location: "L21"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Ramesh_AI_Query_Engine
---

# RameshIntent

## Connections
- [[Ctx]] - `references` [EXTRACTED]
- [[RameshClassification]] - `references` [EXTRACTED]
- [[engine.ts]] - `imports` [EXTRACTED]
- [[intents.ts]] - `imports` [EXTRACTED]
- [[shared-typesramesh.ts]] - `contains` [EXTRACTED]

## Source
**From** `shared-types/ramesh.ts` **(starting line 21):**
```typescript
export type RameshIntent =
  | "total_sales"
  | "total_production"
  | "total_wastage"
  | "top_product"
  | "bottom_product"
  | "peak_hour"
  | "compare_dates"
  | "compare_datasets"
  | "wastage_reason"
  | "variance_explain"
  | "anomaly_explain"
  | "trend"
  | "executive_analysis"
  | "root_cause"
```

#graphify/code #graphify/EXTRACTED #community/Ramesh_AI_Query_Engine