---
source_file: "shared-types/ramesh.ts"
type: "code"
community: "Ramesh AI Query Engine"
location: "L81"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Ramesh_AI_Query_Engine
---

# RameshInsightLine

## Connections
- [[AnalysisResult]] - `references` [EXTRACTED]
- [[AnomalyEvidence]] - `references` [EXTRACTED]
- [[analysis.ts]] - `imports` [EXTRACTED]
- [[shared-typesramesh.ts]] - `contains` [EXTRACTED]

## Source
**From** `shared-types/ramesh.ts` **(starting line 81):**
```typescript
export interface RameshInsightLine {
  rank: number;
  severity: "high" | "medium" | "low" | "info";
  category: string;
  /** WHAT happened, with the number in it. */
  headline: string;
  /** HOW MUCH -- quantified magnitude. */
  magnitude: string;
  /** WHEN / WHERE / WHICH PRODUCT. */
  scope: string;
  /** Measurable business impact. */
  impact: string;
  /** Only what the data supports; may state what to verify instead. */
  action: string;
  evidence: AnomalyEvidence[];
  drilldownQuery: Record<string, string> | null;
}
```

#graphify/code #graphify/EXTRACTED #community/Ramesh_AI_Query_Engine