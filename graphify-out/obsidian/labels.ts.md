---
source_file: "client/src/modules/intelligence/labels.ts"
type: "code"
community: "Business Intelligence Engine"
location: "L1"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Business_Intelligence_Engine
---

# labels.ts

## Connections
- [[ANOMALY_KIND_LABELS]] - `imports` [EXTRACTED]
- [[DATASET_LABELS]] - `imports` [EXTRACTED]
- [[DATASET_LABELS_SAFE()]] - `contains` [EXTRACTED]
- [[DatasetType]] - `imports` [EXTRACTED]
- [[IntelligencePage.tsx]] - `imports_from` [EXTRACTED]
- [[shared-typesdatasets.ts]] - `imports_from` [EXTRACTED]
- [[shared-typesintelligence.ts]] - `re_exports` [EXTRACTED]

## Source
**Full file:** `client/src/modules/intelligence/labels.ts`
```typescript
import { ANOMALY_KIND_LABELS } from "@shared/intelligence";
import { DATASET_LABELS, type DatasetType } from "@shared/datasets";

export { ANOMALY_KIND_LABELS };

/** Tolerates an unexpected dataset value from the API rather than rendering "undefined". */
export function DATASET_LABELS_SAFE(t: DatasetType | string): string {
  return DATASET_LABELS[t as DatasetType] ?? String(t);
}
```

#graphify/code #graphify/EXTRACTED #community/Business_Intelligence_Engine