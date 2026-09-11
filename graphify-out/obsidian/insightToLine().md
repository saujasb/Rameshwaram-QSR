---
source_file: "server/src/entities/ramesh/analysis.ts"
type: "code"
community: "Ramesh AI Query Engine"
location: "L27"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Ramesh_AI_Query_Engine
---

# insightToLine()

## Connections
- [[analysis.ts]] - `contains` [EXTRACTED]
- [[executiveAnalysis()]] - `calls` [EXTRACTED]

## Source
**From** `server/src/entities/ramesh/analysis.ts` **(starting line 27):**
```typescript
export function insightToLine(i: Insight, rank: number): RameshInsightLine {
  return {
    rank,
    severity: i.severity,
    category: i.category,
    headline: i.what,
    magnitude: i.howMuch,
    scope: [i.when, i.where, i.product].filter(Boolean).join(" · "),
    impact: i.impact,
    action: i.action,
    evidence: i.evidence,
    drilldownQuery: i.drilldownQuery ?? null,
  };
}
```

#graphify/code #graphify/EXTRACTED #community/Ramesh_AI_Query_Engine