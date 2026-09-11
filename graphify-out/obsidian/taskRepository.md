---
source_file: "server/src/entities/tasks/repository.ts"
type: "code"
community: "Generic CRUD Backend"
location: "L4"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Generic_CRUD_Backend
---

# taskRepository

## Connections
- [[run.ts]] - `imports` [EXTRACTED]
- [[sharedactionCenter.ts]] - `imports` [EXTRACTED]
- [[tasksrepository.ts]] - `contains` [EXTRACTED]
- [[tasksroutes.ts]] - `imports` [EXTRACTED]

## Source
**From** `server/src/entities/tasks/repository.ts` **(starting line 4):**
```typescript
export const taskRepository = createRepository<Task>("tasks");
```

#graphify/code #graphify/EXTRACTED #community/Generic_CRUD_Backend