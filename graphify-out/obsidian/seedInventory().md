---
source_file: "server/src/db/seed/run.ts"
type: "code"
community: "Generic CRUD Backend"
location: "L87"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Generic_CRUD_Backend
---

# seedInventory()

## Connections
- [[run.ts]] - `contains` [EXTRACTED]

## Source
**From** `server/src/db/seed/run.ts` **(starting line 87):**
```typescript
function seedInventory() {
  if (inventoryRepository.list().length > 0) return;
  let count = 0;
  for (const veg of analyticsSnapshot.vegIndent) {
    inventoryRepository.create({
      name: veg.name,
      category: "Vegetable / Produce",
      unit: veg.unit ?? "",
      parLevel: null,
      minLevel: null,
      reorderLevel: null,
      supplierId: null,
      onHandQty: null,
      lastCountedAt: null,
      source: "seed",
    });
    count++;
  }
  console.log(`[seed] inventory: ${count} item-master rows (names/units from the veg indent; no quantities — awaiting first stock count)`);
}
```

#graphify/code #graphify/EXTRACTED #community/Generic_CRUD_Backend