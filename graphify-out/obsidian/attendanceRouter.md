---
source_file: "server/src/entities/attendance/routes.ts"
type: "code"
community: "Generic CRUD Backend"
location: "L4"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Generic_CRUD_Backend
---

# attendanceRouter

## Connections
- [[attendanceroutes.ts]] - `contains` [EXTRACTED]
- [[index.ts]] - `imports` [EXTRACTED]

## Source
**From** `server/src/entities/attendance/routes.ts` **(starting line 4):**
```typescript
export const attendanceRouter = createCrudRouter(attendanceRepository);
```

#graphify/code #graphify/EXTRACTED #community/Generic_CRUD_Backend