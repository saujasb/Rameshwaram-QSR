---
source_file: "server/src/entities/ramesh/analysis.ts"
type: "code"
community: "Ramesh AI Query Engine"
location: "L42"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Ramesh_AI_Query_Engine
---

# anomalyToLine()

## Connections
- [[analysis.ts]] - `contains` [EXTRACTED]
- [[anomalyAnalysis()]] - `calls` [EXTRACTED]
- [[executiveAnalysis()]] - `calls` [EXTRACTED]
- [[formatBusinessDateLong()]] - `calls` [EXTRACTED]
- [[formatHourBucket()]] - `calls` [EXTRACTED]
- [[pct()]] - `calls` [EXTRACTED]

## Source
**From** `server/src/entities/ramesh/analysis.ts` **(starting line 42):**
```typescript
export function anomalyToLine(a: Anomaly, rank: number): RameshInsightLine {
  const unit = a.unit === "rupees" ? money : a.unit === "pct" ? (n: number) => pct(n) : units;
  return {
    rank,
    severity: a.severity,
    category: a.kind,
    headline: a.headline,
    magnitude: `expected ${unit(a.expected)}, actual ${unit(a.actual)} (${a.variancePct >= 0 ? "+" : ""}${a.variancePct.toFixed(1)}%)`,
    scope: [formatBusinessDateLong(a.businessDate), a.hour != null ? formatHourBucket(a.hour) : null, a.product, a.shift, a.outlet]
      .filter(Boolean)
      .join(" · "),
    impact: `${a.absoluteVariance >= 0 ? "+" : ""}${unit(a.absoluteVariance)} against the baseline (${a.expectedBasisNote})`,
    action: "Check the proving records before acting; this is a measured deviation, not a forecast.",
    evidence: a.evidence,
    drilldownQuery: a.drilldownQuery ?? null,
  };
}
```

#graphify/code #graphify/EXTRACTED #community/Ramesh_AI_Query_Engine