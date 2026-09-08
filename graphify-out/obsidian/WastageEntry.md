---
source_file: "shared-types/entities.ts"
type: "code"
community: "Staff & Shift Operations UI"
location: "L20"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Staff__Shift_Operations_UI
---

# WastageEntry

## Connections
- [[BaseRecord]] - `inherits` [EXTRACTED]
- [[WastagePage.tsx]] - `imports` [EXTRACTED]
- [[entities.ts]] - `contains` [EXTRACTED]
- [[wastage.ts]] - `imports` [EXTRACTED]
- [[wastagerepository.ts]] - `imports` [EXTRACTED]

## Source
**From** `shared-types/entities.ts` **(starting line 20):**
```typescript
export interface WastageEntry extends BaseRecord {
  itemName: string;
  quantityKg: number;
  reasonCode: WastageReasonCode | null;
  employeeName: string | null;
  shift: Shift | null;
  date: string;
  estimatedCostRupees: number | null;
  notes: string;
  source: RecordSource;
}
```

#graphify/code #graphify/EXTRACTED #community/Staff__Shift_Operations_UI