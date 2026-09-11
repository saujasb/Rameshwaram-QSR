---
source_file: "server/src/entities/datasets/repository.ts"
type: "code"
community: "Ramesh AI Query Engine"
location: "L274"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Ramesh_AI_Query_Engine
---

# queryRecords()

## Connections
- [[buildWhere()]] - `calls` [EXTRACTED]
- [[datasetsrepository.ts]] - `contains` [EXTRACTED]
- [[datasetsroutes.ts]] - `imports` [EXTRACTED]
- [[mapRecord()]] - `indirect_call` [INFERRED]

## Source
**From** `server/src/entities/datasets/repository.ts` **(starting line 274):**
```typescript
export function queryRecords(filter: DatasetFilter): PaginatedRecords {
  const { clause, params } = buildWhere(filter);
  const total = (db.prepare(`SELECT COUNT(*) as c FROM dataset_records ${clause}`).get(...params) as { c: number }).c;
  const pageSize = Math.min(MAX_PAGE_SIZE, Math.max(1, filter.pageSize ?? 50));
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const page = Math.min(Math.max(1, filter.page ?? 1), totalPages);
  const rows = db
    .prepare(
      `SELECT * FROM dataset_records ${clause}
       ORDER BY businessDate DESC, COALESCE(rawTimestamp, '') DESC, salesValue DESC, quantity DESC
       LIMIT ? OFFSET ?`
    )
    .all(...params, pageSize, (page - 1) * pageSize)
    .map(mapRecord);

  return { data: rows, pagination: { page, pageSize, totalItems: total, totalPages } };
}
```

#graphify/code #graphify/EXTRACTED #community/Ramesh_AI_Query_Engine