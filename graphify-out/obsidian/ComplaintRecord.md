---
source_file: "shared-types/entities.ts"
type: "code"
community: "Complaints & Shared Entity Enums"
location: "L135"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Complaints__Shared_Entity_Enums
---

# ComplaintRecord

## Connections
- [[BaseRecord]] - `inherits` [EXTRACTED]
- [[ComplaintsPage.tsx]] - `imports` [EXTRACTED]
- [[complaints.ts]] - `imports` [EXTRACTED]
- [[complaintsrepository.ts]] - `imports` [EXTRACTED]
- [[entities.ts]] - `contains` [EXTRACTED]

## Source
**From** `shared-types/entities.ts` **(starting line 135):**
```typescript
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