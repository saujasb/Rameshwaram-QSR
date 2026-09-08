---
source_file: "client/src/lib/api/intelligence.ts"
type: "code"
community: "Business Intelligence Engine"
location: "L29"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Business_Intelligence_Engine
---

# useReconciliation()

## Connections
- [[IntelligencePage()]] - `calls` [EXTRACTED]
- [[IntelligencePage.tsx]] - `imports` [EXTRACTED]
- [[apiintelligence.ts]] - `contains` [EXTRACTED]
- [[apiGet()]] - `calls` [EXTRACTED]
- [[filterToParams()_1]] - `calls` [EXTRACTED]

## Source
**From** `client/src/lib/api/intelligence.ts` **(starting line 29):**
```typescript
export function useReconciliation(filter: DatasetFilter = {}) {
  return useQuery({
    queryKey: ["reconciliation", filter],
    queryFn: () => apiGet<ReconciliationSummary>(`/intelligence/reconciliation${filterToParams(filter)}`),
  });
}
```

#graphify/code #graphify/EXTRACTED #community/Business_Intelligence_Engine