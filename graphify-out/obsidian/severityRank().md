---
source_file: "server/src/entities/datasets/normalize.ts"
type: "code"
community: "Dataset Import & Normalization Pipeline"
location: "L252"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Dataset_Import__Normalization_Pipeline
---

# severityRank()

## Connections
- [[normalize.ts]] - `contains` [EXTRACTED]
- [[scoreQuality()]] - `calls` [EXTRACTED]

## Source
**From** `server/src/entities/datasets/normalize.ts` **(starting line 252):**
```typescript
function severityRank(s: QualityIssue["severity"]): number {
  return s === "error" ? 0 : s === "warning" ? 1 : 2;
}
```

#graphify/code #graphify/EXTRACTED #community/Dataset_Import__Normalization_Pipeline