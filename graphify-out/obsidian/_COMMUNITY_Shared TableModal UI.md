---
type: community
members: 23
---

# Shared Table/Modal UI

**Members:** 23 nodes

## Members
- [[DataTable()]] - code - client/src/components/table/DataTable.tsx
- [[DataTable.tsx]] - code - client/src/components/table/DataTable.tsx
- [[INVENTORY_STATUS_LABEL]] - code - client/src/modules/inventory/inventoryStatusUi.ts
- [[INVENTORY_STATUS_TONE]] - code - client/src/modules/inventory/inventoryStatusUi.ts
- [[InventoryDetailModal()]] - code - client/src/modules/inventory/InventoryDetailModal.tsx
- [[InventoryDetailModal.tsx]] - code - client/src/modules/inventory/InventoryDetailModal.tsx
- [[InventoryItem]] - code - shared-types/entities.ts
- [[InventoryMovement]] - code - shared-types/entities.ts
- [[InventoryPage()]] - code - client/src/modules/inventory/InventoryPage.tsx
- [[InventoryPage.tsx]] - code - client/src/modules/inventory/InventoryPage.tsx
- [[InventoryStatus]] - code - shared-types/entities.ts
- [[Modal()]] - code - client/src/components/Modal.tsx
- [[Modal.tsx]] - code - client/src/components/Modal.tsx
- [[STATUS_FILTER_OPTIONS]] - code - client/src/modules/inventory/InventoryPage.tsx
- [[buildActionCenter()]] - code - server/src/shared/actionCenter.ts
- [[computeInventoryStatus()]] - code - shared-types/inventoryStatus.ts
- [[defaultSortValue()]] - code - client/src/components/table/DataTable.tsx
- [[inventory.ts]] - code - client/src/lib/api/inventory.ts
- [[inventoryHooks]] - code - client/src/lib/api/inventory.ts
- [[inventoryMovementHooks]] - code - client/src/lib/api/inventory.ts
- [[inventoryStatus.ts]] - code - shared-types/inventoryStatus.ts
- [[inventoryStatusUi.ts]] - code - client/src/modules/inventory/inventoryStatusUi.ts
- [[toggleSort()]] - code - client/src/components/table/DataTable.tsx

## Live Query (requires Dataview plugin)

```dataview
TABLE source_file, type FROM #community/Shared_Table/Modal_UI
SORT file.name ASC
```

## Connections to other communities
- 14 edges to [[_COMMUNITY_Record Form & Status UI]]
- 9 edges to [[_COMMUNITY_Generic CRUD Module Framework]]
- 8 edges to [[_COMMUNITY_Expense Tracking]]
- 5 edges to [[_COMMUNITY_Database Client & Seeding]]
- 5 edges to [[_COMMUNITY_Formatting Utilities]]
- 4 edges to [[_COMMUNITY_Datasets API & Export]]
- 4 edges to [[_COMMUNITY_Provider Orders & Live Feed]]
- 3 edges to [[_COMMUNITY_CRUD HookRepository Pattern]]
- 3 edges to [[_COMMUNITY_API Client & Complaints]]
- 2 edges to [[_COMMUNITY_Sales Data Hooks]]
- 2 edges to [[_COMMUNITY_Staff & Wastage Tracking]]
- 2 edges to [[_COMMUNITY_Suppliers Tracking]]

## Top bridge nodes
- [[InventoryPage.tsx]] - degree 29, connects to 6 communities
- [[Modal()]] - degree 9, connects to 5 communities
- [[Modal.tsx]] - degree 9, connects to 5 communities
- [[InventoryDetailModal.tsx]] - degree 18, connects to 4 communities
- [[inventory.ts]] - degree 10, connects to 3 communities