---
source_file: "client/src/lib/api/complaints.ts"
type: "code"
community: "Complaints & Shared Entity Enums"
location: "L1"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Complaints__Shared_Entity_Enums
---

# complaints.ts

## Connections
- [[ComplaintRecord]] - `imports` [EXTRACTED]
- [[ComplaintsPage.tsx]] - `imports_from` [EXTRACTED]
- [[DashboardPage.tsx]] - `imports_from` [EXTRACTED]
- [[complaintHooks]] - `contains` [EXTRACTED]
- [[createEntityHooks()]] - `imports` [EXTRACTED]
- [[createEntityHooks.ts]] - `imports_from` [EXTRACTED]
- [[entities.ts]] - `imports_from` [EXTRACTED]

## Source
**Full file:** `client/src/lib/api/complaints.ts`
```typescript
import { createEntityHooks } from "../createEntityHooks";
import type { ComplaintRecord } from "@shared/entities";

export const complaintHooks = createEntityHooks<ComplaintRecord>("complaints");
```

#graphify/code #graphify/EXTRACTED #community/Complaints__Shared_Entity_Enums