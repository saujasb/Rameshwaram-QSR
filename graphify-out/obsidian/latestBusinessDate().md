---
source_file: "server/src/entities/datasets/repository.ts"
type: "code"
community: "Business Intelligence Engine"
location: "L538"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Business_Intelligence_Engine
---

# latestBusinessDate()

## Connections
- [[datasetsrepository.ts]] - `contains` [EXTRACTED]
- [[engine.ts]] - `imports` [EXTRACTED]
- [[intelligenceroutes.ts]] - `imports` [EXTRACTED]
- [[noMatch()]] - `calls` [EXTRACTED]
- [[resolveBusinessDate()]] - `calls` [EXTRACTED]

## Source
**From** `server/src/entities/datasets/repository.ts` **(starting line 538):**
```typescript
export function latestBusinessDate(datasetType?: DatasetType): string | null {
  const row = datasetType
    ? (db.prepare(`SELECT MAX(businessDate) as d FROM dataset_records WHERE datasetType = ?`).get(datasetType) as { d: string | null })
    : (db.prepare(`SELECT MAX(businessDate) as d FROM dataset_records`).get() as { d: string | null });
  return row?.d ?? null;
}
```

#graphify/code #graphify/EXTRACTED #community/Business_Intelligence_Engine