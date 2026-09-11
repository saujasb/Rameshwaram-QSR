---
source_file: "client/src/modules/import/ImportCenterPage.tsx"
type: "code"
community: "Data Explorer & Import UI"
location: "L473"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Data_Explorer__Import_UI
---

# importAnyway()

## Connections
- [[ImportCenterPage()]] - `contains` [EXTRACTED]

## Source
**From** `client/src/modules/import/ImportCenterPage.tsx` **(starting line 473):**
```tsx
  function importAnyway(fileName: string) {
    const file = files.find((f) => f.name === fileName);
    if (!file) return;
    importMutation.mutate({ files: [file], businessDate, allowDuplicateFile: true });
  }
```

#graphify/code #graphify/EXTRACTED #community/Data_Explorer__Import_UI