---
source_file: "shared-types/entities.ts"
type: "code"
community: "Complaints & Shared Entity Enums"
location: "L118"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Complaints__Shared_Entity_Enums
---

# MaintenanceStatus

## Connections
- [[entities.ts]] - `contains` [EXTRACTED]

## Source
**From** `shared-types/entities.ts` **(starting line 118):**
```typescript
export type MaintenanceStatus = "open" | "assigned" | "in_progress" | "waiting" | "resolved";

export interface MaintenanceIssue extends BaseRecord {
  equipment: string;
  location: string;
  issueDescription: string;
  priority: MaintenancePriority;
  reportedBy: string;
  assignedTo: string | null;
  dateReported: string;
  expectedResolution: string | null;
  cost: number | null;
  status: MaintenanceStatus;
}
```

#graphify/code #graphify/EXTRACTED #community/Complaints__Shared_Entity_Enums