---
source_file: "server/src/entities/ramesh/intents.ts"
type: "code"
community: "Ramesh Intent Classification"
location: "L187"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Ramesh_Intent_Classification
---

# monthBounds()

## Connections
- [[intents.ts]] - `contains` [EXTRACTED]
- [[makeKey()]] - `calls` [EXTRACTED]
- [[relativeRange()]] - `calls` [EXTRACTED]

## Source
**From** `server/src/entities/ramesh/intents.ts` **(starting line 187):**
```typescript
function monthBounds(dateKey: string, monthsBack: number): { from: string; to: string } {
  const y = Number(dateKey.slice(0, 4));
  const m = Number(dateKey.slice(5, 7));
  const target = new Date(y, m - 1 - monthsBack, 1);
  const from = makeKey(target.getFullYear(), target.getMonth() + 1, 1)!;
  const last = new Date(target.getFullYear(), target.getMonth() + 1, 0);
  const to = makeKey(last.getFullYear(), last.getMonth() + 1, last.getDate())!;
  return { from, to };
}
```

#graphify/code #graphify/EXTRACTED #community/Ramesh_Intent_Classification