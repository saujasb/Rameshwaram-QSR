---
source_file: "client/src/lib/api/complaints.ts"
type: "code"
community: "Complaints & Shared Entity Enums"
location: "L4"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Complaints__Shared_Entity_Enums
---

# complaintHooks

## Connections
- [[ComplaintsPage.tsx]] - `imports` [EXTRACTED]
- [[DashboardPage.tsx]] - `imports` [EXTRACTED]
- [[complaints.ts]] - `contains` [EXTRACTED]

## Source
**From** `client/src/lib/api/complaints.ts` **(starting line 4):**
```typescript
export const complaintHooks = createEntityHooks<ComplaintRecord>("complaints");
```

#graphify/code #graphify/EXTRACTED #community/Complaints__Shared_Entity_Enums