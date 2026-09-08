---
source_file: "server/src/entities/datasets/repository.ts"
type: "code"
community: "Ramesh AI Query Engine"
location: "L43"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Ramesh_AI_Query_Engine
---

# UpsertResult

## Connections
- [[datasetsrepository.ts]] - `contains` [EXTRACTED]

## Source
**From** `server/src/entities/datasets/repository.ts` **(starting line 43):**
```typescript
export interface UpsertResult {
  inserted: number;
  updated: number;
  duplicates: number;
}
```

#graphify/code #graphify/EXTRACTED #community/Ramesh_AI_Query_Engine