---
source_file: "server/src/entities/complaints/repository.ts"
type: "code"
community: "Generic CRUD Backend"
location: "L1"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Generic_CRUD_Backend
---

# complaints/repository.ts

## Connections
- [[ComplaintRecord]] - `imports` [EXTRACTED]
- [[complaintRepository]] - `contains` [EXTRACTED]
- [[complaintsroutes.ts]] - `imports_from` [EXTRACTED]
- [[createRepository()]] - `imports` [EXTRACTED]
- [[entities.ts]] - `imports_from` [EXTRACTED]
- [[sharedactionCenter.ts]] - `imports_from` [EXTRACTED]
- [[sharedrepository.ts]] - `imports_from` [EXTRACTED]

## Source
**From** `server/src/entities/complaints/repository.ts` **(starting line 1):**
```typescript
import { createRepository } from "../../shared/repository.js";
```

#graphify/code #graphify/EXTRACTED #community/Generic_CRUD_Backend