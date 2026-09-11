---
source_file: "shared-types/intelligence.ts"
type: "code"
community: "Ramesh AI Query Engine"
location: "L94"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Ramesh_AI_Query_Engine
---

# AnomalyEvidence

## Connections
- [[AnalysisResult]] - `references` [EXTRACTED]
- [[DatasetType]] - `references` [EXTRACTED]
- [[RameshAnswer]] - `references` [EXTRACTED]
- [[RameshInsightLine]] - `references` [EXTRACTED]
- [[analysis.ts]] - `imports` [EXTRACTED]
- [[anomalies.ts]] - `imports` [EXTRACTED]
- [[engine.ts]] - `imports` [EXTRACTED]
- [[insights.ts]] - `imports` [EXTRACTED]
- [[shared-typesintelligence.ts]] - `contains` [EXTRACTED]
- [[shared-typesramesh.ts]] - `imports` [EXTRACTED]

## Source
**From** `shared-types/intelligence.ts` **(starting line 94):**
```typescript
export interface AnomalyEvidence {
  datasetType: DatasetType;
  description: string;
  recordCount: number;
  quantity: number;
  amount: number | null;
}
```

#graphify/code #graphify/EXTRACTED #community/Ramesh_AI_Query_Engine