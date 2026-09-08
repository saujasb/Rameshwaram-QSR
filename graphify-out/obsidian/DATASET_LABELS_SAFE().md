---
source_file: "client/src/modules/intelligence/labels.ts"
type: "code"
community: "Business Intelligence Engine"
location: "L7"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Business_Intelligence_Engine
---

# DATASET_LABELS_SAFE()

## Connections
- [[AnomalyCard()]] - `calls` [EXTRACTED]
- [[IntelligencePage()]] - `calls` [EXTRACTED]
- [[IntelligencePage.tsx]] - `imports` [EXTRACTED]
- [[labels.ts]] - `contains` [EXTRACTED]

## Source
**From** `client/src/modules/intelligence/labels.ts` **(starting line 7):**
```typescript
export function DATASET_LABELS_SAFE(t: DatasetType | string): string {
  return DATASET_LABELS[t as DatasetType] ?? String(t);
}
```

#graphify/code #graphify/EXTRACTED #community/Business_Intelligence_Engine