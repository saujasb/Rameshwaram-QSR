---
source_file: "client/src/lib/api/intelligence.ts"
type: "code"
community: "Business Intelligence Engine"
location: "L22"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Business_Intelligence_Engine
---

# useAnomalies()

## Connections
- [[IntelligencePage()]] - `calls` [EXTRACTED]
- [[IntelligencePage.tsx]] - `imports` [EXTRACTED]
- [[apiintelligence.ts]] - `contains` [EXTRACTED]
- [[apiGet()]] - `calls` [EXTRACTED]
- [[filterToParams()_1]] - `calls` [EXTRACTED]

## Source
**From** `client/src/lib/api/intelligence.ts` **(starting line 22):**
```typescript
export function useAnomalies(filter: DatasetFilter = {}) {
  return useQuery({
    queryKey: ["anomalies", filter],
    queryFn: () => apiGet<Anomaly[]>(`/intelligence/anomalies${filterToParams(filter)}`),
  });
}
```

#graphify/code #graphify/EXTRACTED #community/Business_Intelligence_Engine