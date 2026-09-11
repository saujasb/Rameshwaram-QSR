---
source_file: "client/src/components/crud/RecordForm.tsx"
type: "code"
community: "Generic CRUD UI Components"
location: "L19"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Generic_CRUD_UI_Components
---

# setField()

## Connections
- [[RecordForm()]] - `contains` [EXTRACTED]

## Source
**From** `client/src/components/crud/RecordForm.tsx` **(starting line 19):**
```tsx
  function setField(key: string, value: unknown) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }
```

#graphify/code #graphify/EXTRACTED #community/Generic_CRUD_UI_Components