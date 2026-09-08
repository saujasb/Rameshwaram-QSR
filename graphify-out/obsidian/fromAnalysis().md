---
source_file: "server/src/entities/ramesh/engine.ts"
type: "code"
community: "Ramesh AI Query Engine"
location: "L886"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Ramesh_AI_Query_Engine
---

# fromAnalysis()

## Connections
- [[answer()]] - `calls` [EXTRACTED]
- [[drilldown()_1]] - `calls` [EXTRACTED]
- [[engine.ts]] - `contains` [EXTRACTED]
- [[shell()]] - `calls` [EXTRACTED]
- [[spanOf()]] - `calls` [EXTRACTED]

## Source
**From** `server/src/entities/ramesh/engine.ts` **(starting line 886):**
```typescript
function fromAnalysis(c: Ctx, r: AnalysisResult, drillFilter?: DatasetFilter): RameshAnswer {
  const span = spanOf(c.base);
  return shell(c, {
    answer: r.answer,
    dataUsed: r.recordCount
      ? {
          datasets: r.datasets,
          businessDateFrom: span.from,
          businessDateTo: span.to,
          product: c.base.product ?? null,
          outlet: c.base.outlet ?? null,
          shift: c.base.shift ?? null,
          recordCount: r.recordCount,
        }
      : null,
    calculation: r.calculation,
    insights: r.insights,
    conclusion: r.conclusion,
    evidence: r.evidence,
    insufficientData: r.insufficientData,
    drilldownQuery: drilldown(drillFilter ?? c.base),
  });
}
```

#graphify/code #graphify/EXTRACTED #community/Ramesh_AI_Query_Engine