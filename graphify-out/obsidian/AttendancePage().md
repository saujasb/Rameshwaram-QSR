---
source_file: "client/src/modules/attendance/AttendancePage.tsx"
type: "code"
community: "Staff & Shift Operations UI"
location: "L8"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Staff__Shift_Operations_UI
---

# AttendancePage()

## Connections
- [[AttendancePage.tsx]] - `contains` [EXTRACTED]
- [[routes.tsx]] - `imports` [EXTRACTED]

## Source
**From** `client/src/modules/attendance/AttendancePage.tsx` **(starting line 8):**
```tsx
export function AttendancePage() {
  const { data: staff } = staffHooks.useList();
  const staffOptions = (staff ?? []).map((s) => ({ value: s.id, label: `${s.name} (${s.department})` }));
  const nameOf = (staffId: string) => staff?.find((s) => s.id === staffId)?.name ?? "Unknown";

  const columns: ColumnConfig<AttendanceRecord>[] = [
    { key: "date", label: "Date" },
    { key: "staffId", label: "Employee", render: (r) => nameOf(r.staffId) },
    { key: "shift", label: "Shift" },
    { key: "scheduled", label: "Scheduled", render: (r) => (r.scheduled ? "Yes" : "No") },
    {
      key: "status",
      label: "Status",
      render: (r) => (
        <StatusBadge
          label={r.status.replace("_", " ")}
          tone={r.status === "present" ? "ok" : r.status === "absent" ? "over" : "neutral"}
        />
      ),
    },
    { key: "shiftStart", label: "Start", render: (r) => r.shiftStart ?? "—" },
    { key: "shiftEnd", label: "End", render: (r) => r.shiftEnd ?? "—" },
  ];

  const formFields: FormFieldConfig[] = [
    { key: "date", label: "Date", type: "date", required: true },
    { key: "staffId", label: "Employee", type: "select", required: true, options: staffOptions },
    {
      key: "shift",
      label: "Shift",
      type: "select",
      required: true,
      options: [
        { value: "opening", label: "Opening" },
        { value: "mid", label: "Mid" },
        { value: "closing", label: "Closing" },
      ],
    },
    { key: "scheduled", label: "Scheduled", type: "checkbox" },
    {
      key: "status",
      label: "Status",
      type: "select",
      required: true,
      options: [
        { value: "present", label: "Present" },
        { value: "absent", label: "Absent" },
        { value: "late", label: "Late" },
        { value: "on_break", label: "On break" },
      ],
    },
    { key: "shiftStart", label: "Shift start", type: "text", placeholder: "09:00" },
    { key: "shiftEnd", label: "Shift end", type: "text", placeholder: "17:00" },
    { key: "notes", label: "Notes", type: "textarea" },
  ];

  return (
    <CrudModulePage<AttendanceRecord>
      title="Attendance & Shift Management"
      description="Per-shift attendance for every employee. Add staff on the Staff page first."
      hooks={attendanceHooks}
      columns={columns}
      formFields={formFields}
      defaultValues={{
        date: new Date().toISOString().slice(0, 10),
        staffId: staffOptions[0]?.value ?? "",
        shift: "mid",
        scheduled: true,
        status: "present",
        shiftStart: null,
        shiftEnd: null,
        notes: "",
      }}
      emptyMessage={staff && staff.length === 0 ? "Add staff first — attendance needs a roster to log against." : "No attendance logged yet."}
      addButtonLabel="Log attendance"
    />
  );
}
```

#graphify/code #graphify/EXTRACTED #community/Staff__Shift_Operations_UI