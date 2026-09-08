---
source_file: "shared-types/entities.ts"
type: "code"
community: "Complaints & Shared Entity Enums"
location: "L133"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Complaints__Shared_Entity_Enums
---

# ComplaintStatus

## Connections
- [[entities.ts]] - `contains` [EXTRACTED]

## Source
**From** `shared-types/entities.ts` **(starting line 133):**
```typescript
export type ComplaintStatus = "new" | "investigating" | "resolved" | "escalated";

export interface ComplaintRecord extends BaseRecord {
  customerName: string;
  orderRef: string;
  issueType: string;
  description: string;
  ratingOutOf5: number | null;
  employeeInvolved: string;
  assignedManager: string;
  resolution: string;
  resolutionTime: string | null;
  status: ComplaintStatus;
  date: string;
}
```

#graphify/code #graphify/EXTRACTED #community/Complaints__Shared_Entity_Enums