---
source_file: "client/src/components/crud/RecordForm.tsx"
type: "code"
community: "Generic CRUD UI Components"
location: "L1"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Generic_CRUD_UI_Components
---

# RecordForm.tsx

## Connections
- [[CrudModulePage.tsx]] - `imports_from` [EXTRACTED]
- [[FormFieldConfig]] - `imports` [EXTRACTED]
- [[InventoryPage.tsx]] - `imports_from` [EXTRACTED]
- [[RecordForm()]] - `contains` [EXTRACTED]
- [[TaskDetailModal.tsx]] - `imports_from` [EXTRACTED]
- [[TasksPage.tsx]] - `imports_from` [EXTRACTED]
- [[types.ts]] - `imports_from` [EXTRACTED]

## Source
**Full file:** `client/src/components/crud/RecordForm.tsx`
```tsx
import { useState } from "react";
import type { FormFieldConfig } from "./types";

export function RecordForm({
  fields,
  initialValues,
  onSubmit,
  onCancel,
  submitLabel,
}: {
  fields: FormFieldConfig[];
  initialValues: Record<string, unknown>;
  onSubmit: (values: Record<string, unknown>) => void;
  onCancel: () => void;
  submitLabel: string;
}) {
  const [values, setValues] = useState<Record<string, unknown>>(initialValues);

  function setField(key: string, value: unknown) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit(values);
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-grid">
        {fields.map((f) => (
          <div className="field" key={f.key} style={f.type === "textarea" ? { gridColumn: "1 / -1" } : undefined}>
            <label htmlFor={f.key}>{f.label}{f.required ? " *" : ""}</label>
            {f.type === "select" ? (
              <select
                id={f.key}
                required={f.required}
                value={(values[f.key] as string) ?? ""}
                onChange={(e) => setField(f.key, e.target.value)}
              >
                <option value="" disabled>Select…</option>
                {f.options?.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            ) : f.type === "textarea" ? (
              <textarea
                id={f.key}
                required={f.required}
                placeholder={f.placeholder}
                value={(values[f.key] as string) ?? ""}
                onChange={(e) => setField(f.key, e.target.value)}
              />
            ) : f.type === "checkbox" ? (
              <input
                id={f.key}
                type="checkbox"
                checked={Boolean(values[f.key])}
                onChange={(e) => setField(f.key, e.target.checked)}
              />
            ) : (
              <input
                id={f.key}
                type={f.type === "datetime" ? "datetime-local" : f.type}
                required={f.required}
                placeholder={f.placeholder}
                value={(values[f.key] as string | number) ?? ""}
                onChange={(e) =>
                  setField(f.key, f.type === "number" ? (e.target.value === "" ? null : Number(e.target.value)) : e.target.value)
                }
              />
            )}
          </div>
        ))}
      </div>
      <div className="btn-row">
        <button type="submit" className="btn primary">{submitLabel}</button>
        <button type="button" className="btn" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}
```

#graphify/code #graphify/EXTRACTED #community/Generic_CRUD_UI_Components