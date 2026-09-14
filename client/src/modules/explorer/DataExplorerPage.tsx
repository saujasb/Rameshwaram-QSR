import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import type { DatasetFilter, DatasetRecord, DatasetType } from "@shared/datasets";
import { DATASET_LABELS, RECORD_FLAG_LABELS } from "@shared/datasets";
import { formatHourBucket } from "@shared/businessDate";
import { Modal } from "../../components/Modal";
import { exportCsvUrl, useDatasetFacets, useDatasetRecords } from "../../lib/api/datasets";

const PAGE_SIZE = 50;
const DATASET_OPTIONS: DatasetType[] = ["sales", "production", "wastage"];

function sourceLabel(r: DatasetRecord): string {
  const parts: string[] = [];
  if (r.sourceSheet) parts.push(`Sheet: ${r.sourceSheet}`);
  if (r.sourcePage != null) parts.push(`Page: ${r.sourcePage}`);
  if (r.sourceRow != null) parts.push(`Row: ${r.sourceRow}`);
  return parts.join(" · ");
}

export function DataExplorerPage() {
  const [params, setParams] = useSearchParams();

  // URL is the source of truth so anomaly / insight / Ramesh drill-downs land
  // here pre-filtered, and the filtered view stays shareable.
  const filter: DatasetFilter = useMemo(() => {
    const g = (k: string) => params.get(k) ?? undefined;
    const dt = g("datasetType");
    return {
      from: g("from"),
      to: g("to"),
      datasetType: DATASET_OPTIONS.includes(dt as DatasetType) ? (dt as DatasetType) : undefined,
      product: g("product"),
      outlet: g("outlet"),
      shift: g("shift"),
      search: g("search"),
      page: Number(g("page")) || 1,
      pageSize: PAGE_SIZE,
    };
  }, [params]);

  const [searchDraft, setSearchDraft] = useState(filter.search ?? "");
  const [focused, setFocused] = useState<DatasetRecord | null>(null);

  // Debounce typing so each keystroke doesn't hit the API.
  useEffect(() => {
    const id = setTimeout(() => {
      if ((filter.search ?? "") !== searchDraft) update({ search: searchDraft || undefined, page: 1 });
    }, 300);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchDraft]);

  const { data, isLoading } = useDatasetRecords(filter);
  const { data: facets } = useDatasetFacets();

  function update(patch: Partial<Record<string, string | number | undefined>>) {
    const next = new URLSearchParams(params);
    for (const [k, v] of Object.entries(patch)) {
      if (v === undefined || v === "" || v === null) next.delete(k);
      else next.set(k, String(v));
    }
    if (!("page" in patch)) next.set("page", "1");
    setParams(next, { replace: true });
  }

  const rows = data?.data ?? [];
  const pg = data?.pagination;

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Data Explorer</h1>
          <p className="page-desc">
            Every imported record, with the file, sheet/page and row it came from — so any number on this dashboard can
            be traced back to its source. Filters here drive the table and the CSV export.
          </p>
        </div>
      </div>

      <div className="filters-bar">
        <select
          value={filter.datasetType ?? ""}
          onChange={(e) => update({ datasetType: e.target.value || undefined })}
          aria-label="Dataset"
        >
          <option value="">All datasets</option>
          {DATASET_OPTIONS.map((d) => (
            <option key={d} value={d}>{DATASET_LABELS[d]}</option>
          ))}
        </select>
        <input type="date" value={filter.from ?? ""} onChange={(e) => update({ from: e.target.value || undefined })} aria-label="Business date from" />
        <input type="date" value={filter.to ?? ""} onChange={(e) => update({ to: e.target.value || undefined })} aria-label="Business date to" />
        <select value={filter.product ?? ""} onChange={(e) => update({ product: e.target.value || undefined })} aria-label="Product">
          <option value="">All products</option>
          {(facets?.products ?? []).map((p) => <option key={p} value={p}>{p}</option>)}
        </select>
        {(facets?.outlets?.length ?? 0) > 0 && (
          <select value={filter.outlet ?? ""} onChange={(e) => update({ outlet: e.target.value || undefined })} aria-label="Outlet">
            <option value="">All outlets</option>
            {facets!.outlets.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
        )}
        {(facets?.shifts?.length ?? 0) > 0 && (
          <select value={filter.shift ?? ""} onChange={(e) => update({ shift: e.target.value || undefined })} aria-label="Shift">
            <option value="">All shifts</option>
            {facets!.shifts.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        )}
        <input
          type="search"
          placeholder="Search product, category, file…"
          value={searchDraft}
          onChange={(e) => setSearchDraft(e.target.value)}
          style={{ minWidth: 200 }}
          aria-label="Search records"
        />
        <button className="btn small" onClick={() => { setSearchDraft(""); setParams(new URLSearchParams(), { replace: true }); }}>
          Clear filters
        </button>
        <a className="btn small" href={exportCsvUrl({ ...filter, page: undefined, pageSize: undefined })}>Export CSV</a>
      </div>

      <div className="card">
        {isLoading && <p style={{ color: "var(--muted)" }}>Loading records…</p>}

        {!isLoading && rows.length === 0 && (
          <div className="empty-state">
            <img className="kolam-mark" src="/branding/emblem.png" alt="" aria-hidden />
            <p style={{ color: "var(--muted)", fontSize: 13.5, margin: 0 }}>
              No records match these filters. If nothing has been imported yet, start from Data Import.
            </p>
          </div>
        )}

        {rows.length > 0 && (
          <>
            <div className="table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>Business date</th><th>Txn date</th><th>Timestamp</th><th>Hour</th><th>Shift</th>
                    <th>Dataset</th><th>Product</th><th>Category</th>
                    <th className="num">Qty</th><th className="num">Value</th>
                    <th>Reason</th><th>Outlet</th><th>Source</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r.id} className="clickable" onClick={() => setFocused(r)}>
                      <td>{r.businessDate}</td>
                      <td>{r.transactionDate ?? "—"}</td>
                      <td title={r.rawTimestamp ? undefined : "This source carried no per-transaction clock time"}>
                        {r.rawTimestamp ? r.rawTimestamp.replace("T", " ") : "—"}
                      </td>
                      <td>{r.hour != null ? formatHourBucket(r.hour) : "—"}</td>
                      <td>{r.shift ?? "—"}</td>
                      <td>{DATASET_LABELS[r.datasetType]}</td>
                      <td><b>{r.product}</b></td>
                      <td>{r.category ?? "—"}</td>
                      <td className="num">{r.quantity.toLocaleString()}</td>
                      <td className="num">{r.salesValue != null ? `₹${r.salesValue.toLocaleString()}` : "—"}</td>
                      <td>{r.reason ?? "—"}</td>
                      <td>{r.outlet ?? "—"}</td>
                      <td style={{ fontSize: 11.5, color: "var(--ink-2)" }}>
                        {r.sourceFile}
                        {sourceLabel(r) && <><br />{sourceLabel(r)}</>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {pg && (
              <div className="table-footer">
                <span>
                  Showing {(pg.page - 1) * pg.pageSize + 1}–{Math.min(pg.totalItems, pg.page * pg.pageSize)} of{" "}
                  {pg.totalItems.toLocaleString()}
                </span>
                <div className="pager">
                  <button disabled={pg.page <= 1} onClick={() => update({ page: pg.page - 1 })}>← Prev</button>
                  <button disabled={pg.page >= pg.totalPages} onClick={() => update({ page: pg.page + 1 })}>Next →</button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {focused && (
        <Modal title={`${focused.product} — ${DATASET_LABELS[focused.datasetType]}`} onClose={() => setFocused(null)}>
          <table>
            <tbody>
              <tr><td>Business date</td><td className="num"><b>{focused.businessDate}</b></td></tr>
              <tr><td>Business day start hour used</td><td className="num">{String(focused.businessDayStartHour).padStart(2, "0")}:00</td></tr>
              <tr><td>Transaction date (as in source)</td><td className="num">{focused.transactionDate ?? "—"}</td></tr>
              <tr><td>Raw timestamp (never modified)</td><td className="num">{focused.rawTimestamp?.replace("T", " ") ?? "not present in source"}</td></tr>
              <tr><td>Hour bucket</td><td className="num">{focused.hour != null ? formatHourBucket(focused.hour) : "—"}</td></tr>
              <tr><td>Shift</td><td className="num">{focused.shift ?? "—"}</td></tr>
              <tr><td>Category</td><td className="num">{focused.category ?? "—"}</td></tr>
              <tr><td>Outlet</td><td className="num">{focused.outlet ?? "—"}</td></tr>
              <tr><td>Channel</td><td className="num">{focused.channel ?? "—"}</td></tr>
              <tr><td>Quantity</td><td className="num"><b>{focused.quantity.toLocaleString()}</b></td></tr>
              <tr><td>Value</td><td className="num">{focused.salesValue != null ? `₹${focused.salesValue.toLocaleString()}` : "—"}</td></tr>
              <tr><td>Reason</td><td className="num">{focused.reason ?? "—"}</td></tr>
              <tr><td>Source file</td><td className="num">{focused.sourceFile} ({focused.sourceType})</td></tr>
              <tr><td>Source location</td><td className="num">{sourceLabel(focused) || "—"}</td></tr>
              <tr><td>Imported at</td><td className="num">{new Date(focused.createdAt).toLocaleString("en-IN")}</td></tr>
            </tbody>
          </table>
          {focused.flags.length > 0 && (
            <div style={{ marginTop: 14 }}>
              <div className="ramesh-section-label" style={{ marginBottom: 4 }}>Validation flags</div>
              <ul style={{ paddingLeft: 18, fontSize: 12.5, color: "var(--ink-2)", margin: 0 }}>
                {focused.flags.map((f) => <li key={f}>{RECORD_FLAG_LABELS[f] ?? f}</li>)}
              </ul>
            </div>
          )}
        </Modal>
      )}
    </div>
  );
}
