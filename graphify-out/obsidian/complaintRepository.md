---
source_file: "server/src/entities/complaints/repository.ts"
type: "code"
community: "Generic CRUD Backend"
location: "L4"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Generic_CRUD_Backend
---

# complaintRepository

## Connections
- [[complaintsrepository.ts]] - `contains` [EXTRACTED]
- [[complaintsroutes.ts]] - `imports` [EXTRACTED]
- [[sharedactionCenter.ts]] - `imports` [EXTRACTED]

## Source
**From** `server/src/entities/complaints/repository.ts` **(starting line 4):**
```typescript
export const complaintRepository = createRepository<ComplaintRecord>("complaints");
```

#graphify/code #graphify/EXTRACTED #community/Generic_CRUD_Backend