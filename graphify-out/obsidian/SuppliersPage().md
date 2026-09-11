---
source_file: "client/src/modules/purchases/SuppliersPage.tsx"
type: "code"
community: "Maintenance & Suppliers UI"
location: "L20"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Maintenance__Suppliers_UI
---

# SuppliersPage()

## Connections
- [[SuppliersPage.tsx]] - `contains` [EXTRACTED]
- [[routes.tsx]] - `imports` [EXTRACTED]

## Source
**From** `client/src/modules/purchases/SuppliersPage.tsx` **(starting line 20):**
```tsx
export function SuppliersPage() {
  return (
    <CrudModulePage<Supplier>
      title="Suppliers"
      description="Your supplier directory. Referenced from Purchases."
      hooks={supplierHooks}
      columns={columns}
      formFields={formFields}
      defaultValues={{ name: "", contactPhone: "", contactEmail: "", notes: "" }}
      emptyMessage="No suppliers added yet."
      addButtonLabel="Add supplier"
    />
  );
}
```

#graphify/code #graphify/EXTRACTED #community/Maintenance__Suppliers_UI