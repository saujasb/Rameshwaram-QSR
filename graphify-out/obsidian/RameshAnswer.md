---
source_file: "shared-types/ramesh.ts"
type: "code"
community: "Ramesh AI Query Engine"
location: "L99"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Ramesh_AI_Query_Engine
---

# RameshAnswer

## Connections
- [[AnomalyEvidence]] - `references` [EXTRACTED]
- [[RameshWidget.tsx]] - `imports` [EXTRACTED]
- [[apiramesh.ts]] - `imports` [EXTRACTED]
- [[engine.ts]] - `imports` [EXTRACTED]
- [[shared-typesramesh.ts]] - `contains` [EXTRACTED]

## Source
**From** `shared-types/ramesh.ts` **(starting line 99):**
```typescript
export interface RameshAnswer {
  intent: RameshIntent;
  /** Direct answer. Never contains a number that isn't in `calculation`/`dataUsed`. */
  answer: string;
  dataUsed: RameshDataUsed | null;
  calculation: RameshCalculationStep[];
  conclusion: string;
  /** Ranked findings for analytical/executive questions. Empty for simple lookups. */
  insights: RameshInsightLine[];
  evidence: AnomalyEvidence[];
  /** Query params for the "View records" drill-down into the Data Explorer. */
  drilldownQuery: Record<string, string> | null;
  /** True when Ramesh declined for lack of data rather than answering. */
  insufficientData: boolean;
  /** Set when the question was rejected as off-topic or as an injection attempt. */
  refusalReason: "off_topic" | "injection_attempt" | null;
  /** Follow-up questions Ramesh can actually answer from the current data. */
  suggestions: string[];
}
```

#graphify/code #graphify/EXTRACTED #community/Ramesh_AI_Query_Engine