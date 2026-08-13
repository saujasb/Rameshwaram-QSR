import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { DataTable } from "../../components/table/DataTable";
import { Modal } from "../../components/Modal";
import { RecordForm } from "../../components/crud/RecordForm";
import { StatusBadge } from "../../components/StatusBadge";
import { InventoryDetailModal } from "./InventoryDetailModal";
import { inventoryHooks } from "../../lib/api/inventory";
import { supplierHooks } from "../../lib/api/suppliers";
import type { BaseRecord, InventoryItem, InventoryStatus } from "@shared/entities";
import { computeInventoryStatus } from "@shared/inventoryStatus";
import type { ColumnConfig, FormFieldConfig } from "../../components/crud/types";
import { INVENTORY_STATUS_LABEL, INVENTORY_STATUS_TONE } from "./inventoryStatusUi";

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
    return (data ?? []).filter((i) => {
      const status = computeInventoryStatus(i);
      return (!statusFilter || status === statusFilter) && (!categoryFilter || i.category === categoryFilter);
    });
  }, [data, statusFilter, categoryFilter]);

  const columns: ColumnConfig<InventoryItem>[] = [
    { key: "name", label: "Item" },
    { key: "category", label: "Category" },
    { key: "onHandQty", label: "On hand", numeric: true, render: (r) => (r.onHandQty != null ? `${r.onHandQty} ${r.unit}` : "—") },
    { key: "reorderLevel", label: "Reorder at", numeric: true, render: (r) => (r.reorderLevel != null ? `${r.reorderLevel} ${r.unit}` : "—") },
    { key: "supplierId", label: "Supplier", render: (r) => supplierName(r.supplierId) },
    {
      key: "status",
      label: "Status",
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

      <div className="filters-bar">
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All statuses</option>
          {STATUS_FILTER_OPTIONS.map((s) => <option key={s} value={s}>{INVENTORY_STATUS_LABEL[s]}</option>)}
        </select>
        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
          <option value="">All categories</option>
          {categories.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
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
