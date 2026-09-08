---
source_file: "client/src/modules/staff/StaffPage.tsx"
type: "code"
community: "Staff & Shift Operations UI"
location: "L1"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Staff__Shift_Operations_UI
---

# StaffPage.tsx

## Connections
- [[ColumnConfig]] - `imports` [EXTRACTED]
- [[CrudModulePage()]] - `imports` [EXTRACTED]
- [[CrudModulePage.tsx]] - `imports_from` [EXTRACTED]
- [[FormFieldConfig]] - `imports` [EXTRACTED]
- [[ROLE_OPTIONS]] - `contains` [EXTRACTED]
- [[StaffMember]] - `imports` [EXTRACTED]
- [[StaffPage()]] - `contains` [EXTRACTED]
- [[StatusBadge()]] - `imports` [EXTRACTED]
- [[StatusBadge.tsx]] - `imports_from` [EXTRACTED]
- [[columns]] - `contains` [EXTRACTED]
- [[entities.ts]] - `imports_from` [EXTRACTED]
- [[formFields]] - `contains` [EXTRACTED]
- [[routes.tsx]] - `imports_from` [EXTRACTED]
- [[staff.ts]] - `imports_from` [EXTRACTED]
- [[staffHooks]] - `imports` [EXTRACTED]
- [[types.ts]] - `imports_from` [EXTRACTED]

## Source
**Full file:** `client/src/modules/staff/StaffPage.tsx`
```tsx
import { CrudModulePage } from "../../components/crud/CrudModulePage";
import { StatusBadge } from "../../components/StatusBadge";
import { staffHooks } from "../../lib/api/staff";
import type { StaffMember } from "@shared/entities";
import type { ColumnConfig, FormFieldConfig } from "../../components/crud/types";

const ROLE_OPTIONS = [
  { value: "store_manager", label: "Store Manager" },
  { value: "shift_manager", label: "Shift Manager" },
  { value: "cashier", label: "Cashier" },
  { value: "kitchen_staff", label: "Kitchen Staff" },
  { value: "prep_staff", label: "Prep Staff" },
  { value: "service_staff", label: "Service Staff" },
  { value: "cleaning_staff", label: "Cleaning Staff" },
  { value: "delivery_staff", label: "Delivery Staff" },
];

const columns: ColumnConfig<StaffMember>[] = [
  { key: "name", label: "Name" },
  { key: "role", label: "Role", render: (r) => ROLE_OPTIONS.find((o) => o.value === r.role)?.label ?? r.role },
  { key: "department", label: "Department" },
  { key: "phone", label: "Phone" },
  {
    key: "active",
    label: "Status",
    render: (r) => <StatusBadge label={r.active ? "Active" : "Inactive"} tone={r.active ? "ok" : "neutral"} />,
  },
];

const formFields: FormFieldConfig[] = [
  { key: "name", label: "Name", type: "text", required: true },
  { key: "role", label: "Role", type: "select", required: true, options: ROLE_OPTIONS },
  { key: "department", label: "Department", type: "text", required: true },
  { key: "phone", label: "Phone", type: "text" },
  { key: "active", label: "Active", type: "checkbox" },
];

export function StaffPage() {
  return (
    <CrudModulePage<StaffMember>
      title="Staff"
      description="Your employee roster. Add staff here first, then log their attendance per shift on the Attendance page."
      hooks={staffHooks}
      columns={columns}
      formFields={formFields}
      defaultValues={{ name: "", role: "kitchen_staff", department: "", phone: "", active: true }}
      emptyMessage="No staff added yet — add your roster to unlock attendance & staffing status."
      addButtonLabel="Add staff member"
    />
  );
}
```

#graphify/code #graphify/EXTRACTED #community/Staff__Shift_Operations_UI