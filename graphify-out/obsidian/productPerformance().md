---
source_file: "server/src/entities/datasets/repository.ts"
type: "code"
community: "Business Intelligence Engine"
location: "L420"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Business_Intelligence_Engine
---

# productPerformance()

## Connections
- [[analysis.ts]] - `imports` [EXTRACTED]
- [[anomalies.ts]] - `imports` [EXTRACTED]
- [[buildInsights()]] - `calls` [EXTRACTED]
- [[buildWhere()]] - `calls` [EXTRACTED]
- [[datasetsrepository.ts]] - `contains` [EXTRACTED]
- [[datasetsroutes.ts]] - `imports` [EXTRACTED]
- [[insights.ts]] - `imports` [EXTRACTED]
- [[productAnalysis()]] - `calls` [EXTRACTED]
- [[productStalls()]] - `calls` [EXTRACTED]
- [[productionVariance()]] - `calls` [EXTRACTED]
- [[rootCause()]] - `calls` [EXTRACTED]
- [[wastageSurges()]] - `calls` [EXTRACTED]

## Source
**From** `server/src/entities/datasets/repository.ts` **(starting line 420):**
```typescript
export function productPerformance(filter: DatasetFilter, limit = 200): ProductPerformanceRow[] {
  const base: DatasetFilter = { ...filter, datasetType: undefined };
  const { clause, params } = buildWhere(base);
  const rows = db
    .prepare(
      `SELECT product, MAX(category) as category,
              COALESCE(SUM(CASE WHEN datasetType='sales' THEN quantity END),0) as salesQty,
              COALESCE(SUM(CASE WHEN datasetType='sales' THEN salesValue END),0) as salesValue,
              COALESCE(SUM(CASE WHEN datasetType='production' THEN quantity END),0) as productionQty,
              COALESCE(SUM(CASE WHEN datasetType='wastage' THEN quantity END),0) as wastageQty
       FROM dataset_records ${clause}
       GROUP BY productKey
       ORDER BY salesValue DESC, salesQty DESC
       LIMIT ?`
    )
    .all(...params, limit) as Omit<ProductPerformanceRow, "sellThroughPct" | "wastagePct" | "variancePct">[];

  return rows.map((r) => ({
    ...r,
    sellThroughPct: r.productionQty > 0 ? (r.salesQty / r.productionQty) * 100 : null,
    wastagePct: r.productionQty > 0 ? (r.wastageQty / r.productionQty) * 100 : null,
    variancePct: r.productionQty > 0 ? ((r.productionQty - r.salesQty - r.wastageQty) / r.productionQty) * 100 : null,
  }));
}
```

#graphify/code #graphify/EXTRACTED #community/Business_Intelligence_Engine