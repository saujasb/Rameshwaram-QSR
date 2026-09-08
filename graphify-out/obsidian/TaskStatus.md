---
source_file: "shared-types/entities.ts"
type: "code"
community: "Complaints & Shared Entity Enums"
location: "L35"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Complaints__Shared_Entity_Enums
---

# TaskStatus

## Connections
- [[entities.ts]] - `contains` [EXTRACTED]

## Source
**From** `shared-types/entities.ts` **(starting line 35):**
```typescript
export type TaskStatus =
  | "not_started"
  | "in_progress"
  | "completed"
  | "overdue"
  | "failed"
  | "requires_verification";
```

#graphify/code #graphify/EXTRACTED #community/Complaints__Shared_Entity_Enums