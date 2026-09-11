---
source_file: "client/src/modules/dashboard/SalesTargetEditor.tsx"
type: "code"
community: "Sales Analytics Charts"
location: "L1"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Sales_Analytics_Charts
---

# SalesTargetEditor.tsx

## Connections
- [[DashboardPage.tsx]] - `imports_from` [EXTRACTED]
- [[Modal()]] - `imports` [EXTRACTED]
- [[Modal.tsx]] - `imports_from` [EXTRACTED]
- [[SalesAnalyticsPage.tsx]] - `imports_from` [EXTRACTED]
- [[apisales.ts]] - `imports_from` [EXTRACTED]
- [[useSalesTarget()]] - `imports` [EXTRACTED]
- [[useSalesTargetWithEditor()]] - `contains` [EXTRACTED]
- [[useSetSalesTarget()]] - `imports` [EXTRACTED]

## Source
**Full file:** `client/src/modules/dashboard/SalesTargetEditor.tsx`
```tsx
import { useState } from "react";
import { Modal } from "../../components/Modal";
import { useSalesTarget, useSetSalesTarget } from "../../lib/api/sales";

/** Daily sales target is a single management-set number (no target-setting feed exists yet), editable inline. */
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