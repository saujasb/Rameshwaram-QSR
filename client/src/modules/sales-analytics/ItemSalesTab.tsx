import { useMemo, useState } from "react";
import { DateRangeControl } from "../../components/DateRangeControl";
import { defaultDateRange, resolveBusinessDateRange, type DateRangeValue } from "../../lib/dateRange";
import { useProviderOrderItemSales } from "../../lib/api/providerOrders";
import { liveSourceFilter, type LiveSalesSource } from "./salesSource";

type SortDir = "asc" | "desc";

/**
 * Combined item-sales list, sourced from provider_orders.itemsJson (server-
 * side aggregated, see getProviderOrderItemSales) -- never add-ons/variants,
 * per the brief. One sortable list, never split into "highest"/"lowest"
 * sections; the sort direction just flips which end is on top.
 */
export function ItemSalesTab({ source }: { source: LiveSalesSource }) {
  const [dateRange, setDateRange] = useState<DateRangeValue>(defaultDateRange);
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [search, setSearch] = useState("");
  const range = useMemo(() => resolveBusinessDateRange(dateRange), [dateRange]);
  const sourceFilter = liveSourceFilter(source);

  const { data, isLoading, isError } = useProviderOrderItemSales({ ...sourceFilter, ...range });

  const rangeLabel =
    data?.businessDateFrom && data.businessDateFrom === data.businessDateTo
      ? data.businessDateFrom
      : data?.businessDateFrom
        ? `${data.businessDateFrom} – ${data.businessDateTo}`
        : "";

  const allItems = data?.items ?? [];
  const sortedItems = useMemo(() => {
    const items = data?.items ?? [];
    const query = search.trim().toLowerCase();
    const copy = query
      ? items.filter((item) => item.name.toLowerCase().includes(query))
      : [...items];
    copy.sort((a, b) => (sortDir === "asc" ? a.quantity - b.quantity : b.quantity - a.quantity));
    return copy;
  }, [data, search, sortDir]);

  return (
    <div>
      <div className="page-head">
        <div>
          <h2 style={{ fontSize: 15, margin: "0 0 4px", color: "var(--ink-2)" }}>Item Sales</h2>
          <p className="page-desc" style={{ margin: 0 }}>
            Every sold item across the selected source and date range, aggregated straight from provider_orders — one
            combined list, sorted by quantity.
          </p>
        </div>
      </div>

      <div className="filters-bar">
        <DateRangeControl value={dateRange} onChange={setDateRange} />
        <select value={sortDir} onChange={(e) => setSortDir(e.target.value as SortDir)}>
          <option value="desc">Quantity: highest → lowest</option>
          <option value="asc">Quantity: lowest → highest</option>
        </select>
        <input
          type="search"
          placeholder="Search item name…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Search item name"
          style={{ minWidth: 220 }}
        />
      </div>

      {isError ? (
        <p style={{ color: "var(--critical)", fontSize: 13.5 }}>Couldn't load item sales. Check the backend connection and retry.</p>
      ) : isLoading ? (
        <p style={{ color: "var(--muted)", fontSize: 13.5 }}>Loading…</p>
      ) : allItems.length === 0 ? (
        <div className="banner-not-connected">No items sold in this range yet.</div>
      ) : sortedItems.length === 0 ? (
        <div className="banner-not-connected">No items match "{search.trim()}" in this range.</div>
      ) : (
        <div className="card">
          <h3>Items sold</h3>
          <p className="h3sub">{rangeLabel}</p>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Category</th>
                  <th className="num">Qty sold</th>
                  <th className="num">Sales amount</th>
                </tr>
              </thead>
              <tbody>
                {sortedItems.map((item) => (
                  <tr key={item.name}>
                    <td>{item.name}</td>
                    <td>{item.category ?? <span style={{ color: "var(--muted)" }}>Uncategorized</span>}</td>
                    <td className="num">{item.quantity.toLocaleString()}</td>
                    <td className="num">₹{item.amount.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
