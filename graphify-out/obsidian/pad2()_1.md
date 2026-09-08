---
source_file: "shared-types/businessDate.ts"
type: "code"
community: "Data Explorer & Import UI"
location: "L18"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Data_Explorer__Import_UI
---

# pad2()

## Connections
- [[businessDate.ts]] - `contains` [EXTRACTED]
- [[getBusinessDayBounds()]] - `calls` [EXTRACTED]
- [[toDateKey()]] - `calls` [EXTRACTED]

## Source
**From** `shared-types/businessDate.ts` **(starting line 18):**
```typescript
function pad2(n: number): string {
  return n < 10 ? `0${n}` : String(n);
}
```

#graphify/code #graphify/EXTRACTED #community/Data_Explorer__Import_UI