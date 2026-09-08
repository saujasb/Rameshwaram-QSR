---
source_file: "client/src/lib/api/maintenance.ts"
type: "code"
community: "Maintenance & Suppliers UI"
location: "L4"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Maintenance__Suppliers_UI
---

# maintenanceHooks

## Connections
- [[DashboardPage.tsx]] - `imports` [EXTRACTED]
- [[MaintenancePage.tsx]] - `imports` [EXTRACTED]
- [[maintenance.ts]] - `contains` [EXTRACTED]

## Source
**From** `client/src/lib/api/maintenance.ts` **(starting line 4):**
```typescript
export const maintenanceHooks = createEntityHooks<MaintenanceIssue>("maintenance");
```

#graphify/code #graphify/EXTRACTED #community/Maintenance__Suppliers_UI