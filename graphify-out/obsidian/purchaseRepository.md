---
source_file: "server/src/entities/purchases/repository.ts"
type: "code"
community: "Generic CRUD Backend"
location: "L4"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Generic_CRUD_Backend
---

# purchaseRepository

## Connections
- [[purchasesrepository.ts]] - `contains` [EXTRACTED]
- [[purchasesroutes.ts]] - `imports` [EXTRACTED]
- [[sharedactionCenter.ts]] - `imports` [EXTRACTED]

## Source
**From** `server/src/entities/purchases/repository.ts` **(starting line 4):**
```typescript
export const purchaseRepository = createRepository<Purchase>("purchases");
```

#graphify/code #graphify/EXTRACTED #community/Generic_CRUD_Backend