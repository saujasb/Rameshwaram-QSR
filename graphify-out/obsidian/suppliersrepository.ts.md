---
source_file: "server/src/entities/suppliers/repository.ts"
type: "code"
community: "Generic CRUD Backend"
location: "L1"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Generic_CRUD_Backend
---

# suppliers/repository.ts

## Connections
- [[Supplier]] - `imports` [EXTRACTED]
- [[createRepository()]] - `imports` [EXTRACTED]
- [[entities.ts]] - `imports_from` [EXTRACTED]
- [[sharedrepository.ts]] - `imports_from` [EXTRACTED]
- [[supplierRepository]] - `contains` [EXTRACTED]
- [[suppliersroutes.ts]] - `imports_from` [EXTRACTED]

## Source
**From** `server/src/entities/suppliers/repository.ts` **(starting line 1):**
```typescript
import { createRepository } from "../../shared/repository.js";
```

#graphify/code #graphify/EXTRACTED #community/Generic_CRUD_Backend