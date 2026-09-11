---
source_file: "client/src/lib/api/staff.ts"
type: "code"
community: "Staff & Shift Operations UI"
location: "L5"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Staff__Shift_Operations_UI
---

# attendanceHooks

## Connections
- [[AttendancePage.tsx]] - `imports` [EXTRACTED]
- [[DashboardPage.tsx]] - `imports` [EXTRACTED]
- [[ShiftPerformancePage.tsx]] - `imports` [EXTRACTED]
- [[staff.ts]] - `contains` [EXTRACTED]

## Source
**From** `client/src/lib/api/staff.ts` **(starting line 5):**
```typescript
export const attendanceHooks = createEntityHooks<AttendanceRecord>("attendance");
```

#graphify/code #graphify/EXTRACTED #community/Staff__Shift_Operations_UI