---
source_file: "server/src/entities/intelligence/insights.ts"
type: "code"
community: "Business Intelligence Engine"
location: "L226"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Business_Intelligence_Engine
---

# concentrationInsight()

## Connections
- [[buildInsights()]] - `calls` [EXTRACTED]
- [[compact()]] - `calls` [EXTRACTED]
- [[drill()]] - `calls` [EXTRACTED]
- [[evidenceFor()]] - `calls` [EXTRACTED]
- [[insights.ts]] - `contains` [EXTRACTED]
- [[money()]] - `calls` [EXTRACTED]
- [[pctText()]] - `calls` [EXTRACTED]

## Source
**From** `server/src/entities/intelligence/insights.ts` **(starting line 226):**
```typescript
function concentrationInsight(
  filter: DatasetFilter,
  win: Window,
  where: string,
  products: ProductPerformanceRow[],
  totalRevenue: number
): Insight | null {
  const sold = products.filter((p) => p.salesValue > 0).sort((a, b) => b.salesValue - a.salesValue);
```

#graphify/code #graphify/EXTRACTED #community/Business_Intelligence_Engine