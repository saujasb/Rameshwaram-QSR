---
source_file: "client/src/lib/api/intelligence.ts"
type: "code"
community: "Business Intelligence Engine"
location: "L15"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Business_Intelligence_Engine
---

# useTopInsights()

## Connections
- [[TopInsightsPanel()]] - `calls` [EXTRACTED]
- [[TopInsightsPanel.tsx]] - `imports` [EXTRACTED]
- [[apiintelligence.ts]] - `contains` [EXTRACTED]
- [[apiGet()]] - `calls` [EXTRACTED]
- [[filterToParams()_1]] - `calls` [EXTRACTED]

## Source
**From** `client/src/lib/api/intelligence.ts` **(starting line 15):**
```typescript
export function useTopInsights(filter: DatasetFilter = {}) {
  return useQuery({
    queryKey: ["top-insights", filter],
    queryFn: () => apiGet<Insight[]>(`/intelligence/insights${filterToParams(filter)}`),
  });
}
```

#graphify/code #graphify/EXTRACTED #community/Business_Intelligence_Engine