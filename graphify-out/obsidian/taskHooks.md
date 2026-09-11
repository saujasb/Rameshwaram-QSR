---
source_file: "client/src/lib/api/tasks.ts"
type: "code"
community: "Generic CRUD UI Components"
location: "L4"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Generic_CRUD_UI_Components
---

# taskHooks

## Connections
- [[DashboardPage.tsx]] - `imports` [EXTRACTED]
- [[ShiftPerformancePage.tsx]] - `imports` [EXTRACTED]
- [[TaskDetailModal.tsx]] - `imports` [EXTRACTED]
- [[TasksPage.tsx]] - `imports` [EXTRACTED]
- [[tasks.ts]] - `contains` [EXTRACTED]

## Source
**From** `client/src/lib/api/tasks.ts` **(starting line 4):**
```typescript
export const taskHooks = createEntityHooks<Task>("tasks");
```

#graphify/code #graphify/EXTRACTED #community/Generic_CRUD_UI_Components