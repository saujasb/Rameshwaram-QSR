---
source_file: "client/src/modules/import/ImportCenterPage.tsx"
type: "code"
community: "Data Explorer & Import UI"
location: "L50"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Data_Explorer__Import_UI
---

# pctTone()

## Connections
- [[Gauge()]] - `calls` [EXTRACTED]
- [[ImportCenterPage.tsx]] - `contains` [EXTRACTED]
- [[SuccessCard()]] - `calls` [EXTRACTED]

## Source
**From** `client/src/modules/import/ImportCenterPage.tsx` **(starting line 50):**
```tsx
function pctTone(pct: number): Tone {
  if (pct >= 90) return "good";
  if (pct >= 70) return "warn";
  return "crit";
}
```

#graphify/code #graphify/EXTRACTED #community/Data_Explorer__Import_UI