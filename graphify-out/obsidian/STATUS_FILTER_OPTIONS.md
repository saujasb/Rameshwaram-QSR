---
source_file: "client/src/modules/inventory/InventoryPage.tsx"
type: "code"
community: "Inventory Management UI"
location: "L15"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Inventory_Management_UI
---

# STATUS_FILTER_OPTIONS

## Connections
- [[InventoryPage.tsx]] - `contains` [EXTRACTED]

## Source
**From** `client/src/modules/inventory/InventoryPage.tsx` **(starting line 15):**
```tsx
const STATUS_FILTER_OPTIONS: InventoryStatus[] = ["not_counted", "healthy", "low", "critical", "out_of_stock"];

export function InventoryPage() {
  const { data, isLoading } = inventoryHooks.useList();
  const { data: suppliers } = supplierHooks.useList();
  const create = inventoryHooks.useCreate();
  const [showAdd, setShowAdd] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [statusFilter, setStatusFilter] = useState(searchParams.get("status") ?? "");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [search, setSearch] = useState("");

  const selected = data?.find((i) => i.id === selectedId) ?? null;
  const supplierName = (id: string | null) => suppliers?.find((s) => s.id === id)?.name ?? "—";

  useEffect(() => {
    const focusId = searchParams.get("focus");
    if (focusId && data) {
      if (data.find((r) => r.id === focusId)) setSelectedId(focusId);
      setSearchParams((prev) => {
        prev.delete("focus");
        return prev;
      });
    }
  }, [searchParams, data]);

  const categories = useMemo(() => Array.from(new Set((data ?? []).map((i) => i.category))), [data]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return (data ?? []).filter((i) => {
      const status = computeInventoryStatus(i);
      return (
        (!statusFilter || status === statusFilter) &&
        (!categoryFilter || i.category === categoryFilter) &&
        (!q || i.name.toLowerCase().includes(q) || i.category.toLowerCase().includes(q))
      );
    });
  }, [data, statusFilter, categoryFilter, search]);

  const statusCounts = useMemo(() => {
    const counts: Record<InventoryStatus, number> = { not_counted: 0, healthy: 0, low: 0, critical: 0, out_of_stock: 0 };
    for (const item of data ?? []) counts[computeInventoryStatus(item)]++;
    return counts;
  }, [data]);

  const columns: ColumnConfig<InventoryItem>[] = [
    { key: "name", label: "Item", sortable: true },
    { key: "category", label: "Category", sortable: true },
    {
      key: "onHandQty",
      label: "On hand",
      numeric: true,
      sortable: true,
      sortValue: (r) => r.onHandQty ?? -1,
      render: (r) => (r.onHandQty != null ? `${r.onHandQty} ${r.unit}` : "—"),
    },
    { key: "reorderLevel", label: "Reorder at", numeric: true, render: (r) => (r.reorderLevel != null ? `${r.reorderLevel} ${r.unit}` : "—") },
    { key: "supplierId", label: "Supplier", render: (r) => supplierName(r.supplierId) },
    {
      key: "status",
      label: "Status",
      sortable: true,
      sortValue: (r) => computeInventoryStatus(r),
      render: (r) => {
        const status = computeInventoryStatus(r);
        return <StatusBadge label={INVENTORY_STATUS_LABEL[status]} tone={INVENTORY_STATUS_TONE[status]} />;
      },
    },
  ];

  const formFields: FormFieldConfig[] = [
    { key: "name", label: "Item name", type: "text", required: true },
    { key: "category", label: "Category", type: "text", required: true },
    { key: "unit", label: "Unit", type: "text", required: true, placeholder: "kg / L / pcs / bunch" },
    { key: "parLevel", label: "Par level", type: "number" },
    { key: "minLevel", label: "Minimum level", type: "number" },
    { key: "reorderLevel", label: "Reorder level", type: "number" },
    {
      key: "supplierId",
      label: "Supplier",
      type: "select",
      options: (suppliers ?? []).map((s) => ({ value: s.id, label: s.name })),
    },
  ];

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Inventory</h1>
          <p className="page-desc">
            Item master seeded with real ingredient names from the vegetable indent. No on-hand quantities are invented —
            every item starts as "Not counted" until you run a stock count, receive stock, or adjust it below.
          </p>
        </div>
        <button className="btn primary" onClick={() => setShowAdd(true)}>Add item</button>
      </div>

      <div className="kpis" style={{ marginBottom: 20 }}>
        <button className="kpi good" onClick={() => setStatusFilter("healthy")}>
          <div className="kpi-top"><span className="lab">Healthy</span><span className="icon">●</span></div>
          <div className="val">{statusCounts.healthy}</div>
          <div className="note">stocked above reorder level</div>
        </button>
        <button className="kpi warn" onClick={() => setStatusFilter("low")}>
          <div className="kpi-top"><span className="lab">Low Stock</span><span className="icon">▲</span></div>
          <div className="val">{statusCounts.low}</div>
          <div className="note">reorder soon</div>
        </button>
        <button className="kpi crit" onClick={() => setStatusFilter("critical")}>
          <div className="kpi-top"><span className="lab">Critical</span><span className="icon">⚠</span></div>
          <div className="val">{statusCounts.critical}</div>
          <div className="note">below minimum level</div>
        </button>
        <button className="kpi crit" onClick={() => setStatusFilter("out_of_stock")}>
          <div className="kpi-top"><span className="lab">Out of Stock</span><span className="icon">◼</span></div>
          <div className="val">{statusCounts.out_of_stock}</div>
          <div className="note">zero on hand</div>
        </button>
        <button className="kpi notconn" onClick={() => setStatusFilter("not_counted")}>
          <div className="kpi-top"><span className="lab">Not Counted</span><span className="icon">○</span></div>
          <div className="val">{statusCounts.not_counted}</div>
          <div className="note">awaiting first stock take</div>
        </button>
      </div>

      <div className="filters-bar">
        <input
          type="search"
          placeholder="Search item or category…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ minWidth: 200 }}
        />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All statuses</option>
          {STATUS_FILTER_OPTIONS.map((s) => <option key={s} value={s}>{INVENTORY_STATUS_LABEL[s]}</option>)}
        </select>
        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
          <option value="">All categories</option>
          {categories.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        {(statusFilter || categoryFilter || search) && (
          <button className="btn small" onClick={() => { setStatusFilter(""); setCategoryFilter(""); setSearch(""); }}>Clear filters</button>
        )}
      </div>

      <div className="card">
        {isLoading ? (
          <p style={{ color: "var(--muted)" }}>Loading…</p>
        ) : (
          <DataTable columns={columns} rows={filtered} emptyMessage="No inventory items match these filters." onRowClick={(i) => setSelectedId(i.id)} />
        )}
      </div>

      {showAdd && (
        <Modal title="Add inventory item" onClose={() => setShowAdd(false)}>
          <RecordForm
            fields={formFields}
            initialValues={{ name: "", category: "", unit: "", parLevel: null, minLevel: null, reorderLevel: null, supplierId: null }}
            submitLabel="Save"
            onCancel={() => setShowAdd(false)}
            onSubmit={(values) =>
              create.mutate(
                { ...values, onHandQty: null, lastCountedAt: null, source: "manual" } as Omit<InventoryItem, keyof BaseRecord>,
                { onSuccess: () => setShowAdd(false) }
              )
            }
          />
        </Modal>
      )}

      {selected && <InventoryDetailModal item={selected} onClose={() => setSelectedId(null)} />}
    </div>
  );
}
```

#graphify/code #graphify/EXTRACTED #community/Inventory_Management_UI