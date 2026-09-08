---
source_file: "client/src/lib/api/staff.ts"
type: "code"
community: "Staff & Shift Operations UI"
location: "L1"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Staff__Shift_Operations_UI
---

# staff.ts

## Connections
- [[AttendancePage.tsx]] - `imports_from` [EXTRACTED]
- [[AttendanceRecord]] - `imports` [EXTRACTED]
- [[DashboardPage.tsx]] - `imports_from` [EXTRACTED]
- [[ShiftPerformancePage.tsx]] - `imports_from` [EXTRACTED]
- [[StaffMember]] - `imports` [EXTRACTED]
- [[StaffPage.tsx]] - `imports_from` [EXTRACTED]
- [[attendanceHooks]] - `contains` [EXTRACTED]
- [[createEntityHooks()]] - `imports` [EXTRACTED]
- [[createEntityHooks.ts]] - `imports_from` [EXTRACTED]
- [[entities.ts]] - `imports_from` [EXTRACTED]
- [[staffHooks]] - `contains` [EXTRACTED]

## Source
**Full file:** `client/src/lib/api/staff.ts`
```typescript
import { createEntityHooks } from "../createEntityHooks";
import type { StaffMember, AttendanceRecord } from "@shared/entities";

export const staffHooks = createEntityHooks<StaffMember>("staff");
export const attendanceHooks = createEntityHooks<AttendanceRecord>("attendance");
```

#graphify/code #graphify/EXTRACTED #community/Staff__Shift_Operations_UI