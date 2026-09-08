---
source_file: "shared-types/analytics.ts"
type: "code"
community: "Veg Indent & Analytics Engine"
location: "L54"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Veg_Indent__Analytics_Engine
---

# PrioritizedAction

## Connections
- [[actions-data.ts]] - `imports` [EXTRACTED]
- [[apianalytics.ts]] - `imports` [EXTRACTED]
- [[shared-typesanalytics.ts]] - `contains` [EXTRACTED]

## Source
**From** `shared-types/analytics.ts` **(starting line 54):**
```typescript
export interface PrioritizedAction {
  id: string;
  severity: "critical" | "serious" | "warning" | "info";
  title: string;
  detail: string;
  impact: string;
}
```

#graphify/code #graphify/EXTRACTED #community/Veg_Indent__Analytics_Engine