---
source_file: "server/src/entities/ramesh/intents.ts"
type: "code"
community: "Ramesh Intent Classification"
location: "L284"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Ramesh_Intent_Classification
---

# matchDimension()

## Connections
- [[classify()]] - `calls` [EXTRACTED]
- [[intents.ts]] - `contains` [EXTRACTED]
- [[norm()]] - `calls` [EXTRACTED]

## Source
**From** `server/src/entities/ramesh/intents.ts` **(starting line 284):**
```typescript
function matchDimension(q: string, values: string[]): string | undefined {
  const nq = norm(q);
  for (const v of [...values].sort((a, b) => b.length - a.length)) {
    const nv = norm(v);
    if (nv.length >= 3 && nq.includes(nv)) return v;
  }
  return undefined;
}
```

#graphify/code #graphify/EXTRACTED #community/Ramesh_Intent_Classification