---
type: community
members: 7
---

# Maintenance Tracking

**Members:** 7 nodes

## Members
- [[MaintenanceIssue]] - code - shared-types/entities.ts
- [[MaintenancePage()]] - code - client/src/modules/maintenance/MaintenancePage.tsx
- [[MaintenancePage.tsx]] - code - client/src/modules/maintenance/MaintenancePage.tsx
- [[columns_5]] - code - client/src/modules/maintenance/MaintenancePage.tsx
- [[formFields_4]] - code - client/src/modules/maintenance/MaintenancePage.tsx
- [[maintenance.ts]] - code - client/src/lib/api/maintenance.ts
- [[maintenanceHooks]] - code - client/src/lib/api/maintenance.ts

## Live Query (requires Dataview plugin)

```dataview
TABLE source_file, type FROM #community/Maintenance_Tracking
SORT file.name ASC
```

## Connections to other communities
- 5 edges to [[_COMMUNITY_Generic CRUD Module Framework]]
- 3 edges to [[_COMMUNITY_Expense Tracking]]
- 2 edges to [[_COMMUNITY_API Client & Complaints]]
- 2 edges to [[_COMMUNITY_Record Form & Status UI]]
- 2 edges to [[_COMMUNITY_Staff & Wastage Tracking]]
- 2 edges to [[_COMMUNITY_Formatting Utilities]]
- 1 edge to [[_COMMUNITY_CRUD HookRepository Pattern]]
- 1 edge to [[_COMMUNITY_Database Client & Seeding]]

## Top bridge nodes
- [[MaintenancePage.tsx]] - degree 15, connects to 4 communities
- [[maintenance.ts]] - degree 7, connects to 3 communities
- [[MaintenanceIssue]] - degree 5, connects to 3 communities
- [[maintenanceHooks]] - degree 3, connects to 1 community
- [[MaintenancePage()]] - degree 2, connects to 1 community