---
source_file: "client/src/components/crud/CrudModulePage.tsx"
type: "code"
community: "Order Operations Pages"
location: "L17"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Order_Operations_Pages
---

# CrudModulePage()

## Connections
- [[AttendancePage.tsx]] - `imports` [EXTRACTED]
- [[ComplaintsPage.tsx]] - `imports` [EXTRACTED]
- [[CrudModulePage.tsx]] - `contains` [EXTRACTED]
- [[DeliveryPage.tsx]] - `imports` [EXTRACTED]
- [[ExpensesPage.tsx]] - `imports` [EXTRACTED]
- [[FrontCounterPage.tsx]] - `imports` [EXTRACTED]
- [[KitchenPage.tsx]] - `imports` [EXTRACTED]
- [[MaintenancePage.tsx]] - `imports` [EXTRACTED]
- [[OrdersPage.tsx]] - `imports` [EXTRACTED]
- [[PurchasesPage.tsx]] - `imports` [EXTRACTED]
- [[StaffPage.tsx]] - `imports` [EXTRACTED]
- [[SuppliersPage.tsx]] - `imports` [EXTRACTED]
- [[WastagePage.tsx]] - `imports` [EXTRACTED]

## Source
**From** `client/src/components/crud/CrudModulePage.tsx` **(starting line 17):**
```tsx
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

#graphify/code #graphify/EXTRACTED #community/Order_Operations_Pages