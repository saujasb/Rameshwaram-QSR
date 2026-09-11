---
source_file: "server/src/entities/provider-orders/db.ts"
type: "code"
community: "Generic CRUD Backend"
location: "L1"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Generic_CRUD_Backend
---

# provider-orders/db.ts

## Connections
- [[db]] - `imports` [EXTRACTED]
- [[dbclient.ts]] - `imports_from` [EXTRACTED]
- [[ensureProviderOrderTables()]] - `contains` [EXTRACTED]
- [[provider-ordersrepository.ts]] - `imports_from` [EXTRACTED]

## Source
**From** `server/src/entities/provider-orders/db.ts` **(starting line 1):**
```typescript
import { db } from "../../db/client.js";
```

#graphify/code #graphify/EXTRACTED #community/Generic_CRUD_Backend