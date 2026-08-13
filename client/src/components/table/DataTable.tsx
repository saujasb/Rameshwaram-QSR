import type { ColumnConfig } from "../crud/types";

export function DataTable<T extends { id: string }>({
  columns,
  rows,
  onRowClick,
  emptyMessage,
}: {
  columns: ColumnConfig<T>[];
  rows: T[];
  onRowClick?: (record: T) => void;
  emptyMessage: string;
}) {
  if (rows.length === 0) {
    return <p style={{ color: "var(--muted)", fontSize: 13.5 }}>{emptyMessage}</p>;
  }
  return (
    <div className="table-scroll">
      <table>
        <thead>
          <tr>
            {columns.map((c) => (
              <th key={c.key} className={c.numeric ? "num" : undefined}>{c.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
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
  );
}
