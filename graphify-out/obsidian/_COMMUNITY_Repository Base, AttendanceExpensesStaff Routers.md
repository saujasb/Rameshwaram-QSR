---
type: community
members: 14
---

# Repository Base, Attendance/Expenses/Staff Routers

**Members:** 14 nodes

## Members
- [[attendancerepository.ts]] - code - server/src/entities/attendance/repository.ts
- [[attendanceRepository]] - code - server/src/entities/attendance/repository.ts
- [[createRepository()]] - code - server/src/shared/repository.ts
- [[dbclient.ts]] - code - server/src/db/client.ts
- [[expenseRepository]] - code - server/src/entities/expenses/repository.ts
- [[expenseRouter]] - code - server/src/entities/expenses/routes.ts
- [[expensesrepository.ts]] - code - server/src/entities/expenses/repository.ts
- [[expensesroutes.ts]] - code - server/src/entities/expenses/routes.ts
- [[sharedrepository.ts]] - code - server/src/shared/repository.ts
- [[staffrepository.ts]] - code - server/src/entities/staff/repository.ts
- [[staffroutes.ts]] - code - server/src/entities/staff/routes.ts
- [[staffRepository]] - code - server/src/entities/staff/repository.ts
- [[staffRouter]] - code - server/src/entities/staff/routes.ts
- [[supabase]] - code - server/src/db/client.ts

## Live Query (requires Dataview plugin)

```dataview
TABLE source_file, type FROM #community/Repository_Base_Attendance/Expenses/Staff_Routers
SORT file.name ASC
```

## Connections to other communities
- 9 edges to [[_COMMUNITY_Generic CRUD Router & Inventory Movement Routes]]
- 8 edges to [[_COMMUNITY_Server App Entry & Misc Routers]]
- 4 edges to [[_COMMUNITY_DB Seeding & WastageInventory Repositories]]
- 4 edges to [[_COMMUNITY_Action Center, Purchases & Tasks Routers]]
- 4 edges to [[_COMMUNITY_Shared Entity Enums & Wastage]]
- 2 edges to [[_COMMUNITY_Generic CRUD UI Components & StaffAttendance]]
- 2 edges to [[_COMMUNITY_Complaints Repository & Routes]]
- 2 edges to [[_COMMUNITY_Suppliers Repository & Routes]]
- 2 edges to [[_COMMUNITY_File Uploads & Vercel Functions]]
- 1 edge to [[_COMMUNITY_Task Management (CRUD Base Record)]]
- 1 edge to [[_COMMUNITY_Expenses Module]]
- 1 edge to [[_COMMUNITY_Generic Repository Base Class]]
- 1 edge to [[_COMMUNITY_Server npm Dependencies (ExpressDBFile libs)]]

## Top bridge nodes
- [[sharedrepository.ts]] - degree 19, connects to 9 communities
- [[createRepository()]] - degree 13, connects to 6 communities
- [[attendancerepository.ts]] - degree 6, connects to 3 communities
- [[expensesrepository.ts]] - degree 6, connects to 2 communities
- [[expensesroutes.ts]] - degree 6, connects to 2 communities