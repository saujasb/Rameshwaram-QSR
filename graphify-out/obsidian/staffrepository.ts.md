---
source_file: "server/src/entities/staff/repository.ts"
type: "code"
community: "Generic CRUD Backend"
location: "L1"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Generic_CRUD_Backend
---

# staff/repository.ts

## Connections
- [[StaffMember]] - `imports` [EXTRACTED]
- [[createRepository()]] - `imports` [EXTRACTED]
- [[entities.ts]] - `imports_from` [EXTRACTED]
- [[sharedrepository.ts]] - `imports_from` [EXTRACTED]
- [[staffroutes.ts]] - `imports_from` [EXTRACTED]
- [[staffRepository]] - `contains` [EXTRACTED]

## Source
**From** `server/src/entities/staff/repository.ts` **(starting line 1):**
```typescript
import { createRepository } from "../../shared/repository.js";
```

#graphify/code #graphify/EXTRACTED #community/Generic_CRUD_Backend