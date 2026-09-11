---
source_file: "server/src/entities/datasets/coerce.ts"
type: "code"
community: "Dataset Import & Normalization Pipeline"
location: "L69"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Dataset_Import__Normalization_Pipeline
---

# validDateParts()

## Connections
- [[coerce.ts]] - `contains` [EXTRACTED]
- [[coerceDateKey()]] - `calls` [EXTRACTED]

## Source
**From** `server/src/entities/datasets/coerce.ts` **(starting line 69):**
```typescript
function validDateParts(y: number, mo: number, d: number): boolean {
  if (!Number.isInteger(y) || !Number.isInteger(mo) || !Number.isInteger(d)) return false;
  if (y < 2000 || y > 2100 || mo < 1 || mo > 12 || d < 1 || d > 31) return false;
  const dt = new Date(y, mo - 1, d);
  return dt.getFullYear() === y && dt.getMonth() === mo - 1 && dt.getDate() === d;
}
```

#graphify/code #graphify/EXTRACTED #community/Dataset_Import__Normalization_Pipeline