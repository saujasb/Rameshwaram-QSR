---
source_file: "client/src/lib/api/wastage.ts"
type: "code"
community: "Staff & Shift Operations UI"
location: "L4"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Staff__Shift_Operations_UI
---

# wastageHooks

## Connections
- [[DashboardPage.tsx]] - `imports` [EXTRACTED]
- [[ShiftPerformancePage.tsx]] - `imports` [EXTRACTED]
- [[WastagePage.tsx]] - `imports` [EXTRACTED]
- [[wastage.ts]] - `contains` [EXTRACTED]

## Source
**From** `client/src/lib/api/wastage.ts` **(starting line 4):**
```typescript
export const wastageHooks = createEntityHooks<WastageEntry>("wastage");
```

#graphify/code #graphify/EXTRACTED #community/Staff__Shift_Operations_UI