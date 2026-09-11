---
source_file: "server/src/entities/tasks/repository.ts"
type: "code"
community: "Generic CRUD Backend"
location: "L1"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Generic_CRUD_Backend
---

# tasks/repository.ts

## Connections
- [[Task]] - `imports` [EXTRACTED]
- [[createRepository()]] - `imports` [EXTRACTED]
- [[entities.ts]] - `imports_from` [EXTRACTED]
- [[run.ts]] - `imports_from` [EXTRACTED]
- [[sharedactionCenter.ts]] - `imports_from` [EXTRACTED]
- [[sharedrepository.ts]] - `imports_from` [EXTRACTED]
- [[taskRepository]] - `contains` [EXTRACTED]
- [[tasksroutes.ts]] - `imports_from` [EXTRACTED]

## Source
**From** `server/src/entities/tasks/repository.ts` **(starting line 1):**
```typescript
import { createRepository } from "../../shared/repository.js";
```

#graphify/code #graphify/EXTRACTED #community/Generic_CRUD_Backend