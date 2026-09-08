---
source_file: "client/src/components/crud/RecordForm.tsx"
type: "code"
community: "Generic CRUD UI Components"
location: "L23"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Generic_CRUD_UI_Components
---

# handleSubmit()

## Connections
- [[RecordForm()]] - `contains` [EXTRACTED]

## Source
**From** `client/src/components/crud/RecordForm.tsx` **(starting line 23):**
```tsx
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit(values);
  }
```

#graphify/code #graphify/EXTRACTED #community/Generic_CRUD_UI_Components