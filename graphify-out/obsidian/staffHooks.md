---
source_file: "client/src/lib/api/staff.ts"
type: "code"
community: "Staff & Shift Operations UI"
location: "L4"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Staff__Shift_Operations_UI
---

# staffHooks

## Connections
- [[AttendancePage.tsx]] - `imports` [EXTRACTED]
- [[StaffPage.tsx]] - `imports` [EXTRACTED]
- [[staff.ts]] - `contains` [EXTRACTED]

## Source
**From** `client/src/lib/api/staff.ts` **(starting line 4):**
```typescript
export const staffHooks = createEntityHooks<StaffMember>("staff");
```

#graphify/code #graphify/EXTRACTED #community/Staff__Shift_Operations_UI