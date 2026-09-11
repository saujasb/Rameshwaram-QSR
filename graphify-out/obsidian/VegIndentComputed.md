---
source_file: "client/src/modules/sales-analytics/vegIndentCompute.ts"
type: "code"
community: "Veg Indent & Analytics Engine"
location: "L3"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Veg_Indent__Analytics_Engine
---

# VegIndentComputed

## Connections
- [[VegIndentItem]] - `inherits` [EXTRACTED]
- [[vegIndentCompute.ts]] - `contains` [EXTRACTED]

## Source
**From** `client/src/modules/sales-analytics/vegIndentCompute.ts` **(starting line 3):**
```typescript
export interface VegIndentComputed extends VegIndentItem {
  diff: number | null;
  pct: number | null;
  status: string;
}
```

#graphify/code #graphify/EXTRACTED #community/Veg_Indent__Analytics_Engine