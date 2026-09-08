---
source_file: "server/src/entities/sales/repository.ts"
type: "code"
community: "Sales Import Parsing Pipeline"
location: "L281"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Sales_Import_Parsing_Pipeline
---

# listLineItems()

## Connections
- [[salesrepository.ts]] - `contains` [EXTRACTED]
- [[salesroutes.ts]] - `imports` [EXTRACTED]
- [[whereClause()]] - `calls` [EXTRACTED]

## Source
**From** `server/src/entities/sales/repository.ts` **(starting line 281):**
```typescript
export function listLineItems(filter: SalesFilter): SalesLineItem[] {
  const { clause, params } = whereClause(filter);
  const scoped = clause ? `${clause} AND datasetType = 'sales'` : `WHERE datasetType = 'sales'`;
  const rows = db
    .prepare(
      `SELECT id, importBatchId, channel, COALESCE(category,'Uncategorised') as category, product as itemName,
              quantity, salesValue as amount, transactionDate as calendarDate, businessDate,
              businessDayStartHour, rawTimestamp as transactionTimestamp, createdAt, updatedAt
       FROM dataset_records ${scoped} ORDER BY businessDate DESC, amount DESC LIMIT 5000`
    )
    .all(...params);
  return rows as unknown as SalesLineItem[];
}
```

#graphify/code #graphify/EXTRACTED #community/Sales_Import_Parsing_Pipeline