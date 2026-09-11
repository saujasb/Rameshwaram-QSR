---
source_file: "client/src/lib/createEntityHooks.ts"
type: "code"
community: "Maintenance & Suppliers UI"
location: "L48"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Maintenance__Suppliers_UI
---

# useAction()

## Connections
- [[apiPost()]] - `calls` [EXTRACTED]
- [[createEntityHooks()]] - `indirect_call` [INFERRED]

## Source
**From** `client/src/lib/createEntityHooks.ts` **(starting line 48):**
```typescript
  function useAction<R = T>(action: string) {
    const qc = useQueryClient();
    return useMutation({
      mutationFn: ({ id, body }: { id: string; body?: unknown }) =>
        apiPost<R>(`/${resource}/${id}/${action}`, body),
      onSuccess: () => qc.invalidateQueries({ queryKey: listKey }),
    });
  }
```

#graphify/code #graphify/EXTRACTED #community/Maintenance__Suppliers_UI