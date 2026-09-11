---
source_file: "server/src/entities/staff/repository.ts"
type: "code"
community: "Generic CRUD Backend"
location: "L4"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Generic_CRUD_Backend
---

# staffRepository

## Connections
- [[staffrepository.ts]] - `contains` [EXTRACTED]
- [[staffroutes.ts]] - `imports` [EXTRACTED]

## Source
**From** `server/src/entities/staff/repository.ts` **(starting line 4):**
```typescript
export const staffRepository = createRepository<StaffMember>("staff");
```

#graphify/code #graphify/EXTRACTED #community/Generic_CRUD_Backend