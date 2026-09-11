---
source_file: "client/src/modules/complaints/ComplaintsPage.tsx"
type: "code"
community: "Complaints & Shared Entity Enums"
location: "L49"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Complaints__Shared_Entity_Enums
---

# ComplaintsPage()

## Connections
- [[ComplaintsPage.tsx]] - `contains` [EXTRACTED]
- [[routes.tsx]] - `imports` [EXTRACTED]

## Source
**From** `client/src/modules/complaints/ComplaintsPage.tsx` **(starting line 49):**
```tsx
export function ComplaintsPage() {
  return (
    <CrudModulePage<ComplaintRecord>
      title="Customer Complaints"
      description="Every guest complaint or low-rating feedback, tracked to resolution. Escalated complaints surface as critical in the Action Center."
      hooks={complaintHooks}
      columns={columns}
      formFields={formFields}
      defaultValues={{
        date: new Date().toISOString().slice(0, 10),
        customerName: "",
        orderRef: "",
        issueType: "",
        description: "",
        ratingOutOf5: null,
        employeeInvolved: "",
        assignedManager: "",
        resolution: "",
        resolutionTime: null,
        status: "new",
      }}
      emptyMessage="No complaints logged."
      addButtonLabel="Log complaint"
    />
  );
}
```

#graphify/code #graphify/EXTRACTED #community/Complaints__Shared_Entity_Enums