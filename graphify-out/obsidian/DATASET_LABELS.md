---
source_file: "shared-types/datasets.ts"
type: "code"
community: "Business Intelligence Engine"
location: "L9"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Business_Intelligence_Engine
---

# DATASET_LABELS

## Connections
- [[DataExplorerPage.tsx]] - `imports` [EXTRACTED]
- [[ImportCenterPage.tsx]] - `imports` [EXTRACTED]
- [[SettingsPage.tsx]] - `imports` [EXTRACTED]
- [[TopInsightsPanel.tsx]] - `imports` [EXTRACTED]
- [[analysis.ts]] - `imports` [EXTRACTED]
- [[anomalies.ts]] - `imports` [EXTRACTED]
- [[engine.ts]] - `imports` [EXTRACTED]
- [[labels.ts]] - `imports` [EXTRACTED]
- [[reconciliation.ts]] - `imports` [EXTRACTED]
- [[shared-typesdatasets.ts]] - `contains` [EXTRACTED]

## Source
**From** `shared-types/datasets.ts` **(starting line 9):**
```typescript
export const DATASET_LABELS: Record<DatasetType, string> = {
  sales: "Sales",
  production: "Production",
  wastage: "Wastage",
};
```

#graphify/code #graphify/EXTRACTED #community/Business_Intelligence_Engine