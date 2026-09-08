---
source_file: "client/src/modules/wastage/WastagePage.tsx"
type: "code"
community: "Staff & Shift Operations UI"
location: "L51"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Staff__Shift_Operations_UI
---

# WastagePage()

## Connections
- [[WastagePage.tsx]] - `contains` [EXTRACTED]
- [[routes.tsx]] - `imports` [EXTRACTED]

## Source
**From** `client/src/modules/wastage/WastagePage.tsx` **(starting line 51):**
```tsx
export function WastagePage() {
  return (
    <CrudModulePage<WastageEntry>
      title="Wastage Tracker"
      description="Every wastage entry, with reason code, shift and employee. The 07-Aug-2026 report's 11 rows are seeded in; add today's entries as they happen — real-time logging beats end-of-day reconstruction (SOP 5.4)."
      hooks={wastageHooks}
      columns={columns}
      formFields={formFields}
      defaultValues={{
        date: new Date().toISOString().slice(0, 10),
        itemName: "",
        quantityKg: 0,
        reasonCode: "other",
        shift: "mid",
        employeeName: "",
        estimatedCostRupees: null,
        notes: "",
        source: "manual",
      }}
      emptyMessage="No wastage logged yet."
      addButtonLabel="Log wastage"
      beforeTable={(rows) =>
        rows.length > 0 ? (
          <div className="card">
            <h3>Wastage by item (kg)</h3>
            <p className="h3sub">All logged entries, largest first.</p>
            <HBarChart
              data={[...rows]
                .sort((a, b) => b.quantityKg - a.quantityKg)
                .map((r) => ({ name: r.itemName, value: r.quantityKg, tooltip: `${r.itemName}: ${r.quantityKg} kg (${r.reasonCode ?? "unspecified"})` }))}
              valueFormatter={(v) => `${v} kg`}
              defaultColor="var(--serious)"
            />
          </div>
        ) : null
      }
    />
  );
}
```

#graphify/code #graphify/EXTRACTED #community/Staff__Shift_Operations_UI