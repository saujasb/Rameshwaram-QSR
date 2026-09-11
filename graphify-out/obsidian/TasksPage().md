---
source_file: "client/src/modules/tasks/TasksPage.tsx"
type: "code"
community: "Staff & Shift Operations UI"
location: "L13"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Staff__Shift_Operations_UI
---

# TasksPage()

## Connections
- [[TasksPage.tsx]] - `contains` [EXTRACTED]
- [[routes.tsx]] - `imports` [EXTRACTED]

## Source
**From** `client/src/modules/tasks/TasksPage.tsx` **(starting line 13):**
```tsx
export function TasksPage() {
  const { data, isLoading } = taskHooks.useList();
  const create = taskHooks.useCreate();
  const [showAdd, setShowAdd] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = data?.find((t) => t.id === selectedId) ?? null;
  const [searchParams, setSearchParams] = useSearchParams();
  const [categoryFilter, setCategoryFilter] = useState(searchParams.get("category") ?? "");
  const [statusFilter, setStatusFilter] = useState(searchParams.get("status") ?? "");
  const [priorityFilter, setPriorityFilter] = useState("");

  useEffect(() => {
    const focusId = searchParams.get("focus");
    if (focusId && data) {
      const record = data.find((r) => r.id === focusId);
      if (record) setSelectedId(record.id);
      setSearchParams((prev) => {
        prev.delete("focus");
        return prev;
      });
    }
  }, [searchParams, data]);

  const isOverdue = (t: Task) =>
    t.status !== "completed" && t.status !== "failed" && Boolean(t.dueTime) && new Date(t.dueTime as string).getTime() < Date.now();

  const filtered = useMemo(() => {
    return (data ?? []).filter(
      (t) =>
        (!categoryFilter || t.category === categoryFilter) &&
        (!statusFilter || (statusFilter === "overdue" ? isOverdue(t) : t.status === statusFilter)) &&
        (!priorityFilter || t.priority === priorityFilter)
    );
  }, [data, categoryFilter, statusFilter, priorityFilter]);

  const columns: ColumnConfig<Task>[] = [
    { key: "name", label: "Task" },
    { key: "sopReference", label: "Ref", render: (r) => r.sopReference ?? "—" },
    { key: "category", label: "Category", render: (r) => CATEGORY_OPTIONS.find((o) => o.value === r.category)?.label },
    { key: "department", label: "Department" },
    { key: "shift", label: "Shift" },
    { key: "priority", label: "Priority", render: (r) => <StatusBadge label={r.priority} tone={r.priority === "critical" || r.priority === "high" ? "over" : "neutral"} /> },
    { key: "assignedEmployee", label: "Assigned to", render: (r) => r.assignedEmployee ?? "Unassigned" },
    { key: "dueTime", label: "Due", render: (r) => (r.dueTime ? new Date(r.dueTime).toLocaleString() : "—") },
    {
      key: "status",
      label: "Status",
      render: (r) => (
        <StatusBadge
          label={r.status.replace("_", " ")}
          tone={r.status === "completed" ? "ok" : r.status === "failed" || r.status === "overdue" ? "over" : "neutral"}
        />
      ),
    },
  ];

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Tasks / SPO / Hygiene / Food Quality</h1>
          <p className="page-desc">
            SPOs, hygiene checks, food-quality checks and general checklists — one task model, filterable by category.
            The 6 real SOPs from the operations playbook are seeded as templates below; assign, due-date and verify them
            as you put them into daily use.
          </p>
        </div>
        <button className="btn primary" onClick={() => setShowAdd(true)}>Add task</button>
      </div>

      <div className="filters-bar">
        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
          <option value="">All categories</option>
          {CATEGORY_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All statuses</option>
          {STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}>
          <option value="">All priorities</option>
          {PRIORITY_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>

      <div className="card">
        {isLoading ? (
          <p style={{ color: "var(--muted)" }}>Loading…</p>
        ) : (
          <DataTable columns={columns} rows={filtered} emptyMessage="No tasks match these filters." onRowClick={(t) => setSelectedId(t.id)} />
        )}
      </div>

      {showAdd && (
        <Modal title="Add task" onClose={() => setShowAdd(false)}>
          <RecordForm
            fields={taskFormFields}
            initialValues={{
              name: "",
              category: "general",
              department: "",
              shift: "any",
              frequency: "daily",
              priority: "medium",
              assignedEmployee: null,
              dueTime: null,
              status: "not_started",
              notes: "",
            }}
            submitLabel="Save"
            onCancel={() => setShowAdd(false)}
            onSubmit={(values) =>
              create.mutate(
                { ...values, completionTime: null, issue: null, verifiedBy: null, sopReference: null, history: [], source: "manual" } as unknown as Omit<Task, keyof BaseRecord>,
                { onSuccess: () => setShowAdd(false) }
              )
            }
          />
        </Modal>
      )}

      {selected && <TaskDetailModal task={selected} onClose={() => setSelectedId(null)} />}
    </div>
  );
}
```

#graphify/code #graphify/EXTRACTED #community/Staff__Shift_Operations_UI