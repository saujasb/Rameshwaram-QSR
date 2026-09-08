---
source_file: "server/src/entities/datasets/db.ts"
type: "code"
community: "Ramesh AI Query Engine"
location: "L1"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Ramesh_AI_Query_Engine
---

# datasets/db.ts

## Connections
- [[datasetsrepository.ts]] - `re_exports` [EXTRACTED]
- [[datasetsroutes.ts]] - `imports_from` [EXTRACTED]
- [[db]] - `imports` [EXTRACTED]
- [[dbclient.ts]] - `imports_from` [EXTRACTED]
- [[ensureDatasetTables()]] - `contains` [EXTRACTED]
- [[getBusinessDayStartHour()]] - `contains` [EXTRACTED]
- [[intelligenceroutes.ts]] - `imports_from` [EXTRACTED]
- [[migrateLegacySalesLineItems()]] - `contains` [EXTRACTED]
- [[salesrepository.ts]] - `imports_from` [EXTRACTED]
- [[setBusinessDayStartHour()]] - `contains` [EXTRACTED]
- [[tableExists()]] - `contains` [EXTRACTED]

## Source
**From** `server/src/entities/datasets/db.ts` **(starting line 1):**
```typescript
import { db } from "../../db/client.js";
```

#graphify/code #graphify/EXTRACTED #community/Ramesh_AI_Query_Engine