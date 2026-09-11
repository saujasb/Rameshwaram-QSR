---
source_file: "client/src/modules/import/ImportCenterPage.tsx"
type: "code"
community: "Data Explorer & Import UI"
location: "L42"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Data_Explorer__Import_UI
---

# Tone

## Connections
- [[ImportCenterPage.tsx]] - `contains` [EXTRACTED]

## Source
**From** `client/src/modules/import/ImportCenterPage.tsx` **(starting line 42):**
```tsx
type Tone = "good" | "warn" | "crit";

function statusTone(status: ImportStatus): Tone {
  if (status === "passed") return "good";
  if (status === "failed") return "crit";
  return "warn";
}
```

#graphify/code #graphify/EXTRACTED #community/Data_Explorer__Import_UI