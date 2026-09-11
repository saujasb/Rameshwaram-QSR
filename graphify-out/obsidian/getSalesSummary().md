---
source_file: "server/src/entities/sales/repository.ts"
type: "code"
community: "Sales Import Parsing Pipeline"
location: "L240"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Sales_Import_Parsing_Pipeline
---

# getSalesSummary()

## Connections
- [[salesrepository.ts]] - `contains` [EXTRACTED]
- [[salesroutes.ts]] - `imports` [EXTRACTED]
- [[whereClause()]] - `calls` [EXTRACTED]

## Source
**From** `server/src/entities/sales/repository.ts` **(starting line 240):**
```typescript
export function getSalesSummary(filter: SalesFilter): SalesSummary {
  const { clause, params } = whereClause(filter);
  const scoped = clause ? `${clause} AND datasetType = 'sales'` : `WHERE datasetType = 'sales'`;

  const totals = db
    .prepare(`SELECT COALESCE(SUM(quantity),0) as quantity, COALESCE(SUM(salesValue),0) as amount, MIN(businessDate) as minDate, MAX(businessDate) as maxDate FROM dataset_records ${scoped}`)
    .get(...params) as { quantity: number; amount: number; minDate: string | null; maxDate: string | null };

  const byChannel = db
    .prepare(`SELECT channel, COALESCE(SUM(quantity),0) as quantity, COALESCE(SUM(salesValue),0) as amount FROM dataset_records ${scoped} AND channel IS NOT NULL GROUP BY channel ORDER BY amount DESC`)
    .all(...params) as { channel: SalesChannel; quantity: number; amount: number }[];

  const byCategory = db
    .prepare(`SELECT COALESCE(category,'Uncategorised') as category, COALESCE(SUM(quantity),0) as quantity, COALESCE(SUM(salesValue),0) as amount FROM dataset_records ${scoped} GROUP BY COALESCE(category,'Uncategorised') ORDER BY amount DESC`)
    .all(...params) as { category: string; quantity: number; amount: number }[];

  const topItems = db
    .prepare(`SELECT product as itemName, MAX(COALESCE(category,'Uncategorised')) as category, COALESCE(SUM(quantity),0) as quantity, COALESCE(SUM(salesValue),0) as amount FROM dataset_records ${scoped} GROUP BY productKey ORDER BY amount DESC LIMIT 15`)
    .all(...params) as { itemName: string; category: string; quantity: number; amount: number }[];

  const dailyTrend = db
    .prepare(`SELECT businessDate, COALESCE(SUM(quantity),0) as quantity, COALESCE(SUM(salesValue),0) as amount FROM dataset_records ${scoped} GROUP BY businessDate ORDER BY businessDate ASC`)
    .all(...params) as { businessDate: string; quantity: number; amount: number }[];

  const hourlyCountRow = db
    .prepare(`SELECT COUNT(*) as c FROM dataset_records ${scoped} AND rawTimestamp IS NOT NULL`)
    .get(...params) as { c: number };

  return {
    businessDateFrom: totals.minDate,
    businessDateTo: totals.maxDate,
    totalQuantity: totals.quantity,
    totalAmount: totals.amount,
    byChannel,
    byCategory,
    topItems,
    dailyTrend,
    hasHourlyData: hourlyCountRow.c > 0,
  };
}
```

#graphify/code #graphify/EXTRACTED #community/Sales_Import_Parsing_Pipeline