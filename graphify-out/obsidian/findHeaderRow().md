---
source_file: "server/src/entities/datasets/columnMap.ts"
type: "code"
community: "Dataset Import & Normalization Pipeline"
location: "L175"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Dataset_Import__Normalization_Pipeline
---

# findHeaderRow()

## Connections
- [[canonical()]] - `calls` [EXTRACTED]
- [[columnMap.ts]] - `contains` [EXTRACTED]
- [[excel.ts]] - `imports` [EXTRACTED]
- [[parseWorkbook()]] - `calls` [EXTRACTED]

## Source
**From** `server/src/entities/datasets/columnMap.ts` **(starting line 175):**
```typescript
export function findHeaderRow(rows: unknown[][], maxScan = 12): number {
  let bestRow = 0;
  let bestScore = -1;
  const allAliases = new Set(Object.values(ALIASES).flat());

  for (let r = 0; r < Math.min(rows.length, maxScan); r++) {
    const cells = (rows[r] ?? []).map((c) => canonical(String(c ?? "")));
    const nonEmpty = cells.filter(Boolean).length;
    if (nonEmpty < 2) continue;
    let score = 0;
    for (const cell of cells) {
      if (!cell) continue;
      if (allAliases.has(cell)) score += 2;
      else if ([...allAliases].some((a) => new RegExp(`\\b${a.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`).test(cell))) score += 1;
    }
    if (score > bestScore) {
      bestScore = score;
      bestRow = r;
    }
  }
  return bestScore <= 0 ? 0 : bestRow;
}
```

#graphify/code #graphify/EXTRACTED #community/Dataset_Import__Normalization_Pipeline