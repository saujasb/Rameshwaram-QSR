import type { FormFieldConfig } from "../../components/crud/types";

export const CATEGORY_OPTIONS = [
  { value: "spo", label: "SPO / SOP" },
  { value: "hygiene", label: "Hygiene" },
  { value: "food_quality", label: "Food Quality" },
  { value: "general", label: "General" },
];

export const PRIORITY_OPTIONS = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
  { value: "critical", label: "Critical" },
];

export const STATUS_OPTIONS = [
  { value: "not_started", label: "Not Started" },
  { value: "in_progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
  { value: "overdue", label: "Overdue" },
  { value: "failed", label: "Failed" },
  { value: "requires_verification", label: "Requires Verification" },
];

export const FREQUENCY_OPTIONS = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "once", label: "Once" },
];

export const SHIFT_OPTIONS = [
  { value: "any", label: "Any" },
  { value: "opening", label: "Opening" },
  { value: "mid", label: "Mid" },
  { value: "closing", label: "Closing" },
];

export const taskFormFields: FormFieldConfig[] = [
  { key: "name", label: "Task name", type: "text", required: true },
  { key: "category", label: "Category", type: "select", required: true, options: CATEGORY_OPTIONS },
  { key: "department", label: "Department", type: "text", required: true },
  { key: "shift", label: "Shift", type: "select", required: true, options: SHIFT_OPTIONS },
  { key: "frequency", label: "Frequency", type: "select", required: true, options: FREQUENCY_OPTIONS },
  { key: "priority", label: "Priority", type: "select", required: true, options: PRIORITY_OPTIONS },
  { key: "assignedEmployee", label: "Assigned employee", type: "text" },
  { key: "dueTime", label: "Due", type: "datetime" },
  { key: "status", label: "Status", type: "select", required: true, options: STATUS_OPTIONS },
  { key: "notes", label: "Notes", type: "textarea" },
];
