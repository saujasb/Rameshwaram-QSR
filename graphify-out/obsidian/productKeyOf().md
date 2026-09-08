---
source_file: "server/src/entities/datasets/repository.ts"
type: "code"
community: "Ramesh AI Query Engine"
location: "L49"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Ramesh_AI_Query_Engine
---

# productKeyOf()

## Connections
- [[buildWhere()]] - `calls` [EXTRACTED]
- [[datasetsrepository.ts]] - `contains` [EXTRACTED]
- [[upsertRecords()]] - `calls` [EXTRACTED]

## Source
**From** `server/src/entities/datasets/repository.ts` **(starting line 49):**
```typescript
function productKeyOf(product: string): string {
  return product.trim().toLowerCase().replace(/\s+/g, " ");
}
```

#graphify/code #graphify/EXTRACTED #community/Ramesh_AI_Query_Engine