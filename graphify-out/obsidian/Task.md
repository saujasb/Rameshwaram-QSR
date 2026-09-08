---
source_file: "shared-types/entities.ts"
type: "code"
community: "Generic CRUD UI Components"
location: "L49"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Generic_CRUD_UI_Components
---

# Task

## Connections
- [[BaseRecord]] - `inherits` [EXTRACTED]
- [[TaskDetailModal.tsx]] - `imports` [EXTRACTED]
- [[TasksPage.tsx]] - `imports` [EXTRACTED]
- [[entities.ts]] - `contains` [EXTRACTED]
- [[tasks.ts]] - `imports` [EXTRACTED]
- [[tasksrepository.ts]] - `imports` [EXTRACTED]

## Source
**From** `shared-types/entities.ts` **(starting line 49):**
```typescript
export interface Task extends BaseRecord {
  name: string;
  category: TaskCategory;
  department: string;
  shift: Shift | "any";
  frequency: TaskFrequency;
  assignedEmployee: string | null;
  dueTime: string | null;
  priority: TaskPriority;
  status: TaskStatus;
  completionTime: string | null;
  notes: string;
  issue: string | null;
  verifiedBy: string | null;
  sopReference: string | null;
  history: TaskHistoryEntry[];
  source: RecordSource;
}
```

#graphify/code #graphify/EXTRACTED #community/Generic_CRUD_UI_Components