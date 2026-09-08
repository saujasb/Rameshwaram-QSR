---
source_file: "client/src/modules/tasks/taskFields.ts"
type: "code"
community: "Generic CRUD UI Components"
location: "L40"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Generic_CRUD_UI_Components
---

# taskFormFields

## Connections
- [[TaskDetailModal.tsx]] - `imports` [EXTRACTED]
- [[TasksPage.tsx]] - `imports` [EXTRACTED]
- [[taskFields.ts]] - `contains` [EXTRACTED]

## Source
**From** `client/src/modules/tasks/taskFields.ts` **(starting line 40):**
```typescript
export const taskFormFields: FormFieldConfig[] = [
  { key: "name", label: "Task name", type: "text", required: true },
```

#graphify/code #graphify/EXTRACTED #community/Generic_CRUD_UI_Components