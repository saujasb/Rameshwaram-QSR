---
source_file: "server/src/db/client.ts"
type: "code"
community: "Generic CRUD Backend"
location: "L1"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Generic_CRUD_Backend
---

# db/client.ts

## Connections
- [[__dirname]] - `contains` [EXTRACTED]
- [[datasetsdb.ts]] - `imports_from` [EXTRACTED]
- [[datasetsrepository.ts]] - `imports_from` [EXTRACTED]
- [[db]] - `contains` [EXTRACTED]
- [[ensureTable()]] - `contains` [EXTRACTED]
- [[provider-ordersdb.ts]] - `imports_from` [EXTRACTED]
- [[provider-ordersrepository.ts]] - `imports_from` [EXTRACTED]
- [[salesdb.ts]] - `imports_from` [EXTRACTED]
- [[salesrepository.ts]] - `imports_from` [EXTRACTED]
- [[sharedrepository.ts]] - `imports_from` [EXTRACTED]

## Source
**From** `server/src/db/client.ts` **(starting line 1):**
```typescript
import Database from "better-sqlite3";
import { mkdirSync } from "node:fs";
```

#graphify/code #graphify/EXTRACTED #community/Generic_CRUD_Backend