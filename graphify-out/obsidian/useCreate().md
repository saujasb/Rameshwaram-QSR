---
source_file: "client/src/lib/createEntityHooks.ts"
type: "code"
community: "Maintenance & Suppliers UI"
location: "L20"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Maintenance__Suppliers_UI
---

# useCreate()

## Connections
- [[apiPost()]] - `calls` [EXTRACTED]
- [[createEntityHooks()]] - `indirect_call` [INFERRED]

## Source
**From** `client/src/lib/createEntityHooks.ts` **(starting line 20):**
```typescript
  function useCreate() {
    const qc = useQueryClient();
    return useMutation({
      mutationFn: (data: Omit<T, keyof BaseRecord>) => apiPost<T>(`/${resource}`, data),
      onSuccess: () => qc.invalidateQueries({ queryKey: listKey }),
    });
  }
```

#graphify/code #graphify/EXTRACTED #community/Maintenance__Suppliers_UI