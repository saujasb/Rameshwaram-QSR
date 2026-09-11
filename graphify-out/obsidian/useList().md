---
source_file: "client/src/lib/createEntityHooks.ts"
type: "code"
community: "Maintenance & Suppliers UI"
location: "L8"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Maintenance__Suppliers_UI
---

# useList()

## Connections
- [[apiGet()]] - `calls` [EXTRACTED]
- [[createEntityHooks()]] - `indirect_call` [INFERRED]

## Source
**From** `client/src/lib/createEntityHooks.ts` **(starting line 8):**
```typescript
  function useList() {
    return useQuery({ queryKey: listKey, queryFn: () => apiGet<T[]>(`/${resource}`) });
  }
```

#graphify/code #graphify/EXTRACTED #community/Maintenance__Suppliers_UI