---
source_file: "server/src/entities/datasets/repository.ts"
type: "code"
community: "Business Intelligence Engine"
location: "L508"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Business_Intelligence_Engine
---

# datasetCoverage()

## Connections
- [[anomalies.ts]] - `imports` [EXTRACTED]
- [[answer()]] - `calls` [EXTRACTED]
- [[buildInsights()]] - `calls` [EXTRACTED]
- [[computeReconciliation()]] - `calls` [EXTRACTED]
- [[datasetsrepository.ts]] - `contains` [EXTRACTED]
- [[datasetsroutes.ts]] - `imports` [EXTRACTED]
- [[detectAnomalies()]] - `calls` [EXTRACTED]
- [[engine.ts]] - `imports` [EXTRACTED]
- [[insights.ts]] - `imports` [EXTRACTED]
- [[reconciliation.ts]] - `imports` [EXTRACTED]
- [[suggestionsForCurrentData()]] - `calls` [EXTRACTED]

## Source
**From** `server/src/entities/datasets/repository.ts` **(starting line 508):**
```typescript
export function datasetCoverage(): DatasetCoverage[] {
  const rows = db
    .prepare(
      `SELECT datasetType, COUNT(*) as recordCount, MIN(businessDate) as businessDateFrom,
              MAX(businessDate) as businessDateTo,
              SUM(CASE WHEN rawTimestamp IS NOT NULL THEN 1 ELSE 0 END) as tsCount,
              COUNT(DISTINCT productKey) as distinctProducts
       FROM dataset_records GROUP BY datasetType`
    )
    .all() as any[];

  return rows.map((r) => ({
    datasetType: r.datasetType,
    recordCount: r.recordCount,
    businessDateFrom: r.businessDateFrom,
    businessDateTo: r.businessDateTo,
    hasTimestamps: r.tsCount > 0,
    distinctProducts: r.distinctProducts,
  }));
}
```

#graphify/code #graphify/EXTRACTED #community/Business_Intelligence_Engine