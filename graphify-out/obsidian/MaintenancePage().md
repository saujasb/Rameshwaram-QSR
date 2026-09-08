---
source_file: "client/src/modules/maintenance/MaintenancePage.tsx"
type: "code"
community: "Maintenance & Suppliers UI"
location: "L61"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Maintenance__Suppliers_UI
---

# MaintenancePage()

## Connections
- [[MaintenancePage.tsx]] - `contains` [EXTRACTED]
- [[routes.tsx]] - `imports` [EXTRACTED]

## Source
**From** `client/src/modules/maintenance/MaintenancePage.tsx` **(starting line 61):**
```tsx
export function MaintenancePage() {
  return (
    <CrudModulePage<MaintenanceIssue>
      title="Maintenance"
      description="Equipment breakdowns and facility issues — priority, assignment, and resolution tracking. A critical/high open issue surfaces in the Action Center."
      hooks={maintenanceHooks}
      columns={columns}
      formFields={formFields}
      defaultValues={{
        equipment: "",
        location: "",
        issueDescription: "",
        priority: "medium",
        reportedBy: "",
        assignedTo: null,
        dateReported: new Date().toISOString().slice(0, 10),
        expectedResolution: null,
        cost: null,
        status: "open",
      }}
      emptyMessage="No maintenance issues reported."
      addButtonLabel="Report issue"
    />
  );
}
```

#graphify/code #graphify/EXTRACTED #community/Maintenance__Suppliers_UI