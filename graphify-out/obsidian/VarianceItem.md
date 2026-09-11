---
source_file: "shared-types/analytics.ts"
type: "code"
community: "Veg Indent & Analytics Engine"
location: "L1"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Veg_Indent__Analytics_Engine
---

# VarianceItem

## Connections
- [[shared-typesanalytics.ts]] - `contains` [EXTRACTED]

## Source
**From** `shared-types/analytics.ts` **(starting line 1):**
```typescript
export interface VarianceItem {
  name: string;
  producedKg: number;
  consumedKg: number;
  soldPlates: number;
  netDiffKg: number;
  variancePct: number;
}
```

#graphify/code #graphify/EXTRACTED #community/Veg_Indent__Analytics_Engine