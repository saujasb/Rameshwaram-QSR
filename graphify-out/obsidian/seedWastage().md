---
source_file: "server/src/db/seed/run.ts"
type: "code"
community: "Generic CRUD Backend"
location: "L9"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Generic_CRUD_Backend
---

# seedWastage()

## Connections
- [[run.ts]] - `contains` [EXTRACTED]

## Source
**From** `server/src/db/seed/run.ts` **(starting line 9):**
```typescript
function seedWastage() {
  if (wastageRepository.list().length > 0) return;
  for (const item of analyticsSnapshot.wastage) {
    wastageRepository.create({
      itemName: item.name,
      quantityKg: item.wastageKg,
      reasonCode: null, // not recorded in the source report
      employeeName: null,
      shift: null,
      date: analyticsSnapshot.reportDate,
      estimatedCostRupees: null,
      notes: item.topContributor ? "Top-4 wastage contributor on the source report." : "",
      source: "seed",
    });
  }
  console.log(`[seed] wastage: ${analyticsSnapshot.wastage.length} rows (07-Aug-2026 report)`);
}
```

#graphify/code #graphify/EXTRACTED #community/Generic_CRUD_Backend