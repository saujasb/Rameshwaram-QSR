---
source_file: "client/src/modules/dashboard/SalesTargetEditor.tsx"
type: "code"
community: "Sales Analytics Charts"
location: "L6"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Sales_Analytics_Charts
---

# useSalesTargetWithEditor()

## Connections
- [[DashboardPage()]] - `calls` [EXTRACTED]
- [[DashboardPage.tsx]] - `imports` [EXTRACTED]
- [[LiveSalesSection()]] - `calls` [EXTRACTED]
- [[SalesAnalyticsPage.tsx]] - `imports` [EXTRACTED]
- [[SalesTargetEditor.tsx]] - `contains` [EXTRACTED]
- [[openEditor()]] - `indirect_call` [INFERRED]
- [[save()]] - `contains` [EXTRACTED]
- [[useSalesTarget()]] - `calls` [EXTRACTED]
- [[useSetSalesTarget()]] - `calls` [EXTRACTED]

## Source
**From** `client/src/modules/dashboard/SalesTargetEditor.tsx` **(starting line 6):**
```tsx
export function useSalesTargetWithEditor() {
  const { data: target } = useSalesTarget();
  const setTarget = useSetSalesTarget();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");

  function openEditor() {
    setDraft(target?.amount ? String(target.amount) : "");
    setEditing(true);
  }

  function save() {
    const amount = Number(draft);
    if (!Number.isFinite(amount) || amount < 0) return;
    setTarget.mutate(amount, { onSuccess: () => setEditing(false) });
  }

  const editor = editing ? (
    <Modal title="Set daily sales target" onClose={() => setEditing(false)}>
      <p style={{ fontSize: 13, color: "var(--ink-2)", marginTop: 0 }}>
        Applied to every business day until changed — used to grade Target Achievement across the dashboard.
      </p>
      <div className="field">
        <label>Daily sales target (₹)</label>
        <input
          type="number"
          min={0}
          step={1000}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          autoFocus
          onKeyDown={(e) => e.key === "Enter" && save()}
        />
      </div>
      <div className="btn-row">
        <button className="btn primary" onClick={save} disabled={setTarget.isPending}>
          Save target
        </button>
        <button className="btn" onClick={() => setEditing(false)}>
          Cancel
        </button>
      </div>
    </Modal>
  ) : null;

  return { target, openEditor, editor };
}
```

#graphify/code #graphify/EXTRACTED #community/Sales_Analytics_Charts