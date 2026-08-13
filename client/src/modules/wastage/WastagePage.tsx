import { CrudModulePage } from "../../components/crud/CrudModulePage";
import { HBarChart } from "../../components/charts/HBarChart";
import { wastageHooks } from "../../lib/api/wastage";
import type { WastageEntry } from "@shared/entities";
import type { ColumnConfig, FormFieldConfig } from "../../components/crud/types";

const columns: ColumnConfig<WastageEntry>[] = [
  { key: "date", label: "Date" },
  { key: "itemName", label: "Item" },
  { key: "quantityKg", label: "Qty (kg)", numeric: true, render: (r) => r.quantityKg.toFixed(2) },
  { key: "reasonCode", label: "Reason", render: (r) => r.reasonCode?.replace("_", " ") ?? "— not recorded —" },
  { key: "shift", label: "Shift", render: (r) => r.shift ?? "—" },
  { key: "employeeName", label: "Employee", render: (r) => r.employeeName ?? "—" },
  { key: "source", label: "Source", render: (r) => (r.source === "seed" ? "07-Aug report" : "Manual entry") },
];

const formFields: FormFieldConfig[] = [
  { key: "date", label: "Date", type: "date", required: true },
  { key: "itemName", label: "Item", type: "text", required: true },
  { key: "quantityKg", label: "Quantity (kg)", type: "number", required: true },
  {
    key: "reasonCode",
    label: "Reason",
    type: "select",
    required: true,
    options: [
      { value: "expired", label: "Expired" },
      { value: "overproduction", label: "Overproduction" },
      { value: "spillage", label: "Spillage" },
      { value: "prep_error", label: "Prep error" },
      { value: "customer_return", label: "Customer return" },
      { value: "damaged", label: "Damaged" },
      { value: "other", label: "Other" },
    ],
  },
  {
    key: "shift",
    label: "Shift",
    type: "select",
    options: [
      { value: "opening", label: "Opening" },
      { value: "mid", label: "Mid" },
      { value: "closing", label: "Closing" },
    ],
  },
  { key: "employeeName", label: "Employee", type: "text" },
  { key: "estimatedCostRupees", label: "Estimated cost (₹)", type: "number" },
  { key: "notes", label: "Notes", type: "textarea" },
];

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
