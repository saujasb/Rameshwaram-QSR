---
source_file: "shared-types/entities.ts"
type: "code"
community: "Maintenance & Suppliers UI"
location: "L120"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Maintenance__Suppliers_UI
---

# MaintenanceIssue

## Connections
- [[BaseRecord]] - `inherits` [EXTRACTED]
- [[MaintenancePage.tsx]] - `imports` [EXTRACTED]
- [[entities.ts]] - `contains` [EXTRACTED]
- [[maintenance.ts]] - `imports` [EXTRACTED]
- [[maintenancerepository.ts]] - `imports` [EXTRACTED]

## Source
**From** `shared-types/entities.ts` **(starting line 120):**
```typescript
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

#graphify/code #graphify/EXTRACTED #community/Maintenance__Suppliers_UI