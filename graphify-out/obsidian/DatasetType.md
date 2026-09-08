---
source_file: "shared-types/datasets.ts"
type: "code"
community: "Dataset Import & Normalization Pipeline"
location: "L6"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Dataset_Import__Normalization_Pipeline
---

# DatasetType

## Connections
- [[AnalysisResult]] - `references` [EXTRACTED]
- [[AnomalyEvidence]] - `references` [EXTRACTED]
- [[DataExplorerPage.tsx]] - `imports` [EXTRACTED]
- [[ImportRequest]] - `references` [EXTRACTED]
- [[RameshDataUsed]] - `references` [EXTRACTED]
- [[RameshSlots]] - `references` [EXTRACTED]
- [[RawRowInput]] - `references` [EXTRACTED]
- [[ReconciliationSummary]] - `references` [EXTRACTED]
- [[TopInsightsPanel.tsx]] - `imports` [EXTRACTED]
- [[analysis.ts]] - `imports` [EXTRACTED]
- [[anomalies.ts]] - `imports` [EXTRACTED]
- [[apidatasets.ts]] - `imports` [EXTRACTED]
- [[columnMap.ts]] - `imports` [EXTRACTED]
- [[datasetsimportPipeline.ts]] - `imports` [EXTRACTED]
- [[datasetsrepository.ts]] - `imports` [EXTRACTED]
- [[datasetsroutes.ts]] - `imports` [EXTRACTED]
- [[engine.ts]] - `imports` [EXTRACTED]
- [[excel.ts]] - `imports` [EXTRACTED]
- [[insights.ts]] - `imports` [EXTRACTED]
- [[intelligenceroutes.ts]] - `imports` [EXTRACTED]
- [[intents.ts]] - `imports` [EXTRACTED]
- [[labels.ts]] - `imports` [EXTRACTED]
- [[normalize.ts]] - `imports` [EXTRACTED]
- [[reconciliation.ts]] - `imports` [EXTRACTED]
- [[shared-typesdatasets.ts]] - `contains` [EXTRACTED]
- [[shared-typesintelligence.ts]] - `imports` [EXTRACTED]
- [[shared-typesramesh.ts]] - `imports` [EXTRACTED]

## Source
**From** `shared-types/datasets.ts` **(starting line 6):**
```typescript
export type DatasetType = "sales" | "production" | "wastage";
export type SourceType = "pdf" | "excel";

export const DATASET_LABELS: Record<DatasetType, string> = {
  sales: "Sales",
  production: "Production",
  wastage: "Wastage",
};
```

#graphify/code #graphify/EXTRACTED #community/Dataset_Import__Normalization_Pipeline