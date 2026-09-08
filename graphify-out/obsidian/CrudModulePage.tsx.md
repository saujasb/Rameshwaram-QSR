---
source_file: "client/src/components/crud/CrudModulePage.tsx"
type: "code"
community: "Generic CRUD UI Components"
location: "L1"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Generic_CRUD_UI_Components
---

# CrudModulePage.tsx

## Connections
- [[AttendancePage.tsx]] - `imports_from` [EXTRACTED]
- [[BaseRecord]] - `imports` [EXTRACTED]
- [[ColumnConfig]] - `imports` [EXTRACTED]
- [[ComplaintsPage.tsx]] - `imports_from` [EXTRACTED]
- [[CrudHooks]] - `contains` [EXTRACTED]
- [[CrudModulePage()]] - `contains` [EXTRACTED]
- [[DataTable()]] - `imports` [EXTRACTED]
- [[DataTable.tsx]] - `imports_from` [EXTRACTED]
- [[DeliveryPage.tsx]] - `imports_from` [EXTRACTED]
- [[ExpensesPage.tsx]] - `imports_from` [EXTRACTED]
- [[FormFieldConfig]] - `imports` [EXTRACTED]
- [[FrontCounterPage.tsx]] - `imports_from` [EXTRACTED]
- [[KitchenPage.tsx]] - `imports_from` [EXTRACTED]
- [[MaintenancePage.tsx]] - `imports_from` [EXTRACTED]
- [[Modal()]] - `imports` [EXTRACTED]
- [[Modal.tsx]] - `imports_from` [EXTRACTED]
- [[OrdersPage.tsx]] - `imports_from` [EXTRACTED]
- [[PurchasesPage.tsx]] - `imports_from` [EXTRACTED]
- [[RecordForm()]] - `imports` [EXTRACTED]
- [[RecordForm.tsx]] - `imports_from` [EXTRACTED]
- [[StaffPage.tsx]] - `imports_from` [EXTRACTED]
- [[SuppliersPage.tsx]] - `imports_from` [EXTRACTED]
- [[WastagePage.tsx]] - `imports_from` [EXTRACTED]
- [[entities.ts]] - `imports_from` [EXTRACTED]
- [[types.ts]] - `imports_from` [EXTRACTED]

## Source
**Full file:** `client/src/components/crud/CrudModulePage.tsx`
```tsx
import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { useSearchParams } from "react-router-dom";
import { DataTable } from "../table/DataTable";
import { Modal } from "../Modal";
import { RecordForm } from "./RecordForm";
import type { ColumnConfig, FormFieldConfig } from "./types";
import type { BaseRecord } from "@shared/entities";

interface CrudHooks<T extends BaseRecord> {
  useList: () => { data?: T[]; isLoading: boolean; error: unknown };
  useCreate: () => { mutate: (data: Omit<T, keyof BaseRecord>, opts?: { onSuccess?: () => void }) => void; isPending: boolean };
  useUpdate: () => { mutate: (vars: { id: string; patch: Partial<Omit<T, keyof BaseRecord>> }, opts?: { onSuccess?: () => void }) => void; isPending: boolean };
  useRemove: () => { mutate: (id: string) => void };
}

export function CrudModulePage<T extends BaseRecord>({
  title,
  description,
  hooks,
  columns,
  formFields,
  defaultValues,
  emptyMessage,
  addButtonLabel,
  extraHeaderContent,
  renderDetail,
  beforeTable,
}: {
  title: string;
  description: string;
  hooks: CrudHooks<T>;
  columns: ColumnConfig<T>[];
  formFields: FormFieldConfig[];
  defaultValues: Record<string, unknown>;
  emptyMessage: string;
  addButtonLabel: string;
  extraHeaderContent?: ReactNode;
  renderDetail?: (record: T, close: () => void) => ReactNode;
  beforeTable?: (rows: T[]) => ReactNode;
}) {
  const { data, isLoading } = hooks.useList();
  const create = hooks.useCreate();
  const update = hooks.useUpdate();
  const remove = hooks.useRemove();
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState<T | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const focusId = searchParams.get("focus");
    if (focusId && data) {
      const record = data.find((r) => r.id === focusId);
      if (record) setEditing(record);
      setSearchParams((prev) => {
        prev.delete("focus");
        return prev;
      });
    }
  }, [searchParams, data]);

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>{title}</h1>
          <p className="page-desc">{description}</p>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          {extraHeaderContent}
          <button className="btn primary" onClick={() => setShowAdd(true)}>{addButtonLabel}</button>
        </div>
      </div>

      {beforeTable?.(data ?? [])}

      <div className="card">
        {isLoading ? (
          <p style={{ color: "var(--muted)" }}>Loading…</p>
        ) : (
          <DataTable
            columns={columns}
            rows={data ?? []}
            emptyMessage={emptyMessage}
            onRowClick={(record) => setEditing(record)}
          />
        )}
      </div>

      {showAdd && (
        <Modal title={addButtonLabel} onClose={() => setShowAdd(false)}>
          <RecordForm
            fields={formFields}
            initialValues={defaultValues}
            submitLabel="Save"
            onCancel={() => setShowAdd(false)}
            onSubmit={(values) => {
              create.mutate(values as Omit<T, keyof BaseRecord>, { onSuccess: () => setShowAdd(false) });
            }}
          />
        </Modal>
      )}

      {editing && (
        <Modal title={`Edit — ${title}`} onClose={() => setEditing(null)}>
          {renderDetail?.(editing, () => setEditing(null))}
          <RecordForm
            fields={formFields}
            initialValues={editing as unknown as Record<string, unknown>}
            submitLabel="Update"
            onCancel={() => setEditing(null)}
            onSubmit={(values) => {
              update.mutate(
                { id: editing.id, patch: values as Partial<Omit<T, keyof BaseRecord>> },
                { onSuccess: () => setEditing(null) }
              );
            }}
          />
          <div className="btn-row">
            <button
              className="btn"
              style={{ color: "var(--critical)" }}
              onClick={() => {
                remove.mutate(editing.id);
                setEditing(null);
              }}
            >
              Delete record
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
```

#graphify/code #graphify/EXTRACTED #community/Generic_CRUD_UI_Components