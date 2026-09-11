---
source_file: "client/src/modules/import/ImportCenterPage.tsx"
type: "code"
community: "Data Explorer & Import UI"
location: "L444"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Data_Explorer__Import_UI
---

# addFiles()

## Connections
- [[ImportCenterPage()]] - `contains` [EXTRACTED]
- [[handleDrop()_1]] - `calls` [EXTRACTED]

## Source
**From** `client/src/modules/import/ImportCenterPage.tsx` **(starting line 444):**
```tsx
  function addFiles(incoming: FileList | null) {
    if (!incoming?.length) return;
    const next = Array.from(incoming);
    setFiles((prev) => [...prev, ...next.filter((f) => !prev.some((p) => p.name === f.name && p.size === f.size))]);
  }
```

#graphify/code #graphify/EXTRACTED #community/Data_Explorer__Import_UI