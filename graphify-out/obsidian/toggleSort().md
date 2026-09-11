---
source_file: "client/src/components/table/DataTable.tsx"
type: "code"
community: "Generic CRUD UI Components"
location: "L47"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Generic_CRUD_UI_Components
---

# toggleSort()

## Connections
- [[DataTable()]] - `contains` [EXTRACTED]

## Source
**From** `client/src/components/table/DataTable.tsx` **(starting line 47):**
```tsx
  function toggleSort(col: ColumnConfig<T>) {
    if (!col.sortable) return;
    setPage(0);
    setSort((prev) => {
      if (!prev || prev.key !== col.key) return { key: col.key, dir: "asc" };
      if (prev.dir === "asc") return { key: col.key, dir: "desc" };
      return null;
    });
  }
```

#graphify/code #graphify/EXTRACTED #community/Generic_CRUD_UI_Components