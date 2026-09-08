---
source_file: "client/src/components/table/DataTable.tsx"
type: "code"
community: "Generic CRUD UI Components"
location: "L6"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Generic_CRUD_UI_Components
---

# defaultSortValue()

## Connections
- [[DataTable()]] - `calls` [EXTRACTED]
- [[DataTable.tsx]] - `contains` [EXTRACTED]

## Source
**From** `client/src/components/table/DataTable.tsx` **(starting line 6):**
```tsx
function defaultSortValue<T>(row: T, key: string): string | number {
  const v = (row as Record<string, unknown>)[key];
  if (v == null) return "";
  if (typeof v === "number") return v;
  return String(v).toLowerCase();
}
```

#graphify/code #graphify/EXTRACTED #community/Generic_CRUD_UI_Components