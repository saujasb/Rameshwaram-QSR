---
source_file: "shared-types/intelligence.ts"
type: "code"
community: "Data Explorer & Import UI"
location: "L148"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Data_Explorer__Import_UI
---

# HourlyBucket

## Connections
- [[DatasetSummary]] - `references` [EXTRACTED]
- [[apidatasets.ts]] - `imports` [EXTRACTED]
- [[datasetsrepository.ts]] - `imports` [EXTRACTED]
- [[shared-typesintelligence.ts]] - `contains` [EXTRACTED]

## Source
**From** `shared-types/intelligence.ts` **(starting line 148):**
```typescript
export interface HourlyBucket {
  /** Raw clock hour 0-23, exactly as on the transaction. */
  hour: number;
  label: string;
  /** Position within the trading window, 0 = business-day start. Ordering key. */
  slot: number;
  /** True for buckets after midnight -- rendered distinctly, same business day. */
  isAfterMidnight: boolean;
  salesValue: number;
  salesQty: number;
  productionQty: number;
  wastageQty: number;
  recordCount: number;
}
```

#graphify/code #graphify/EXTRACTED #community/Data_Explorer__Import_UI