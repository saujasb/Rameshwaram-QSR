---
source_file: "client/src/lib/api/intelligence.ts"
type: "code"
community: "Business Intelligence Engine"
location: "L7"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Business_Intelligence_Engine
---

# useTodaysIntelligence()

## Connections
- [[TodaysIntelligencePanel()]] - `calls` [EXTRACTED]
- [[TodaysIntelligencePanel.tsx]] - `imports` [EXTRACTED]
- [[apiintelligence.ts]] - `contains` [EXTRACTED]
- [[apiGet()]] - `calls` [EXTRACTED]

## Source
**From** `client/src/lib/api/intelligence.ts` **(starting line 7):**
```typescript
export function useTodaysIntelligence(businessDate?: string) {
  const qs = businessDate ? `?businessDate=${businessDate}` : "";
  return useQuery({
    queryKey: ["todays-intelligence", businessDate ?? null],
    queryFn: () => apiGet<TodaysIntelligence>(`/intelligence/today${qs}`),
  });
}
```

#graphify/code #graphify/EXTRACTED #community/Business_Intelligence_Engine