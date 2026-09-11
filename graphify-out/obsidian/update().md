---
source_file: "client/src/modules/explorer/DataExplorerPage.tsx"
type: "code"
community: "Data Explorer & Import UI"
location: "L56"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Data_Explorer__Import_UI
---

# update()

## Connections
- [[DataExplorerPage()]] - `contains` [EXTRACTED]

## Source
**From** `client/src/modules/explorer/DataExplorerPage.tsx` **(starting line 56):**
```tsx
  function update(patch: Partial<Record<string, string | number | undefined>>) {
    const next = new URLSearchParams(params);
    for (const [k, v] of Object.entries(patch)) {
      if (v === undefined || v === "" || v === null) next.delete(k);
      else next.set(k, String(v));
    }
    if (!("page" in patch)) next.set("page", "1");
    setParams(next, { replace: true });
  }
```

#graphify/code #graphify/EXTRACTED #community/Data_Explorer__Import_UI