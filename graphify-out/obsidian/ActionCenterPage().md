---
source_file: "client/src/modules/dashboard/ActionCenterPage.tsx"
type: "code"
community: "Action Center UI"
location: "L34"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Action_Center_UI
---

# ActionCenterPage()

## Connections
- [[ActionCenterPage.tsx]] - `contains` [EXTRACTED]
- [[routes.tsx]] - `imports` [EXTRACTED]
- [[useActionCenter()]] - `calls` [EXTRACTED]

## Source
**From** `client/src/modules/dashboard/ActionCenterPage.tsx` **(starting line 34):**
```tsx
export function ActionCenterPage() {
  const { data, isLoading } = useActionCenter();

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Action Center</h1>
          <p className="page-desc">
            Computed live from real records across every module — overdue tasks, critical/low stock, escalated
            complaints, open high-priority maintenance, overdue purchases, and high wastage entries. Click any item to
            open it.
          </p>
        </div>
      </div>
      {isLoading || !data ? (
        <p style={{ color: "var(--muted)" }}>Loading…</p>
      ) : (
        <>
          <Section severity="critical" items={data.filter((i) => i.severity === "critical")} />
          <Section severity="attention" items={data.filter((i) => i.severity === "attention")} />
          <Section severity="completed" items={data.filter((i) => i.severity === "completed")} />
        </>
      )}
    </div>
  );
}
```

#graphify/code #graphify/EXTRACTED #community/Action_Center_UI