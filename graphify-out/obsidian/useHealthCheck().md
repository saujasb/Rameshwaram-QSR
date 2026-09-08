---
source_file: "client/src/lib/api/system.ts"
type: "code"
community: "App Shell & Bootstrap"
location: "L5"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/App_Shell__Bootstrap
---

# useHealthCheck()

## Connections
- [[AppShell.tsx]] - `imports` [EXTRACTED]
- [[OpsStatusStrip()]] - `calls` [EXTRACTED]
- [[apiGet()]] - `calls` [EXTRACTED]
- [[system.ts]] - `contains` [EXTRACTED]

## Source
**From** `client/src/lib/api/system.ts` **(starting line 5):**
```typescript
export function useHealthCheck() {
  return useQuery({
    queryKey: ["health"],
    queryFn: () => apiGet<{ ok: boolean }>("/health"),
    refetchInterval: 30000,
    retry: 1,
    staleTime: 15000,
  });
}
```

#graphify/code #graphify/EXTRACTED #community/App_Shell__Bootstrap