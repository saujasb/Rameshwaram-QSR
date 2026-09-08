---
source_file: "client/src/modules/complaints/ComplaintsPage.tsx"
type: "code"
community: "Complaints & Shared Entity Enums"
location: "L1"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Complaints__Shared_Entity_Enums
---

# ComplaintsPage.tsx

## Connections
- [[ColumnConfig]] - `imports` [EXTRACTED]
- [[ComplaintRecord]] - `imports` [EXTRACTED]
- [[ComplaintsPage()]] - `contains` [EXTRACTED]
- [[CrudModulePage()]] - `imports` [EXTRACTED]
- [[CrudModulePage.tsx]] - `imports_from` [EXTRACTED]
- [[FormFieldConfig]] - `imports` [EXTRACTED]
- [[StatusBadge()]] - `imports` [EXTRACTED]
- [[StatusBadge.tsx]] - `imports_from` [EXTRACTED]
- [[columns_2]] - `contains` [EXTRACTED]
- [[complaintHooks]] - `imports` [EXTRACTED]
- [[complaints.ts]] - `imports_from` [EXTRACTED]
- [[entities.ts]] - `imports_from` [EXTRACTED]
- [[formFields_2]] - `contains` [EXTRACTED]
- [[routes.tsx]] - `imports_from` [EXTRACTED]
- [[types.ts]] - `imports_from` [EXTRACTED]

## Source
**Full file:** `client/src/modules/complaints/ComplaintsPage.tsx`
```tsx
import { CrudModulePage } from "../../components/crud/CrudModulePage";
import { StatusBadge } from "../../components/StatusBadge";
import { complaintHooks } from "../../lib/api/complaints";
import type { ComplaintRecord } from "@shared/entities";
import type { ColumnConfig, FormFieldConfig } from "../../components/crud/types";

const columns: ColumnConfig<ComplaintRecord>[] = [
  { key: "date", label: "Date" },
  { key: "customerName", label: "Customer", render: (r) => r.customerName || "Guest" },
  { key: "issueType", label: "Issue" },
  { key: "ratingOutOf5", label: "Rating", numeric: true, render: (r) => (r.ratingOutOf5 != null ? `${r.ratingOutOf5}/5` : "—") },
  { key: "assignedManager", label: "Assigned manager", render: (r) => r.assignedManager || "Unassigned" },
  {
    key: "status",
    label: "Status",
    render: (r) => (
      <StatusBadge
        label={r.status}
        tone={r.status === "resolved" ? "ok" : r.status === "escalated" ? "over" : "neutral"}
      />
    ),
  },
];

const formFields: FormFieldConfig[] = [
  { key: "date", label: "Date", type: "date", required: true },
  { key: "customerName", label: "Customer name", type: "text" },
  { key: "orderRef", label: "Order reference", type: "text" },
  { key: "issueType", label: "Issue type", type: "text", required: true, placeholder: "Food quality, service, wait time…" },
  { key: "description", label: "Description", type: "textarea", required: true },
  { key: "ratingOutOf5", label: "Rating (out of 5)", type: "number" },
  { key: "employeeInvolved", label: "Employee involved", type: "text" },
  { key: "assignedManager", label: "Assigned manager", type: "text" },
  { key: "resolution", label: "Resolution", type: "textarea" },
  {
    key: "status",
    label: "Status",
    type: "select",
    required: true,
    options: [
      { value: "new", label: "New" },
      { value: "investigating", label: "Investigating" },
      { value: "resolved", label: "Resolved" },
      { value: "escalated", label: "Escalated" },
    ],
  },
];

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