---
source_file: "client/src/modules/import/ImportCenterPage.tsx"
type: "code"
community: "Data Explorer & Import UI"
location: "L94"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Data_Explorer__Import_UI
---

# Metric()

## Connections
- [[ImportCenterPage.tsx]] - `contains` [EXTRACTED]

## Source
**From** `client/src/modules/import/ImportCenterPage.tsx` **(starting line 94):**
```tsx
function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="metric">
      <div className="lab">{label}</div>
      <div className="val">{value.toLocaleString()}</div>
    </div>
  );
}
```

#graphify/code #graphify/EXTRACTED #community/Data_Explorer__Import_UI