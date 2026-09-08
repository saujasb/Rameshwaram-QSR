---
source_file: "shared-types/entities.ts"
type: "code"
community: "Maintenance & Suppliers UI"
location: "L94"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Maintenance__Suppliers_UI
---

# Supplier

## Connections
- [[BaseRecord]] - `inherits` [EXTRACTED]
- [[SuppliersPage.tsx]] - `imports` [EXTRACTED]
- [[entities.ts]] - `contains` [EXTRACTED]
- [[suppliers.ts]] - `imports` [EXTRACTED]
- [[suppliersrepository.ts]] - `imports` [EXTRACTED]

## Source
**From** `shared-types/entities.ts` **(starting line 94):**
```typescript
export interface Supplier extends BaseRecord {
  name: string;
  contactPhone: string;
  contactEmail: string;
  notes: string;
}
```

#graphify/code #graphify/EXTRACTED #community/Maintenance__Suppliers_UI