---
source_file: "client/src/lib/createEntityHooks.ts"
type: "code"
community: "Maintenance & Suppliers UI"
location: "L28"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Maintenance__Suppliers_UI
---

# useUpdate()

## Connections
- [[apiPut()]] - `calls` [EXTRACTED]
- [[createEntityHooks()]] - `indirect_call` [INFERRED]

## Source
**From** `client/src/lib/createEntityHooks.ts` **(starting line 28):**
```typescript
  function useUpdate() {
    const qc = useQueryClient();
    return useMutation({
      mutationFn: ({ id, patch }: { id: string; patch: Partial<Omit<T, keyof BaseRecord>> }) =>
        apiPut<T>(`/${resource}/${id}`, patch),
      onSuccess: (_data, vars) => {
        qc.invalidateQueries({ queryKey: listKey });
        qc.invalidateQueries({ queryKey: [resource, vars.id] });
      },
    });
  }
```

#graphify/code #graphify/EXTRACTED #community/Maintenance__Suppliers_UI