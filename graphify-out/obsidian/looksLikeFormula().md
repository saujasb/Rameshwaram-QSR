---
source_file: "server/src/entities/datasets/coerce.ts"
type: "code"
community: "Dataset Import & Normalization Pipeline"
location: "L241"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Dataset_Import__Normalization_Pipeline
---

# looksLikeFormula()

## Connections
- [[coerce.ts]] - `contains` [EXTRACTED]
- [[excel.ts]] - `imports` [EXTRACTED]
- [[extractRows()]] - `calls` [EXTRACTED]

## Source
**From** `server/src/entities/datasets/coerce.ts` **(starting line 241):**
```typescript
export function looksLikeFormula(value: unknown): boolean {
  if (value == null) return false;
  const raw = String(value);
  return /^[=+@]/.test(raw.trim()) && /[a-zA-Z(]/.test(raw);
}
```

#graphify/code #graphify/EXTRACTED #community/Dataset_Import__Normalization_Pipeline