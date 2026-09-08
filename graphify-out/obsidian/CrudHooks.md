---
source_file: "client/src/components/crud/CrudModulePage.tsx"
type: "code"
community: "Generic CRUD UI Components"
location: "L10"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Generic_CRUD_UI_Components
---

# CrudHooks

## Connections
- [[BaseRecord]] - `references` [EXTRACTED]
- [[CrudModulePage.tsx]] - `contains` [EXTRACTED]

## Source
**From** `client/src/components/crud/CrudModulePage.tsx` **(starting line 10):**
```tsx
interface CrudHooks<T extends BaseRecord> {
  useList: () => { data?: T[]; isLoading: boolean; error: unknown };
  useCreate: () => { mutate: (data: Omit<T, keyof BaseRecord>, opts?: { onSuccess?: () => void }) => void; isPending: boolean };
  useUpdate: () => { mutate: (vars: { id: string; patch: Partial<Omit<T, keyof BaseRecord>> }, opts?: { onSuccess?: () => void }) => void; isPending: boolean };
  useRemove: () => { mutate: (id: string) => void };
}
```

#graphify/code #graphify/EXTRACTED #community/Generic_CRUD_UI_Components