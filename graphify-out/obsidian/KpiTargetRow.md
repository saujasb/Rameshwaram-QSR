---
source_file: "shared-types/analytics.ts"
type: "code"
community: "Veg Indent & Analytics Engine"
location: "L43"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Veg_Indent__Analytics_Engine
---

# KpiTargetRow

## Connections
- [[shared-typesanalytics.ts]] - `contains` [EXTRACTED]

## Source
**From** `shared-types/analytics.ts` **(starting line 43):**
```typescript
export interface KpiTargetRow {
  kpi: string;
  description: string;
  target: string;
  watch: string;
  act: string;
  today: string;
  grade: "good" | "warn" | "ser" | "crit";
  gradeLabel: string;
}
```

#graphify/code #graphify/EXTRACTED #community/Veg_Indent__Analytics_Engine