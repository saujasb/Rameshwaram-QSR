---
source_file: "server/src/entities/intelligence/reconciliation.ts"
type: "code"
community: "Business Intelligence Engine"
location: "L213"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Business_Intelligence_Engine
---

# salesValueMetric()

## Connections
- [[observed()]] - `calls` [EXTRACTED]
- [[reconciliation.ts]] - `contains` [EXTRACTED]
- [[totalsFor()]] - `calls` [EXTRACTED]
- [[unavailable()]] - `calls` [EXTRACTED]

## Source
**From** `server/src/entities/intelligence/reconciliation.ts` **(starting line 213):**
```typescript
export function salesValueMetric(filter: DatasetFilter, scopeLabel: string): Metric {
  const t = totalsFor({ ...filter, datasetType: "sales" });
  if (t.recordCount === 0) return unavailable(`No sales records imported for ${scopeLabel}.`);
  if (t.value === 0 && t.quantity !== 0) {
    return unavailable(`The ${t.recordCount} sales record(s) for ${scopeLabel} carry no monetary amount, so revenue cannot be stated.`);
  }
  return observed(t.value, `Sum of salesValue across ${t.recordCount} imported sales record(s) for ${scopeLabel}.`);
}
```

#graphify/code #graphify/EXTRACTED #community/Business_Intelligence_Engine