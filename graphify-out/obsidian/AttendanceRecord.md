---
source_file: "shared-types/entities.ts"
type: "code"
community: "Staff & Shift Operations UI"
location: "L169"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Staff__Shift_Operations_UI
---

# AttendanceRecord

## Connections
- [[AttendancePage.tsx]] - `imports` [EXTRACTED]
- [[BaseRecord]] - `inherits` [EXTRACTED]
- [[attendancerepository.ts]] - `imports` [EXTRACTED]
- [[entities.ts]] - `contains` [EXTRACTED]
- [[staff.ts]] - `imports` [EXTRACTED]

## Source
**From** `shared-types/entities.ts` **(starting line 169):**
```typescript
export interface AttendanceRecord extends BaseRecord {
  staffId: string;
  date: string;
  shift: Shift;
  scheduled: boolean;
  status: AttendanceStatus;
  shiftStart: string | null;
  shiftEnd: string | null;
  notes: string;
}
```

#graphify/code #graphify/EXTRACTED #community/Staff__Shift_Operations_UI