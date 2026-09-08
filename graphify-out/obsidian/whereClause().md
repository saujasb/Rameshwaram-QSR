---
source_file: "server/src/entities/sales/repository.ts"
type: "code"
community: "Sales Import Parsing Pipeline"
location: "L218"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Sales_Import_Parsing_Pipeline
---

# whereClause()

## Connections
- [[getSalesSummary()]] - `calls` [EXTRACTED]
- [[listLineItems()]] - `calls` [EXTRACTED]
- [[salesrepository.ts]] - `contains` [EXTRACTED]

## Source
**From** `server/src/entities/sales/repository.ts` **(starting line 218):**
```typescript
function whereClause(filter: SalesFilter): { clause: string; params: string[] } {
  const conditions: string[] = [];
  const params: string[] = [];
  if (filter.from) {
    conditions.push("businessDate >= ?");
    params.push(filter.from);
  }
  if (filter.to) {
    conditions.push("businessDate <= ?");
    params.push(filter.to);
  }
  return { clause: conditions.length ? `WHERE ${conditions.join(" AND ")}` : "", params };
}
```

#graphify/code #graphify/EXTRACTED #community/Sales_Import_Parsing_Pipeline