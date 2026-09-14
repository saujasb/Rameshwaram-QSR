import { CrudModulePage } from "../../components/crud/CrudModulePage";
import { StatusBadge } from "../../components/StatusBadge";
import { maintenanceHooks } from "../../lib/api/maintenance";
import type { MaintenanceIssue } from "@shared/entities";
import type { ColumnConfig, FormFieldConfig } from "../../components/crud/types";

const columns: ColumnConfig<MaintenanceIssue>[] = [
  { key: "dateReported", label: "Reported" },
  { key: "equipment", label: "Equipment" },
  { key: "location", label: "Location" },
  {
    key: "priority",
    label: "Priority",
    render: (r) => <StatusBadge label={r.priority} tone={r.priority === "critical" || r.priority === "high" ? "over" : "neutral"} />,
  },
  { key: "assignedTo", label: "Assigned to", render: (r) => r.assignedTo ?? "Unassigned" },
  {
    key: "status",
    label: "Status",
    render: (r) => <StatusBadge label={r.status.replace("_", " ")} tone={r.status === "resolved" ? "ok" : "under"} />,
  },
  { key: "cost", label: "Cost", numeric: true, render: (r) => (r.cost != null ? `₹${r.cost}` : "—") },
];

const formFields: FormFieldConfig[] = [
  { key: "equipment", label: "Equipment", type: "text", required: true, placeholder: "Refrigerator, POS, HVAC…" },
  { key: "location", label: "Location", type: "text", required: true },
  { key: "issueDescription", label: "Issue description", type: "textarea", required: true },
  {
    key: "priority",
    label: "Priority",
    type: "select",
    required: true,
    options: [
      { value: "low", label: "Low" },
      { value: "medium", label: "Medium" },
      { value: "high", label: "High" },
      { value: "critical", label: "Critical" },
    ],
  },
  { key: "reportedBy", label: "Reported by", type: "text", required: true },
  { key: "assignedTo", label: "Assigned to", type: "text" },
  { key: "dateReported", label: "Date reported", type: "date", required: true },
  { key: "expectedResolution", label: "Expected resolution", type: "date" },
  { key: "cost", label: "Cost (₹)", type: "number" },
  {
    key: "status",
    label: "Status",
    type: "select",
    required: true,
    options: [
      { value: "open", label: "Open" },
      { value: "assigned", label: "Assigned" },
      { value: "in_progress", label: "In progress" },
      { value: "waiting", label: "Waiting" },
      { value: "resolved", label: "Resolved" },
    ],
  },
];

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
