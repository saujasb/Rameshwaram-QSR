---
source_file: "server/src/entities/datasets/repository.ts"
type: "code"
community: "Ramesh AI Query Engine"
location: "L373"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Ramesh_AI_Query_Engine
---

# hourlyBuckets()

## Connections
- [[analysis.ts]] - `imports` [EXTRACTED]
- [[answerPeakHour()]] - `calls` [EXTRACTED]
- [[buildTodaysIntelligence()]] - `calls` [EXTRACTED]
- [[buildWhere()]] - `calls` [EXTRACTED]
- [[datasetsrepository.ts]] - `contains` [EXTRACTED]
- [[datasetsroutes.ts]] - `imports` [EXTRACTED]
- [[engine.ts]] - `imports` [EXTRACTED]
- [[formatHourBucket()]] - `calls` [EXTRACTED]
- [[getBusinessDayStartHour()]] - `calls` [EXTRACTED]
- [[insights.ts]] - `imports` [EXTRACTED]
- [[intelligenceroutes.ts]] - `imports` [EXTRACTED]
- [[peakHourInsight()]] - `calls` [EXTRACTED]
- [[rootCause()]] - `calls` [EXTRACTED]

## Source
**From** `server/src/entities/datasets/repository.ts` **(starting line 373):**
```typescript
export function hourlyBuckets(filter: DatasetFilter): HourlyBucket[] {
  const startHour = getBusinessDayStartHour();
  const { clause, params } = buildWhere({ ...filter, datasetType: undefined });
  const where = clause ? `${clause} AND hour IS NOT NULL` : `WHERE hour IS NOT NULL`;

  const rows = db
    .prepare(
      `SELECT hour, datasetType,
              COALESCE(SUM(quantity),0) as quantity,
              COALESCE(SUM(salesValue),0) as value,
              COUNT(*) as recordCount
       FROM dataset_records ${where}
       GROUP BY hour, datasetType`
    )
    .all(...params) as { hour: number; datasetType: DatasetType; quantity: number; value: number; recordCount: number }[];

  if (rows.length === 0) return [];

  const byHour = new Map<number, HourlyBucket>();
  for (const r of rows) {
    let b = byHour.get(r.hour);
    if (!b) {
      b = {
        hour: r.hour,
        label: formatHourBucket(r.hour),
        slot: (r.hour - startHour + 24) % 24,
        isAfterMidnight: r.hour < startHour,
        salesValue: 0,
        salesQty: 0,
        productionQty: 0,
        wastageQty: 0,
        recordCount: 0,
      };
      byHour.set(r.hour, b);
    }
    if (r.datasetType === "sales") {
      b.salesValue += r.value;
      b.salesQty += r.quantity;
    } else if (r.datasetType === "production") b.productionQty += r.quantity;
    else if (r.datasetType === "wastage") b.wastageQty += r.quantity;
    b.recordCount += r.recordCount;
  }

  return [...byHour.values()].sort((a, b) => a.slot - b.slot);
}
```

#graphify/code #graphify/EXTRACTED #community/Ramesh_AI_Query_Engine