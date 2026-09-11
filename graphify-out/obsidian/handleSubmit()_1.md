---
source_file: "client/src/modules/import/ImportCenterPage.tsx"
type: "code"
community: "Data Explorer & Import UI"
location: "L467"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Data_Explorer__Import_UI
---

# handleSubmit()

## Connections
- [[ImportCenterPage()]] - `contains` [EXTRACTED]

## Source
**From** `client/src/modules/import/ImportCenterPage.tsx` **(starting line 467):**
```tsx
  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!files.length) return;
    importMutation.mutate({ files, businessDate });
  }
```

#graphify/code #graphify/EXTRACTED #community/Data_Explorer__Import_UI