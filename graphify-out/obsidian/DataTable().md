---
source_file: "client/src/components/table/DataTable.tsx"
type: "code"
community: "Generic CRUD UI Components"
location: "L13"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Generic_CRUD_UI_Components
---

# DataTable()

## Connections
- [[CrudModulePage.tsx]] - `imports` [EXTRACTED]
- [[DataTable.tsx]] - `contains` [EXTRACTED]
- [[InventoryPage.tsx]] - `imports` [EXTRACTED]
- [[LiveOrdersPage.tsx]] - `imports` [EXTRACTED]
- [[TasksPage.tsx]] - `imports` [EXTRACTED]
- [[defaultSortValue()]] - `calls` [EXTRACTED]
- [[toggleSort()]] - `contains` [EXTRACTED]

## Source
**From** `client/src/components/table/DataTable.tsx` **(starting line 13):**
```tsx
export function DataTable<T extends { id: string }>({
  columns,
  rows,
  onRowClick,
  emptyMessage,
  paginate = true,
}: {
  columns: ColumnConfig<T>[];
  rows: T[];
  onRowClick?: (record: T) => void;
  emptyMessage: string;
  paginate?: boolean;
}) {
  const [sort, setSort] = useState<{ key: string; dir: "asc" | "desc" } | null>(null);
  const [page, setPage] = useState(0);

  const sorted = useMemo(() => {
    if (!sort) return rows;
    const col = columns.find((c) => c.key === sort.key);
    const getValue = (r: T) => (col?.sortValue ? col.sortValue(r) ?? "" : defaultSortValue(r, sort.key));
    const copy = [...rows];
    copy.sort((a, b) => {
      const av = getValue(a);
      const bv = getValue(b);
      const cmp = av < bv ? -1 : av > bv ? 1 : 0;
      return sort.dir === "asc" ? cmp : -cmp;
    });
    return copy;
  }, [rows, sort, columns]);

  const pageCount = paginate ? Math.max(1, Math.ceil(sorted.length / PAGE_SIZE)) : 1;
  const currentPage = Math.min(page, pageCount - 1);
  const pageRows = paginate ? sorted.slice(currentPage * PAGE_SIZE, currentPage * PAGE_SIZE + PAGE_SIZE) : sorted;

  function toggleSort(col: ColumnConfig<T>) {
    if (!col.sortable) return;
    setPage(0);
    setSort((prev) => {
      if (!prev || prev.key !== col.key) return { key: col.key, dir: "asc" };
      if (prev.dir === "asc") return { key: col.key, dir: "desc" };
      return null;
    });
  }

  if (rows.length === 0) {
    return (
      <div className="empty-state">
        <img className="kolam-mark" src="/branding/emblem.png" alt="" aria-hidden />
        <p style={{ color: "var(--muted)", fontSize: 13.5, margin: 0 }}>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              {columns.map((c) => {
                const isSorted = sort?.key === c.key;
                return (
                  <th
                    key={c.key}
                    className={[c.numeric ? "num" : "", c.sortable ? "sortable" : "", isSorted ? "sorted" : ""].filter(Boolean).join(" ")}
                    onClick={() => toggleSort(c)}
                  >
                    {c.label}
                    {c.sortable && <span className="sort-arrow">{isSorted ? (sort!.dir === "asc" ? "▲" : "▼") : "⇕"}</span>}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {pageRows.map((row) => (
              <tr key={row.id} className={onRowClick ? "clickable" : undefined} onClick={() => onRowClick?.(row)}>
                {columns.map((c) => (
                  <td key={c.key} className={c.numeric ? "num" : undefined}>
                    {c.render ? c.render(row) : String((row as Record<string, unknown>)[c.key] ?? "—")}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {paginate && sorted.length > PAGE_SIZE && (
        <div className="table-footer">
          <span>
            {currentPage * PAGE_SIZE + 1}–{Math.min(sorted.length, (currentPage + 1) * PAGE_SIZE)} of {sorted.length}
          </span>
          <div className="pager">
            <button disabled={currentPage === 0} onClick={() => setPage(currentPage - 1)}>← Prev</button>
            <button disabled={currentPage >= pageCount - 1} onClick={() => setPage(currentPage + 1)}>Next →</button>
          </div>
        </div>
      )}
    </div>
  );
}
```

#graphify/code #graphify/EXTRACTED #community/Generic_CRUD_UI_Components