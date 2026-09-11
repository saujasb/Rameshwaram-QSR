---
source_file: "client/src/lib/api/actionCenter.ts"
type: "code"
community: "Action Center UI"
location: "L5"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Action_Center_UI
---

# useActionCenter()

## Connections
- [[ActionCenterPage()]] - `calls` [EXTRACTED]
- [[ActionCenterPage.tsx]] - `imports` [EXTRACTED]
- [[AttentionRequiredCard()]] - `calls` [EXTRACTED]
- [[AttentionRequiredCard.tsx]] - `imports` [EXTRACTED]
- [[DashboardPage()]] - `calls` [EXTRACTED]
- [[DashboardPage.tsx]] - `imports` [EXTRACTED]
- [[apiactionCenter.ts]] - `contains` [EXTRACTED]
- [[apiGet()]] - `calls` [EXTRACTED]

## Source
**From** `client/src/lib/api/actionCenter.ts` **(starting line 5):**
```typescript
export function useActionCenter() {
  return useQuery({
    queryKey: ["action-center"],
    queryFn: () => apiGet<ActionCenterItem[]>("/action-center"),
    refetchInterval: 30000,
  });
}
```

#graphify/code #graphify/EXTRACTED #community/Action_Center_UI