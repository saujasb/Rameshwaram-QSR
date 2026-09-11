---
source_file: "client/src/lib/api/tasks.ts"
type: "code"
community: "Generic CRUD UI Components"
location: "L1"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Generic_CRUD_UI_Components
---

# tasks.ts

## Connections
- [[DashboardPage.tsx]] - `imports_from` [EXTRACTED]
- [[ShiftPerformancePage.tsx]] - `imports_from` [EXTRACTED]
- [[Task]] - `imports` [EXTRACTED]
- [[TaskDetailModal.tsx]] - `imports_from` [EXTRACTED]
- [[TasksPage.tsx]] - `imports_from` [EXTRACTED]
- [[createEntityHooks()]] - `imports` [EXTRACTED]
- [[createEntityHooks.ts]] - `imports_from` [EXTRACTED]
- [[entities.ts]] - `imports_from` [EXTRACTED]
- [[taskHooks]] - `contains` [EXTRACTED]

## Source
**Full file:** `client/src/lib/api/tasks.ts`
```typescript
import { createEntityHooks } from "../createEntityHooks";
import type { Task } from "@shared/entities";

export const taskHooks = createEntityHooks<Task>("tasks");
```

#graphify/code #graphify/EXTRACTED #community/Generic_CRUD_UI_Components