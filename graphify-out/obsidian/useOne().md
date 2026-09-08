---
source_file: "client/src/lib/createEntityHooks.ts"
type: "code"
community: "Maintenance & Suppliers UI"
location: "L12"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Maintenance__Suppliers_UI
---

# useOne()

## Connections
- [[apiGet()]] - `calls` [EXTRACTED]
- [[createEntityHooks()]] - `indirect_call` [INFERRED]

## Source
**From** `client/src/lib/createEntityHooks.ts` **(starting line 12):**
```typescript
  function useOne(id: string | undefined) {
    return useQuery({
      queryKey: [resource, id],
      queryFn: () => apiGet<T>(`/${resource}/${id}`),
      enabled: Boolean(id),
    });
  }
```

#graphify/code #graphify/EXTRACTED #community/Maintenance__Suppliers_UI