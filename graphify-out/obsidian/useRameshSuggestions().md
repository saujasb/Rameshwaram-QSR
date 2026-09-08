---
source_file: "client/src/lib/api/ramesh.ts"
type: "code"
community: "Ramesh Chat Widget"
location: "L12"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Ramesh_Chat_Widget
---

# useRameshSuggestions()

## Connections
- [[RameshWidget()]] - `calls` [EXTRACTED]
- [[RameshWidget.tsx]] - `imports` [EXTRACTED]
- [[apiramesh.ts]] - `contains` [EXTRACTED]
- [[apiGet()]] - `calls` [EXTRACTED]

## Source
**From** `client/src/lib/api/ramesh.ts` **(starting line 12):**
```typescript
export function useRameshSuggestions() {
  return useQuery({
    queryKey: ["ramesh-suggestions"],
    queryFn: () => apiGet<{ suggestions: string[]; hasData: boolean }>("/ramesh/suggestions"),
  });
}
```

#graphify/code #graphify/EXTRACTED #community/Ramesh_Chat_Widget