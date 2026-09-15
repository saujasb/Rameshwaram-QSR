---
type: community
members: 11
---

# DB Seeding & Wastage/Inventory Repositories

**Members:** 11 nodes

## Members
- [[SOP_TASKS]] - code - server/src/db/seed/run.ts
- [[inventoryrepository.ts]] - code - server/src/entities/inventory/repository.ts
- [[inventoryRepository]] - code - server/src/entities/inventory/repository.ts
- [[run.ts]] - code - server/src/db/seed/run.ts
- [[seedInventory()]] - code - server/src/db/seed/run.ts
- [[seedTasks()]] - code - server/src/db/seed/run.ts
- [[seedWastage()]] - code - server/src/db/seed/run.ts
- [[wastagerepository.ts]] - code - server/src/entities/wastage/repository.ts
- [[wastageroutes.ts]] - code - server/src/entities/wastage/routes.ts
- [[wastageRepository]] - code - server/src/entities/wastage/repository.ts
- [[wastageRouter]] - code - server/src/entities/wastage/routes.ts

## Live Query (requires Dataview plugin)

```dataview
TABLE source_file, type FROM #community/DB_Seeding__Wastage/Inventory_Repositories
SORT file.name ASC
```

## Connections to other communities
- 6 edges to [[_COMMUNITY_Action Center, Purchases & Tasks Routers]]
- 4 edges to [[_COMMUNITY_Repository Base, AttendanceExpensesStaff Routers]]
- 4 edges to [[_COMMUNITY_Generic CRUD Router & Inventory Movement Routes]]
- 3 edges to [[_COMMUNITY_Shared Entity Enums & Wastage]]
- 2 edges to [[_COMMUNITY_Server App Entry & Misc Routers]]
- 2 edges to [[_COMMUNITY_Analytics Charts & Dashboard KPIs]]
- 1 edge to [[_COMMUNITY_Inventory Management UI]]

## Top bridge nodes
- [[inventoryrepository.ts]] - degree 8, connects to 5 communities
- [[wastagerepository.ts]] - degree 8, connects to 3 communities
- [[run.ts]] - degree 12, connects to 2 communities
- [[wastageroutes.ts]] - degree 6, connects to 2 communities
- [[inventoryRepository]] - degree 4, connects to 2 communities