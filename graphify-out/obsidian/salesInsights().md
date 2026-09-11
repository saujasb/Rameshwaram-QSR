---
source_file: "server/src/entities/intelligence/insights.ts"
type: "code"
community: "Business Intelligence Engine"
location: "L108"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Business_Intelligence_Engine
---

# salesInsights()

## Connections
- [[buildInsights()]] - `calls` [EXTRACTED]
- [[compact()]] - `calls` [EXTRACTED]
- [[drill()]] - `calls` [EXTRACTED]
- [[evidenceFor()]] - `calls` [EXTRACTED]
- [[insights.ts]] - `contains` [EXTRACTED]
- [[money()]] - `calls` [EXTRACTED]
- [[pctText()]] - `calls` [EXTRACTED]
- [[qtyText()]] - `calls` [EXTRACTED]
- [[share()]] - `calls` [EXTRACTED]

## Source
**From** `server/src/entities/intelligence/insights.ts` **(starting line 108):**
```typescript
function salesInsights(
  filter: DatasetFilter,
  win: Window,
  where: string,
  products: ProductPerformanceRow[],
  totalRevenue: number,
  totalQty: number,
  missingProduction: boolean
): Insight[] {
  const sold = products.filter((p) => p.salesQty > 0);
```

#graphify/code #graphify/EXTRACTED #community/Business_Intelligence_Engine