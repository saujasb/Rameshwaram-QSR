---
source_file: "shared-types/entities.ts"
type: "code"
community: "Complaints & Shared Entity Enums"
location: "L1"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Complaints__Shared_Entity_Enums
---

# RecordSource

## Connections
- [[entities.ts]] - `contains` [EXTRACTED]

## Source
**From** `shared-types/entities.ts` **(starting line 1):**
```typescript
export type RecordSource = "seed" | "manual";

export interface BaseRecord {
  id: string;
  createdAt: string;
  updatedAt: string;
}
```

#graphify/code #graphify/EXTRACTED #community/Complaints__Shared_Entity_Enums