---
source_file: "server/src/entities/datasets/coerce.ts"
type: "code"
community: "Dataset Import & Normalization Pipeline"
location: "L247"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Dataset_Import__Normalization_Pipeline
---

# productKeyOf()

## Connections
- [[buildRecord()]] - `calls` [EXTRACTED]
- [[coerce.ts]] - `contains` [EXTRACTED]
- [[normalize.ts]] - `imports` [EXTRACTED]

## Source
**From** `server/src/entities/datasets/coerce.ts` **(starting line 247):**
```typescript
export function productKeyOf(product: string): string {
  return product.trim().toLowerCase().replace(/\s+/g, " ");
}
```

#graphify/code #graphify/EXTRACTED #community/Dataset_Import__Normalization_Pipeline