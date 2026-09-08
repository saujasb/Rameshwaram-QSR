---
source_file: "client/src/components/Modal.tsx"
type: "code"
community: "Generic CRUD UI Components"
location: "L3"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Generic_CRUD_UI_Components
---

# Modal()

## Connections
- [[CrudModulePage.tsx]] - `imports` [EXTRACTED]
- [[DataExplorerPage.tsx]] - `imports` [EXTRACTED]
- [[InventoryDetailModal.tsx]] - `imports` [EXTRACTED]
- [[InventoryPage.tsx]] - `imports` [EXTRACTED]
- [[Modal.tsx]] - `contains` [EXTRACTED]
- [[ProviderOrderDetailModal.tsx]] - `imports` [EXTRACTED]
- [[SalesTargetEditor.tsx]] - `imports` [EXTRACTED]
- [[TaskDetailModal.tsx]] - `imports` [EXTRACTED]
- [[TasksPage.tsx]] - `imports` [EXTRACTED]

## Source
**From** `client/src/components/Modal.tsx` **(starting line 3):**
```tsx
export function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.45)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 200,
        padding: 20,
      }}
      onClick={onClose}
    >
      <div
        className="card"
        style={{ maxWidth: 640, width: "100%", maxHeight: "90vh", overflowY: "auto", margin: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 14 }}>
          <h3 style={{ fontSize: 17 }}>{title}</h3>
          <button className="btn small" onClick={onClose}>Close</button>
        </div>
        {children}
      </div>
    </div>
  );
}
```

#graphify/code #graphify/EXTRACTED #community/Generic_CRUD_UI_Components