---
source_file: "client/src/modules/staff/StaffPage.tsx"
type: "code"
community: "Staff & Shift Operations UI"
location: "L38"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Staff__Shift_Operations_UI
---

# StaffPage()

## Connections
- [[StaffPage.tsx]] - `contains` [EXTRACTED]
- [[routes.tsx]] - `imports` [EXTRACTED]

## Source
**From** `client/src/modules/staff/StaffPage.tsx` **(starting line 38):**
```tsx
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