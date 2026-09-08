---
source_file: "server/src/entities/datasets/coerce.ts"
type: "code"
community: "Dataset Import & Normalization Pipeline"
location: "L36"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Dataset_Import__Normalization_Pipeline
---

# DATE_PATTERNS

## Connections
- [[coerce.ts]] - `contains` [EXTRACTED]

## Source
**From** `server/src/entities/datasets/coerce.ts` **(starting line 36):**
```typescript
const DATE_PATTERNS: { re: RegExp; build: (m: RegExpMatchArray) => [number, number, number] }[] = [
```

#graphify/code #graphify/EXTRACTED #community/Dataset_Import__Normalization_Pipeline