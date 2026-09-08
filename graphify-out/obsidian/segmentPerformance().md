---
source_file: "server/src/entities/datasets/repository.ts"
type: "code"
community: "Ramesh AI Query Engine"
location: "L462"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Ramesh_AI_Query_Engine
---

# segmentPerformance()

## Connections
- [[buildWhere()]] - `calls` [EXTRACTED]
- [[datasetsrepository.ts]] - `contains` [EXTRACTED]
- [[outletPerformance()]] - `calls` [EXTRACTED]
- [[shiftPerformance()]] - `calls` [EXTRACTED]

## Source
**From** `server/src/entities/datasets/repository.ts` **(starting line 462):**
```typescript
function segmentPerformance(column: "shift" | "outlet", filter: DatasetFilter): SegmentPerformanceRow[] {
  const base: DatasetFilter = { ...filter, datasetType: undefined };
  const { clause, params } = buildWhere(base);
  const where = clause ? `${clause} AND ${column} IS NOT NULL` : `WHERE ${column} IS NOT NULL`;

  const rows = db
    .prepare(
      `SELECT ${column} as segment,
              COALESCE(SUM(CASE WHEN datasetType='sales' THEN quantity END),0) as salesQty,
              COALESCE(SUM(CASE WHEN datasetType='sales' THEN salesValue END),0) as salesValue,
              COALESCE(SUM(CASE WHEN datasetType='production' THEN quantity END),0) as productionQty,
              COALESCE(SUM(CASE WHEN datasetType='wastage' THEN quantity END),0) as wastageQty,
              COUNT(*) as recordCount
       FROM dataset_records ${where}
       GROUP BY ${column}
       ORDER BY salesValue DESC`
    )
    .all(...params) as Omit<SegmentPerformanceRow, "sellThroughPct" | "wastagePct" | "variancePct">[];

  return rows.map((r) => ({
    ...r,
    sellThroughPct: r.productionQty > 0 ? (r.salesQty / r.productionQty) * 100 : null,
    wastagePct: r.productionQty > 0 ? (r.wastageQty / r.productionQty) * 100 : null,
    variancePct: r.productionQty > 0 ? ((r.productionQty - r.salesQty - r.wastageQty) / r.productionQty) * 100 : null,
  }));
}
```

#graphify/code #graphify/EXTRACTED #community/Ramesh_AI_Query_Engine