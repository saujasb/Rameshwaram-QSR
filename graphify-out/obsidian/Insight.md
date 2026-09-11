---
source_file: "shared-types/intelligence.ts"
type: "code"
community: "Business Intelligence Engine"
location: "L108"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Business_Intelligence_Engine
---

# Insight

## Connections
- [[TopInsightsPanel.tsx]] - `imports` [EXTRACTED]
- [[analysis.ts]] - `imports` [EXTRACTED]
- [[apiintelligence.ts]] - `imports` [EXTRACTED]
- [[insights.ts]] - `imports` [EXTRACTED]
- [[shared-typesintelligence.ts]] - `contains` [EXTRACTED]

## Source
**From** `shared-types/intelligence.ts` **(starting line 108):**
```typescript
export interface Insight {
  id: string;
  category: InsightCategory;
  severity: AnomalySeverity | "info";
  /** WHAT happened, stated with the number in it. */
  what: string;
  /** HOW MUCH -- the quantified magnitude. */
  howMuch: string;
  /** WHEN -- business date or range, plus hour when known. */
  when: string;
  /** WHERE -- outlet/shift/channel, or "single branch" when that's all there is. */
  where: string;
  /** WHICH product, or null for whole-business insights. */
  product: string | null;
  /** IMPACT -- measurable consequence, in rupees or qty. */
  impact: string;
  /** ACTION -- only what the data actually supports. */
  action: string;
  evidence: AnomalyEvidence[];
  drilldownQuery: Record<string, string>;
  /** Ranking weight; higher surfaces first on the dashboard. */
  score: number;
}
```

#graphify/code #graphify/EXTRACTED #community/Business_Intelligence_Engine