---
source_file: "server/src/entities/wastage/repository.ts"
type: "code"
community: "Generic CRUD Backend"
location: "L4"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Generic_CRUD_Backend
---

# wastageRepository

## Connections
- [[run.ts]] - `imports` [EXTRACTED]
- [[sharedactionCenter.ts]] - `imports` [EXTRACTED]
- [[wastagerepository.ts]] - `contains` [EXTRACTED]
- [[wastageroutes.ts]] - `imports` [EXTRACTED]

## Source
**From** `server/src/entities/wastage/repository.ts` **(starting line 4):**
```typescript
export const wastageRepository = createRepository<WastageEntry>("wastage");
```

#graphify/code #graphify/EXTRACTED #community/Generic_CRUD_Backend