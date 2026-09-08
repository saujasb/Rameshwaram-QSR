---
source_file: "server/src/entities/complaints/routes.ts"
type: "code"
community: "Generic CRUD Backend"
location: "L4"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Generic_CRUD_Backend
---

# complaintRouter

## Connections
- [[complaintsroutes.ts]] - `contains` [EXTRACTED]
- [[index.ts]] - `imports` [EXTRACTED]

## Source
**From** `server/src/entities/complaints/routes.ts` **(starting line 4):**
```typescript
export const complaintRouter = createCrudRouter(complaintRepository);
```

#graphify/code #graphify/EXTRACTED #community/Generic_CRUD_Backend