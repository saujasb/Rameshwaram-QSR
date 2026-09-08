---
source_file: "client/src/lib/api/ramesh.ts"
type: "code"
community: "Ramesh Chat Widget"
location: "L5"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Ramesh_Chat_Widget
---

# useAskRamesh()

## Connections
- [[RameshWidget()]] - `calls` [EXTRACTED]
- [[RameshWidget.tsx]] - `imports` [EXTRACTED]
- [[apiramesh.ts]] - `contains` [EXTRACTED]
- [[apiPost()]] - `calls` [EXTRACTED]

## Source
**From** `client/src/lib/api/ramesh.ts` **(starting line 5):**
```typescript
export function useAskRamesh() {
  return useMutation({
    mutationFn: (query: RameshQuery) => apiPost<RameshAnswer>("/ramesh/ask", query),
  });
}
```

#graphify/code #graphify/EXTRACTED #community/Ramesh_Chat_Widget