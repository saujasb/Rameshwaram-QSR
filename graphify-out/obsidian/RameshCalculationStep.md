---
source_file: "shared-types/ramesh.ts"
type: "code"
community: "Ramesh AI Query Engine"
location: "L70"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Ramesh_AI_Query_Engine
---

# RameshCalculationStep

## Connections
- [[AnalysisResult]] - `references` [EXTRACTED]
- [[analysis.ts]] - `imports` [EXTRACTED]
- [[engine.ts]] - `imports` [EXTRACTED]
- [[shared-typesramesh.ts]] - `contains` [EXTRACTED]

## Source
**From** `shared-types/ramesh.ts` **(starting line 70):**
```typescript
export interface RameshCalculationStep {
  label: string;
  expression: string;
  result: string;
}
```

#graphify/code #graphify/EXTRACTED #community/Ramesh_AI_Query_Engine