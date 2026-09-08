---
source_file: "client/src/modules/inventory/InventoryDetailModal.tsx"
type: "code"
community: "Inventory Management UI"
location: "L11"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Inventory_Management_UI
---

# InventoryDetailModal()

## Connections
- [[InventoryDetailModal.tsx]] - `contains` [EXTRACTED]
- [[InventoryPage.tsx]] - `imports` [EXTRACTED]
- [[apiGet()]] - `calls` [EXTRACTED]
- [[computeInventoryStatus()]] - `calls` [EXTRACTED]

## Source
**From** `client/src/modules/inventory/InventoryDetailModal.tsx` **(starting line 11):**
```tsx
export function InventoryDetailModal({ item, onClose }: { item: InventoryItem; onClose: () => void }) {
  const receiveAction = inventoryHooks.useAction<InventoryItem>("receive");
  const adjustAction = inventoryHooks.useAction<InventoryItem>("adjust");
  const countAction = inventoryHooks.useAction<InventoryItem>("count");
  const remove = inventoryHooks.useRemove();

  const [receiveQty, setReceiveQty] = useState(0);
  const [adjustDelta, setAdjustDelta] = useState(0);
  const [countQty, setCountQty] = useState(item.onHandQty ?? 0);
  const [employeeName, setEmployeeName] = useState("");
  const [note, setNote] = useState("");
  const [showHistory, setShowHistory] = useState(false);

  const { data: movements } = useQuery({
    queryKey: ["inventory-movements", item.id],
    queryFn: () => apiGet<InventoryMovement[]>(`/inventory-movements/by-item/${item.id}`),
    enabled: showHistory,
  });

  const status = computeInventoryStatus(item);

  return (
    <Modal title={item.name} onClose={onClose}>
      <div style={{ marginBottom: 14 }}>
        <StatusBadge label={INVENTORY_STATUS_LABEL[status]} tone={INVENTORY_STATUS_TONE[status]} />
        <span style={{ marginLeft: 10, fontSize: 13, color: "var(--ink-2)" }}>
          On hand: <b>{item.onHandQty ?? "not counted"}</b> {item.unit}
        </span>
      </div>

      <div className="field" style={{ marginBottom: 12 }}>
        <label>Employee name (for the action below)</label>
        <input value={employeeName} onChange={(e) => setEmployeeName(e.target.value)} placeholder="Who is performing this action?" />
      </div>

      <div className="grid2">
        <div className="card" style={{ margin: 0 }}>
          <h4 style={{ fontSize: 13 }}>Receive stock</h4>
          <div className="field"><input type="number" value={receiveQty} onChange={(e) => setReceiveQty(Number(e.target.value))} /></div>
          <button
            className="btn small"
            style={{ marginTop: 8 }}
            onClick={() => receiveAction.mutate({ id: item.id, body: { quantity: receiveQty, note, employeeName } })}
          >
            Receive +{receiveQty} {item.unit}
          </button>
        </div>
        <div className="card" style={{ margin: 0 }}>
          <h4 style={{ fontSize: 13 }}>Stock adjustment (+/-)</h4>
          <div className="field"><input type="number" value={adjustDelta} onChange={(e) => setAdjustDelta(Number(e.target.value))} /></div>
          <button
            className="btn small"
            style={{ marginTop: 8 }}
            onClick={() => adjustAction.mutate({ id: item.id, body: { delta: adjustDelta, note, employeeName } })}
          >
            Apply adjustment
          </button>
        </div>
      </div>

      <div className="card">
        <h4 style={{ fontSize: 13 }}>Record a stock count</h4>
        <div className="field"><input type="number" value={countQty} onChange={(e) => setCountQty(Number(e.target.value))} /></div>
        <button
          className="btn small"
          style={{ marginTop: 8 }}
          onClick={() => countAction.mutate({ id: item.id, body: { quantity: countQty, note, employeeName } })}
        >
          Save count
        </button>
      </div>

      <div className="field" style={{ marginBottom: 12 }}>
        <label>Note (applies to whichever action above you use next)</label>
        <textarea value={note} onChange={(e) => setNote(e.target.value)} />
      </div>

      <div className="btn-row" style={{ marginTop: 0 }}>
        <button className="btn small" onClick={() => setShowHistory((v) => !v)}>{showHistory ? "Hide" : "View"} history</button>
        <button className="btn" style={{ color: "var(--critical)" }} onClick={() => { remove.mutate(item.id); onClose(); }}>Delete item</button>
      </div>

      {showHistory && (
        <div className="card" style={{ marginTop: 12 }}>
          {!movements || movements.length === 0 ? (
            <p style={{ color: "var(--muted)", fontSize: 13 }}>No stock movements recorded yet.</p>
          ) : (
            <ul style={{ margin: 0, paddingLeft: 18, fontSize: 12.5 }}>
              {movements.map((m) => (
                <li key={m.id}>
                  <b>{m.type}</b> {m.quantityDelta >= 0 ? "+" : ""}{m.quantityDelta} {item.unit} → {m.resultingQty} {item.unit}
                  {" "}— {new Date(m.createdAt).toLocaleString()} {m.employeeName ? `(${m.employeeName})` : ""}
                  {m.note ? `: ${m.note}` : ""}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </Modal>
  );
}
```

#graphify/code #graphify/EXTRACTED #community/Inventory_Management_UI