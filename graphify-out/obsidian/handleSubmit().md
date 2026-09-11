---
source_file: "client/src/modules/sales-analytics/SalesImportPage.tsx"
type: "code"
community: "Sales Import UI"
location: "L89"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Sales_Import_UI
---

# handleSubmit()

## Connections
- [[SalesImportPage()]] - `contains` [EXTRACTED]

## Source
**From** `client/src/modules/sales-analytics/SalesImportPage.tsx` **(starting line 89):**
```tsx
  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!file) return;
    importMutation.mutate({ file, businessDate });
  }
```

#graphify/code #graphify/EXTRACTED #community/Sales_Import_UI