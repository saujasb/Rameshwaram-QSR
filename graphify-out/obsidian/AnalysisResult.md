---
source_file: "server/src/entities/ramesh/analysis.ts"
type: "code"
community: "Ramesh AI Query Engine"
location: "L60"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Ramesh_AI_Query_Engine
---

# AnalysisResult

## Connections
- [[AnomalyEvidence]] - `references` [EXTRACTED]
- [[DatasetType]] - `references` [EXTRACTED]
- [[RameshCalculationStep]] - `references` [EXTRACTED]
- [[RameshInsightLine]] - `references` [EXTRACTED]
- [[analysis.ts]] - `contains` [EXTRACTED]
- [[engine.ts]] - `imports` [EXTRACTED]

## Source
**From** `server/src/entities/ramesh/analysis.ts` **(starting line 60):**
```typescript
export interface AnalysisResult {
  answer: string;
  calculation: RameshCalculationStep[];
  insights: RameshInsightLine[];
  conclusion: string;
  evidence: AnomalyEvidence[];
  datasets: DatasetType[];
  recordCount: number;
  insufficientData: boolean;
}
```

#graphify/code #graphify/EXTRACTED #community/Ramesh_AI_Query_Engine