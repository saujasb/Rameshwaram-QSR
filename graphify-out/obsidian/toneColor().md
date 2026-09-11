---
source_file: "client/src/modules/import/ImportCenterPage.tsx"
type: "code"
community: "Data Explorer & Import UI"
location: "L56"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Data_Explorer__Import_UI
---

# toneColor()

## Connections
- [[ImportCenterPage.tsx]] - `contains` [EXTRACTED]
- [[SuccessCard()]] - `calls` [EXTRACTED]

## Source
**From** `client/src/modules/import/ImportCenterPage.tsx` **(starting line 56):**
```tsx
function toneColor(tone: Tone): string {
  return tone === "good" ? "var(--good)" : tone === "crit" ? "var(--critical)" : "var(--warning)";
}
```

#graphify/code #graphify/EXTRACTED #community/Data_Explorer__Import_UI