---
source_file: "server/src/entities/intelligence/insights.ts"
type: "code"
community: "Business Intelligence Engine"
location: "L435"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Business_Intelligence_Engine
---

# anomalyInsight()

## Connections
- [[anomalyAction()]] - `calls` [EXTRACTED]
- [[buildInsights()]] - `calls` [EXTRACTED]
- [[formatBusinessDateLong()]] - `calls` [EXTRACTED]
- [[formatHourBucket()]] - `calls` [EXTRACTED]
- [[insights.ts]] - `contains` [EXTRACTED]
- [[money()]] - `calls` [EXTRACTED]
- [[pctText()]] - `calls` [EXTRACTED]
- [[qtyText()]] - `calls` [EXTRACTED]

## Source
**From** `server/src/entities/intelligence/insights.ts` **(starting line 435):**
```typescript
function anomalyInsight(a: Anomaly, where: string): Insight {
  const category = a.kind === "wastage_surge" ? "wastage" : a.kind === "overproduction" || a.kind === "underproduction" ? "production" : "sales";
  const fmt = (n: number) => (a.unit === "rupees" ? money(n) : `${qtyText(n)} units`);
  return {
    id: `insight-${a.id}`,
    category,
    severity: a.severity,
    what: a.headline,
    howMuch: `${fmt(a.actual)} actual versus ${fmt(a.expected)} expected (${pctText(a.variancePct)})`,
    when: `${formatBusinessDateLong(a.businessDate)}${a.hour !== null ? `, ${formatHourBucket(a.hour)}` : ""}`,
    where: a.outlet ? `${a.outlet}${a.shift ? ` / ${a.shift} shift` : ""}` : where,
    product: a.product,
    impact: `${fmt(a.absoluteVariance)} away from the baseline (${a.expectedBasisNote})`,
    action: anomalyAction(a),
    evidence: a.evidence,
    drilldownQuery: a.drilldownQuery,
    score: a.severity === "high" ? 95 : a.severity === "medium" ? 80 : 60,
  };
}
```

#graphify/code #graphify/EXTRACTED #community/Business_Intelligence_Engine