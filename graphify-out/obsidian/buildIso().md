---
source_file: "server/src/entities/datasets/coerce.ts"
type: "code"
community: "Dataset Import & Normalization Pipeline"
location: "L193"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Dataset_Import__Normalization_Pipeline
---

# buildIso()

## Connections
- [[coerce.ts]] - `contains` [EXTRACTED]
- [[coerceTimestamp()]] - `calls` [EXTRACTED]
- [[localIso()]] - `calls` [EXTRACTED]
- [[toDateKey()]] - `calls` [EXTRACTED]

## Source
**From** `server/src/entities/datasets/coerce.ts` **(starting line 193):**
```typescript
function buildIso(dateKey: string, t: { h: number; m: number; s: number }) {
  const [y, mo, d] = dateKey.split("-").map(Number);
  const dt = new Date(y, mo - 1, d, t.h, t.m, t.s);
  return { iso: localIso(dt), dateKey: toDateKey(dt), hour: dt.getHours() };
}
```

#graphify/code #graphify/EXTRACTED #community/Dataset_Import__Normalization_Pipeline