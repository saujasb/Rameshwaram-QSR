---
source_file: "client/src/modules/sales-analytics/SalesImportPage.tsx"
type: "code"
community: "Sales Import UI"
location: "L95"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Sales_Import_UI
---

# handleDrop()

## Connections
- [[SalesImportPage()]] - `contains` [EXTRACTED]

## Source
**From** `client/src/modules/sales-analytics/SalesImportPage.tsx` **(starting line 95):**
```tsx
  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragging(false);
    const dropped = e.dataTransfer.files?.[0];
    if (dropped) setFile(dropped);
  }
```

#graphify/code #graphify/EXTRACTED #community/Sales_Import_UI