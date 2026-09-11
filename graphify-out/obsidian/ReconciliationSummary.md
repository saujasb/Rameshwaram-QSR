---
source_file: "shared-types/intelligence.ts"
type: "code"
community: "Business Intelligence Engine"
location: "L38"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Business_Intelligence_Engine
---

# ReconciliationSummary

## Connections
- [[DatasetType]] - `references` [EXTRACTED]
- [[apiintelligence.ts]] - `imports` [EXTRACTED]
- [[reconciliation.ts]] - `imports` [EXTRACTED]
- [[shared-typesintelligence.ts]] - `contains` [EXTRACTED]

## Source
**From** `shared-types/intelligence.ts` **(starting line 38):**
```typescript
export interface ReconciliationSummary {
  businessDateFrom: string | null;
  businessDateTo: string | null;
  rows: ReconciliationRow[];
  totals: ReconciliationRow | null;
  /** Which datasets were actually present -- drives "Insufficient data" messaging. */
  availableDatasets: DatasetType[];
  missingDatasets: DatasetType[];
}
```

#graphify/code #graphify/EXTRACTED #community/Business_Intelligence_Engine