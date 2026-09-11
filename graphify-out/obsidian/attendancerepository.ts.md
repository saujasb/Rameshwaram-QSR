---
source_file: "server/src/entities/attendance/repository.ts"
type: "code"
community: "Generic CRUD Backend"
location: "L1"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Generic_CRUD_Backend
---

# attendance/repository.ts

## Connections
- [[AttendanceRecord]] - `imports` [EXTRACTED]
- [[attendanceroutes.ts]] - `imports_from` [EXTRACTED]
- [[attendanceRepository]] - `contains` [EXTRACTED]
- [[createRepository()]] - `imports` [EXTRACTED]
- [[entities.ts]] - `imports_from` [EXTRACTED]
- [[sharedrepository.ts]] - `imports_from` [EXTRACTED]

## Source
**From** `server/src/entities/attendance/repository.ts` **(starting line 1):**
```typescript
import { createRepository } from "../../shared/repository.js";
```

#graphify/code #graphify/EXTRACTED #community/Generic_CRUD_Backend