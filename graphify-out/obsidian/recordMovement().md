---
source_file: "server/src/entities/inventory/routes.ts"
type: "code"
community: "Generic CRUD Backend"
location: "L8"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Generic_CRUD_Backend
---

# recordMovement()

## Connections
- [[inventoryroutes.ts]] - `contains` [EXTRACTED]

## Source
**From** `server/src/entities/inventory/routes.ts` **(starting line 8):**
```typescript
function recordMovement(
  itemId: string,
  type: "receive" | "adjustment" | "count",
  quantityDelta: number,
  resultingQty: number,
  note: string,
  employeeName: string
) {
  inventoryMovementRepository.create({
    itemId,
    type,
    quantityDelta,
    resultingQty,
    note,
    employeeName,
```

#graphify/code #graphify/EXTRACTED #community/Generic_CRUD_Backend