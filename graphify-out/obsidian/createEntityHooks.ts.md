---
source_file: "client/src/lib/createEntityHooks.ts"
type: "code"
community: "Maintenance & Suppliers UI"
location: "L1"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Maintenance__Suppliers_UI
---

# createEntityHooks.ts

## Connections
- [[BaseRecord]] - `imports` [EXTRACTED]
- [[apiclient.ts]] - `imports_from` [EXTRACTED]
- [[apiDelete()]] - `imports` [EXTRACTED]
- [[apiGet()]] - `imports` [EXTRACTED]
- [[apiPost()]] - `imports` [EXTRACTED]
- [[apiPut()]] - `imports` [EXTRACTED]
- [[complaints.ts]] - `imports_from` [EXTRACTED]
- [[createEntityHooks()]] - `contains` [EXTRACTED]
- [[entities.ts]] - `imports_from` [EXTRACTED]
- [[expenses.ts]] - `imports_from` [EXTRACTED]
- [[inventory.ts]] - `imports_from` [EXTRACTED]
- [[maintenance.ts]] - `imports_from` [EXTRACTED]
- [[orders.ts]] - `imports_from` [EXTRACTED]
- [[purchases.ts]] - `imports_from` [EXTRACTED]
- [[staff.ts]] - `imports_from` [EXTRACTED]
- [[suppliers.ts]] - `imports_from` [EXTRACTED]
- [[tasks.ts]] - `imports_from` [EXTRACTED]
- [[wastage.ts]] - `imports_from` [EXTRACTED]

## Source
**Full file:** `client/src/lib/createEntityHooks.ts`
```typescript
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiDelete, apiGet, apiPost, apiPut } from "./api/client";
import type { BaseRecord } from "@shared/entities";

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