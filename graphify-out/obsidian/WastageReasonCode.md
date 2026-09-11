---
source_file: "shared-types/entities.ts"
type: "code"
community: "Complaints & Shared Entity Enums"
location: "L11"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Complaints__Shared_Entity_Enums
---

# WastageReasonCode

## Connections
- [[entities.ts]] - `contains` [EXTRACTED]

## Source
**From** `shared-types/entities.ts` **(starting line 11):**
```typescript
export type WastageReasonCode =
  | "expired"
  | "overproduction"
  | "spillage"
  | "prep_error"
  | "customer_return"
  | "damaged"
  | "other";
```

#graphify/code #graphify/EXTRACTED #community/Complaints__Shared_Entity_Enums