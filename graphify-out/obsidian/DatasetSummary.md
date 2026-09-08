---
source_file: "client/src/lib/api/datasets.ts"
type: "code"
community: "Data Explorer & Import UI"
location: "L14"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Data_Explorer__Import_UI
---

# DatasetSummary

## Connections
- [[HourlyBucket]] - `references` [EXTRACTED]
- [[apidatasets.ts]] - `contains` [EXTRACTED]

## Source
**From** `client/src/lib/api/datasets.ts` **(starting line 14):**
```typescript
export interface DatasetSummary {
  totals: { quantity: number; value: number; recordCount: number };
  daily: { businessDate: string; quantity: number; value: number }[];
  topProducts: { product: string; category: string | null; quantity: number; value: number }[];
  categories: { category: string; quantity: number; value: number }[];
  channels: { channel: string; quantity: number; value: number }[];
  hourly: HourlyBucket[];
  wastageReasons: { reason: string; quantity: number; recordCount: number }[];
}
```

#graphify/code #graphify/EXTRACTED #community/Data_Explorer__Import_UI