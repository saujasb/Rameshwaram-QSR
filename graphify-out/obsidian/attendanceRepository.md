---
source_file: "server/src/entities/attendance/repository.ts"
type: "code"
community: "Generic CRUD Backend"
location: "L4"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Generic_CRUD_Backend
---

# attendanceRepository

## Connections
- [[attendancerepository.ts]] - `contains` [EXTRACTED]
- [[attendanceroutes.ts]] - `imports` [EXTRACTED]

## Source
**From** `server/src/entities/attendance/repository.ts` **(starting line 4):**
```typescript
export const attendanceRepository = createRepository<AttendanceRecord>("attendance");
```

#graphify/code #graphify/EXTRACTED #community/Generic_CRUD_Backend