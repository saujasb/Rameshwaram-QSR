---
source_file: "client/src/lib/createEntityHooks.ts"
type: "code"
community: "Maintenance & Suppliers UI"
location: "L5"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Maintenance__Suppliers_UI
---

# createEntityHooks()

## Connections
- [[complaints.ts]] - `imports` [EXTRACTED]
- [[createEntityHooks.ts]] - `contains` [EXTRACTED]
- [[expenses.ts]] - `imports` [EXTRACTED]
- [[inventory.ts]] - `imports` [EXTRACTED]
- [[maintenance.ts]] - `imports` [EXTRACTED]
- [[orders.ts]] - `imports` [EXTRACTED]
- [[purchases.ts]] - `imports` [EXTRACTED]
- [[staff.ts]] - `imports` [EXTRACTED]
- [[suppliers.ts]] - `imports` [EXTRACTED]
- [[tasks.ts]] - `imports` [EXTRACTED]
- [[useAction()]] - `indirect_call` [INFERRED]
- [[useCreate()]] - `indirect_call` [INFERRED]
- [[useList()]] - `indirect_call` [INFERRED]
- [[useOne()]] - `indirect_call` [INFERRED]
- [[useRemove()]] - `indirect_call` [INFERRED]
- [[useUpdate()]] - `indirect_call` [INFERRED]
- [[wastage.ts]] - `imports` [EXTRACTED]

## Source
**From** `client/src/lib/createEntityHooks.ts` **(starting line 5):**
```typescript
export function createEntityHooks<T extends BaseRecord>(resource: string) {
  const listKey = [resource] as const;

  function useList() {
    return useQuery({ queryKey: listKey, queryFn: () => apiGet<T[]>(`/${resource}`) });
  }

  function useOne(id: string | undefined) {
    return useQuery({
      queryKey: [resource, id],
      queryFn: () => apiGet<T>(`/${resource}/${id}`),
      enabled: Boolean(id),
    });
  }

  function useCreate() {
    const qc = useQueryClient();
    return useMutation({
      mutationFn: (data: Omit<T, keyof BaseRecord>) => apiPost<T>(`/${resource}`, data),
      onSuccess: () => qc.invalidateQueries({ queryKey: listKey }),
    });
  }

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

  function useRemove() {
    const qc = useQueryClient();
    return useMutation({
      mutationFn: (id: string) => apiDelete(`/${resource}/${id}`),
      onSuccess: () => qc.invalidateQueries({ queryKey: listKey }),
    });
  }

  function useAction<R = T>(action: string) {
    const qc = useQueryClient();
    return useMutation({
      mutationFn: ({ id, body }: { id: string; body?: unknown }) =>
        apiPost<R>(`/${resource}/${id}/${action}`, body),
      onSuccess: () => qc.invalidateQueries({ queryKey: listKey }),
    });
  }

  return { listKey, useList, useOne, useCreate, useUpdate, useRemove, useAction };
}
```

#graphify/code #graphify/EXTRACTED #community/Maintenance__Suppliers_UI