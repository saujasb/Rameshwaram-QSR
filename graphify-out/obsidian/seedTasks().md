---
source_file: "server/src/db/seed/run.ts"
type: "code"
community: "Generic CRUD Backend"
location: "L62"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Generic_CRUD_Backend
---

# seedTasks()

## Connections
- [[run.ts]] - `contains` [EXTRACTED]

## Source
**From** `server/src/db/seed/run.ts` **(starting line 62):**
```typescript
function seedTasks() {
  if (taskRepository.list().length > 0) return;
  for (const sop of SOP_TASKS) {
    taskRepository.create({
      name: sop.name,
      category: "spo",
      department: sop.department,
      shift: "any",
      frequency: "daily",
      assignedEmployee: null,
      dueTime: null,
      priority: "high",
      status: "not_started",
      completionTime: null,
      notes: "",
      issue: null,
      verifiedBy: null,
      sopReference: sop.sopReference,
      history: [],
      source: "seed",
    });
  }
  console.log(`[seed] tasks: ${SOP_TASKS.length} SOP templates`);
}
```

#graphify/code #graphify/EXTRACTED #community/Generic_CRUD_Backend