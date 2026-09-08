---
source_file: "client/src/lib/createEntityHooks.ts"
type: "code"
community: "Maintenance & Suppliers UI"
location: "L40"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Maintenance__Suppliers_UI
---

# useRemove()

## Connections
- [[apiDelete()]] - `calls` [EXTRACTED]
- [[createEntityHooks()]] - `indirect_call` [INFERRED]

## Source
**From** `client/src/lib/createEntityHooks.ts` **(starting line 40):**
```typescript
  function useRemove() {
    const qc = useQueryClient();
    return useMutation({
      mutationFn: (id: string) => apiDelete(`/${resource}/${id}`),
      onSuccess: () => qc.invalidateQueries({ queryKey: listKey }),
    });
  }
```

#graphify/code #graphify/EXTRACTED #community/Maintenance__Suppliers_UI