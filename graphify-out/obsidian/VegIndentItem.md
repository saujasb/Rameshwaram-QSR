---
source_file: "shared-types/analytics.ts"
type: "code"
community: "Veg Indent & Analytics Engine"
location: "L33"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Veg_Indent__Analytics_Engine
---

# VegIndentItem

## Connections
- [[VegIndentComputed]] - `inherits` [EXTRACTED]
- [[shared-typesanalytics.ts]] - `contains` [EXTRACTED]
- [[vegIndentCompute.ts]] - `imports` [EXTRACTED]

## Source
**From** `shared-types/analytics.ts` **(starting line 33):**
```typescript
export interface VegIndentItem {
  name: string;
  matchedLine: string | null;
  unit: string | null;
  requirement: number | null;
  orderQty: number | null;
  kind: VegIndentMatchKind;
  note: string | null;
}
```

#graphify/code #graphify/EXTRACTED #community/Veg_Indent__Analytics_Engine