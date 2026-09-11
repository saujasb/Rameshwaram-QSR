---
source_file: "client/src/lib/api/maintenance.ts"
type: "code"
community: "Maintenance & Suppliers UI"
location: "L1"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Maintenance__Suppliers_UI
---

# maintenance.ts

## Connections
- [[DashboardPage.tsx]] - `imports_from` [EXTRACTED]
- [[MaintenanceIssue]] - `imports` [EXTRACTED]
- [[MaintenancePage.tsx]] - `imports_from` [EXTRACTED]
- [[createEntityHooks()]] - `imports` [EXTRACTED]
- [[createEntityHooks.ts]] - `imports_from` [EXTRACTED]
- [[entities.ts]] - `imports_from` [EXTRACTED]
- [[maintenanceHooks]] - `contains` [EXTRACTED]

## Source
**Full file:** `client/src/lib/api/maintenance.ts`
```typescript
import { createEntityHooks } from "../createEntityHooks";
import type { MaintenanceIssue } from "@shared/entities";

export const maintenanceHooks = createEntityHooks<MaintenanceIssue>("maintenance");
```

#graphify/code #graphify/EXTRACTED #community/Maintenance__Suppliers_UI