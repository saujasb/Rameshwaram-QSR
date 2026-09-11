---
source_file: "server/src/entities/datasets/coerce.ts"
type: "code"
community: "Dataset Import & Normalization Pipeline"
location: "L47"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Dataset_Import__Normalization_Pipeline
---

# parseTextualDate()

## Connections
- [[coerce.ts]] - `contains` [EXTRACTED]
- [[coerceDateKey()]] - `calls` [EXTRACTED]

## Source
**From** `server/src/entities/datasets/coerce.ts` **(starting line 47):**
```typescript
function parseTextualDate(raw: string): [number, number, number] | null {
  // 16-Aug-2026 / 16 Aug 26 / Aug 16 2026
  const cleaned = raw.replace(/,/g, " ").replace(/\s+/g, " ").trim().toLowerCase();
  let m = cleaned.match(/^(\d{1,2})[\s-]+([a-z]{3,})[\s-]+(\d{2,4})$/);
  if (m) {
    const mi = MONTHS.indexOf(m[2].slice(0, 3));
    if (mi >= 0) {
      const yr = Number(m[3]);
      return [yr < 100 ? 2000 + yr : yr, mi + 1, Number(m[1])];
    }
  }
  m = cleaned.match(/^([a-z]{3,})[\s-]+(\d{1,2})[\s-]+(\d{2,4})$/);
  if (m) {
    const mi = MONTHS.indexOf(m[1].slice(0, 3));
    if (mi >= 0) {
      const yr = Number(m[3]);
      return [yr < 100 ? 2000 + yr : yr, mi + 1, Number(m[2])];
    }
  }
  return null;
}
```

#graphify/code #graphify/EXTRACTED #community/Dataset_Import__Normalization_Pipeline