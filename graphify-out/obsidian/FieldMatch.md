---
source_file: "server/src/entities/datasets/columnMap.ts"
type: "code"
community: "Dataset Import & Normalization Pipeline"
location: "L57"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Dataset_Import__Normalization_Pipeline
---

# FieldMatch

## Connections
- [[ColumnMapping]] - `references` [EXTRACTED]
- [[columnMap.ts]] - `contains` [EXTRACTED]

## Source
**From** `server/src/entities/datasets/columnMap.ts` **(starting line 57):**
```typescript
interface FieldMatch {
  index: number | null;
  sourceColumn: string | null;
  confidence: number;
  matchedBy: ColumnMapping["matchedBy"];
}
```

#graphify/code #graphify/EXTRACTED #community/Dataset_Import__Normalization_Pipeline