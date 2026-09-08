---
source_file: "shared-types/entities.ts"
type: "code"
community: "Generic CRUD Backend"
location: "L43"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Generic_CRUD_Backend
---

# TaskHistoryEntry

## Connections
- [[entities.ts]] - `contains` [EXTRACTED]
- [[tasksroutes.ts]] - `imports` [EXTRACTED]

## Source
**From** `shared-types/entities.ts` **(starting line 43):**
```typescript
export interface TaskHistoryEntry {
  timestamp: string;
  action: string;
  note: string;
}
```

#graphify/code #graphify/EXTRACTED #community/Generic_CRUD_Backend