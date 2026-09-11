---
source_file: "shared-types/analytics.ts"
type: "code"
community: "Veg Indent & Analytics Engine"
location: "L31"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Veg_Indent__Analytics_Engine
---

# VegIndentMatchKind

## Connections
- [[shared-typesanalytics.ts]] - `contains` [EXTRACTED]

## Source
**From** `shared-types/analytics.ts` **(starting line 31):**
```typescript
export type VegIndentMatchKind = "full" | "blank" | "none" | "dup";

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