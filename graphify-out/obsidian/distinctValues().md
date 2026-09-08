---
source_file: "server/src/entities/datasets/repository.ts"
type: "code"
community: "Business Intelligence Engine"
location: "L529"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Business_Intelligence_Engine
---

# distinctValues()

## Connections
- [[answer()]] - `calls` [EXTRACTED]
- [[datasetsrepository.ts]] - `contains` [EXTRACTED]
- [[datasetsroutes.ts]] - `imports` [EXTRACTED]
- [[engine.ts]] - `imports` [EXTRACTED]
- [[insights.ts]] - `imports` [EXTRACTED]
- [[whereLabel()]] - `calls` [EXTRACTED]

## Source
**From** `server/src/entities/datasets/repository.ts` **(starting line 529):**
```typescript
export function distinctValues(column: "product" | "outlet" | "shift"): string[] {
  const col = column === "product" ? "product" : column;
  return (
    db.prepare(`SELECT DISTINCT ${col} as v FROM dataset_records WHERE ${col} IS NOT NULL ORDER BY v ASC LIMIT 500`).all() as {
      v: string;
    }[]
  ).map((r) => r.v);
}
```

#graphify/code #graphify/EXTRACTED #community/Business_Intelligence_Engine