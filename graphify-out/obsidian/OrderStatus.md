---
source_file: "shared-types/entities.ts"
type: "code"
community: "Complaints & Shared Entity Enums"
location: "L199"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Complaints__Shared_Entity_Enums
---

# OrderStatus

## Connections
- [[channelHelpers.ts]] - `imports` [EXTRACTED]
- [[entities.ts]] - `contains` [EXTRACTED]

## Source
**From** `shared-types/entities.ts` **(starting line 199):**
```typescript
export type OrderStatus =
  | "received"
  | "accepted"
  | "preparing"
  | "ready"
  | "completed"
  | "cancelled"
  | "delayed";
```

#graphify/code #graphify/EXTRACTED #community/Complaints__Shared_Entity_Enums