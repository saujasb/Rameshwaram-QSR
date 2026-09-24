/**
 * Standard page-size behavior for large provider_orders lists:
 * 20 / 50 / 100 rows per page, and "All" = no artificial cap on the total
 * result set, still paged 100 at a time (the server's own per-page maximum,
 * MAX_PROVIDER_ORDERS_PAGE_SIZE) -- never an unbounded load into the browser.
 */
export type PageSizeOption = "20" | "50" | "100" | "all";

export const MAX_PAGE_SIZE = 100;

export const PAGE_SIZE_OPTIONS: { value: PageSizeOption; label: string }[] = [
  { value: "20", label: "Show: 20" },
  { value: "50", label: "Show: 50" },
  { value: "100", label: "Show: 100" },
  { value: "all", label: "Show: All" },
];

/** Rows per page to request for a page-size option ("all" -> 100). */
export function pageSizeFor(option: PageSizeOption): number {
  return option === "all" ? MAX_PAGE_SIZE : Number(option);
}

export function PageSizeSelect({ value, onChange }: { value: PageSizeOption; onChange: (next: PageSizeOption) => void }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value as PageSizeOption)} aria-label="Rows per page">
      {PAGE_SIZE_OPTIONS.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  );
}

/** First, last, current ± 2 neighbors, with "…" gaps -- e.g. 1 … 4 5 [6] 7 8 … 45 */
function pageNumbers(current: number, count: number): (number | "…")[] {
  if (count <= 1) return [1];
  const pages: (number | "…")[] = [1];
  const low = Math.max(2, current - 2);
  const high = Math.min(count - 1, current + 2);
  if (low > 2) pages.push("…");
  for (let p = low; p <= high; p++) pages.push(p);
  if (high < count - 1) pages.push("…");
  pages.push(count);
  return pages;
}

/**
 * "Showing X–Y of Z" plus the pager. `rowsOnPage` is the number of rows the
 * server actually returned for this page, so the range text stays correct on
 * a short last page.
 */
export function PaginationFooter({
  page,
  pageSize,
  total,
  rowsOnPage,
  onPageChange,
}: {
  page: number;
  pageSize: number;
  total: number;
  rowsOnPage: number;
  onPageChange: (page: number) => void;
}) {
  if (total <= 0) return null;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const rangeStart = (page - 1) * pageSize + 1;
  const rangeEnd = Math.min(total, rangeStart + Math.max(rowsOnPage, 1) - 1);

  return (
    <div className="table-footer">
      <span>
        Showing {rangeStart.toLocaleString()}–{rangeEnd.toLocaleString()} of {total.toLocaleString()}
      </span>
      {pageCount > 1 && (
        <div className="pager">
          <button disabled={page === 1} onClick={() => onPageChange(1)}>« First</button>
          <button disabled={page === 1} onClick={() => onPageChange(page - 1)}>← Prev</button>
          {pageNumbers(page, pageCount).map((p, i) =>
            p === "…" ? (
              <span key={`ellipsis-${i}`} className="pager-ellipsis">…</span>
            ) : (
              <button key={p} className={p === page ? "current" : undefined} onClick={() => onPageChange(p)}>
                {p}
              </button>
            )
          )}
          <button disabled={page >= pageCount} onClick={() => onPageChange(page + 1)}>Next →</button>
          <button disabled={page >= pageCount} onClick={() => onPageChange(pageCount)}>Last »</button>
        </div>
      )}
    </div>
  );
}
