---
source_file: "server/src/entities/datasets/columnMap.ts"
type: "code"
community: "Dataset Import & Normalization Pipeline"
location: "L46"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Dataset_Import__Normalization_Pipeline
---

# canonical()

## Connections
- [[columnMap.ts]] - `contains` [EXTRACTED]
- [[detectDatasetType()]] - `indirect_call` [INFERRED]
- [[findHeaderRow()]] - `calls` [EXTRACTED]
- [[matchField()]] - `indirect_call` [INFERRED]

## Source
**From** `server/src/entities/datasets/columnMap.ts` **(starting line 46):**
```typescript
export function canonical(header: string): string {
  return String(header ?? "")
    .toLowerCase()
    .replace(/[₹$]/g, "")
    .replace(/[_\-./\\]+/g, " ")
    .replace(/\((.*?)\)/g, " $1 ")
    .replace(/[^a-z0-9 ]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
```

#graphify/code #graphify/EXTRACTED #community/Dataset_Import__Normalization_Pipeline