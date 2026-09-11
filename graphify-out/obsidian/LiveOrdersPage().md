---
source_file: "client/src/modules/live-orders/LiveOrdersPage.tsx"
type: "code"
community: "Provider Order Integration (Petpooja/GoSelfServe)"
location: "L86"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Provider_Order_Integration_Petpooja/GoSelfServe
---

# LiveOrdersPage()

## Connections
- [[LiveOrdersPage.tsx]] - `contains` [EXTRACTED]
- [[routes.tsx]] - `imports` [EXTRACTED]
- [[useProviderOrders()]] - `calls` [EXTRACTED]

## Source
**From** `client/src/modules/live-orders/LiveOrdersPage.tsx` **(starting line 86):**
```tsx
export function LiveOrdersPage() {
  const [status, setStatus] = useState<ProviderOrderFilter["status"] | "">("");
  const [orderType, setOrderType] = useState<ProviderOrderFilter["orderType"] | "">("");
  const [orderFrom, setOrderFrom] = useState<ProviderOrderFilter["orderFrom"] | "">("");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<ProviderOrder | null>(null);

  const filter: ProviderOrderFilter = useMemo(
    () => ({
      status: status || undefined,
      orderType: orderType || undefined,
      orderFrom: orderFrom || undefined,
      search: search.trim() || undefined,
    }),
    [status, orderType, orderFrom, search]
  );

  const { data, isLoading, isError } = useProviderOrders(filter);

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Live Orders</h1>
          <p className="page-desc">
            Real-time orders pushed from Petpooja POS on bill print — dine-in, pickup, delivery, and aggregators
            (Zomato / Swiggy) all land here as they happen.
          </p>
        </div>
        <span className="freshness good">
          <span className="status-dot good" /> Live · auto-refreshing every 15s
        </span>
      </div>

      <div className="filters-bar">
        <select value={status} onChange={(e) => setStatus(e.target.value as typeof status)}>
          {STATUS_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        <select value={orderType} onChange={(e) => setOrderType(e.target.value as typeof orderType)}>
          {TYPE_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        <select value={orderFrom} onChange={(e) => setOrderFrom(e.target.value as typeof orderFrom)}>
          {SOURCE_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        <input placeholder="Search order #, customer…" value={search} onChange={(e) => setSearch(e.target.value)} style={{ minWidth: 220 }} />
      </div>

      <div className="card">
        {isError ? (
          <p style={{ color: "var(--critical)", fontSize: 13.5 }}>Couldn't load live orders. Check the backend connection and retry.</p>
        ) : isLoading ? (
          <p style={{ color: "var(--muted)", fontSize: 13.5 }}>Loading…</p>
        ) : (
          <DataTable
            columns={columns}
            rows={data ?? []}
            onRowClick={(r) => setSelected(r)}
            emptyMessage="No orders yet. They'll appear here the moment a bill prints on Petpooja."
          />
        )}
      </div>

      {selected && <ProviderOrderDetailModal order={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
```

#graphify/code #graphify/EXTRACTED #community/Provider_Order_Integration_Petpooja/GoSelfServe