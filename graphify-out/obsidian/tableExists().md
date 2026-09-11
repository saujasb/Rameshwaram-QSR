---
source_file: "server/src/entities/datasets/db.ts"
type: "code"
community: "Ramesh AI Query Engine"
location: "L83"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Ramesh_AI_Query_Engine
---

# tableExists()

## Connections
- [[datasetsdb.ts]] - `contains` [EXTRACTED]
- [[migrateLegacySalesLineItems()]] - `calls` [EXTRACTED]

## Source
**From** `server/src/entities/datasets/db.ts` **(starting line 83):**
```typescript
function tableExists(name: string): boolean {
  const row = db.prepare(`SELECT name FROM sqlite_master WHERE type='table' AND name=?`).get(name);
  return Boolean(row);
}
```

#graphify/code #graphify/EXTRACTED #community/Ramesh_AI_Query_Engine