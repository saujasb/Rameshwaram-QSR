---
source_file: "client/src/lib/api/wastage.ts"
type: "code"
community: "Staff & Shift Operations UI"
location: "L1"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Staff__Shift_Operations_UI
---

# wastage.ts

## Connections
- [[DashboardPage.tsx]] - `imports_from` [EXTRACTED]
- [[ShiftPerformancePage.tsx]] - `imports_from` [EXTRACTED]
- [[WastageEntry]] - `imports` [EXTRACTED]
- [[WastagePage.tsx]] - `imports_from` [EXTRACTED]
- [[createEntityHooks()]] - `imports` [EXTRACTED]
- [[createEntityHooks.ts]] - `imports_from` [EXTRACTED]
- [[entities.ts]] - `imports_from` [EXTRACTED]
- [[wastageHooks]] - `contains` [EXTRACTED]

## Source
**Full file:** `client/src/lib/api/wastage.ts`
```typescript
import { createEntityHooks } from "../createEntityHooks";
import type { WastageEntry } from "@shared/entities";

export const wastageHooks = createEntityHooks<WastageEntry>("wastage");
```

#graphify/code #graphify/EXTRACTED #community/Staff__Shift_Operations_UI