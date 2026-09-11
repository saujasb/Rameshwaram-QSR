---
source_file: "shared-types/intelligence.ts"
type: "code"
community: "Business Intelligence Engine"
location: "L70"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Business_Intelligence_Engine
---

# Anomaly

## Connections
- [[IntelligencePage.tsx]] - `imports` [EXTRACTED]
- [[analysis.ts]] - `imports` [EXTRACTED]
- [[anomalies.ts]] - `imports` [EXTRACTED]
- [[apiintelligence.ts]] - `imports` [EXTRACTED]
- [[insights.ts]] - `imports` [EXTRACTED]
- [[shared-typesintelligence.ts]] - `contains` [EXTRACTED]

## Source
**From** `shared-types/intelligence.ts` **(starting line 70):**
```typescript
export interface Anomaly {
  id: string;
  kind: AnomalyKind;
  severity: AnomalySeverity;
  headline: string;
  businessDate: string;
  /** Raw clock-hour bucket when the underlying data has timestamps. */
  hour: number | null;
  product: string | null;
  outlet: string | null;
  shift: string | null;
  expected: number;
  actual: number;
  absoluteVariance: number;
  variancePct: number;
  unit: "qty" | "rupees" | "pct";
  /** How `expected` was derived -- e.g. "mean of 7 prior business days". */
  expectedBasisNote: string;
  /** Human-readable list of the record groups that prove this. */
  evidence: AnomalyEvidence[];
  /** Deep link into the Data Explorer, pre-filtered to the proving records. */
  drilldownQuery: Record<string, string>;
}
```

#graphify/code #graphify/EXTRACTED #community/Business_Intelligence_Engine