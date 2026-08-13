import { CrudModulePage } from "../../components/crud/CrudModulePage";
import { supplierHooks } from "../../lib/api/suppliers";
import type { Supplier } from "@shared/entities";
import type { ColumnConfig, FormFieldConfig } from "../../components/crud/types";

const columns: ColumnConfig<Supplier>[] = [
  { key: "name", label: "Supplier" },
  { key: "contactPhone", label: "Phone" },
  { key: "contactEmail", label: "Email" },
  { key: "notes", label: "Notes" },
];

const formFields: FormFieldConfig[] = [
  { key: "name", label: "Supplier name", type: "text", required: true },
  { key: "contactPhone", label: "Phone", type: "text" },
  { key: "contactEmail", label: "Email", type: "text" },
  { key: "notes", label: "Notes", type: "textarea" },
];

export function SuppliersPage() {
  return (
    <CrudModulePage<Supplier>
      title="Suppliers"
      description="Your supplier directory. Referenced from Purchases."
      hooks={supplierHooks}
      columns={columns}
      formFields={formFields}
      defaultValues={{ name: "", contactPhone: "", contactEmail: "", notes: "" }}
      emptyMessage="No suppliers added yet."
      addButtonLabel="Add supplier"
    />
  );
}
