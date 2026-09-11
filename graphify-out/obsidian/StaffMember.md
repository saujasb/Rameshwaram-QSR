---
source_file: "shared-types/entities.ts"
type: "code"
community: "Staff & Shift Operations UI"
location: "L159"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Staff__Shift_Operations_UI
---

# StaffMember

## Connections
- [[BaseRecord]] - `inherits` [EXTRACTED]
- [[StaffPage.tsx]] - `imports` [EXTRACTED]
- [[entities.ts]] - `contains` [EXTRACTED]
- [[staff.ts]] - `imports` [EXTRACTED]
- [[staffrepository.ts]] - `imports` [EXTRACTED]

## Source
**From** `shared-types/entities.ts` **(starting line 159):**
```typescript
export interface StaffMember extends BaseRecord {
  name: string;
  role: StaffRole;
  department: string;
  phone: string;
  active: boolean;
}
```

#graphify/code #graphify/EXTRACTED #community/Staff__Shift_Operations_UI