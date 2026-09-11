---
source_file: "shared-types/entities.ts"
type: "code"
community: "Complaints & Shared Entity Enums"
location: "L167"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Complaints__Shared_Entity_Enums
---

# AttendanceStatus

## Connections
- [[entities.ts]] - `contains` [EXTRACTED]

## Source
**From** `shared-types/entities.ts` **(starting line 167):**
```typescript
export type AttendanceStatus = "present" | "absent" | "late" | "on_break";

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

#graphify/code #graphify/EXTRACTED #community/Complaints__Shared_Entity_Enums