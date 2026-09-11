---
source_file: "server/src/entities/tasks/routes.ts"
type: "code"
community: "Generic CRUD Backend"
location: "L6"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Generic_CRUD_Backend
---

# taskRouter

## Connections
- [[index.ts]] - `imports` [EXTRACTED]
- [[tasksroutes.ts]] - `contains` [EXTRACTED]

## Source
**From** `server/src/entities/tasks/routes.ts` **(starting line 6):**
```typescript
export const taskRouter: Router = createCrudRouter(taskRepository);

function appendHistory(taskId: string, action: string, note: string) {
  const task = taskRepository.get(taskId);
  if (!task) return undefined;
  const entry: TaskHistoryEntry = { timestamp: new Date().toISOString(), action, note };
  return { history: [...task.history, entry] };
}
```

#graphify/code #graphify/EXTRACTED #community/Generic_CRUD_Backend