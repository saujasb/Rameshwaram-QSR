---
source_file: "server/src/entities/ramesh/intents.ts"
type: "code"
community: "Ramesh Intent Classification"
location: "L137"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Ramesh_Intent_Classification
---

# pad2()

## Connections
- [[intents.ts]] - `contains` [EXTRACTED]
- [[makeKey()]] - `calls` [EXTRACTED]

## Source
**From** `server/src/entities/ramesh/intents.ts` **(starting line 137):**
```typescript
function pad2(n: number): string {
  return n < 10 ? `0${n}` : String(n);
}
```

#graphify/code #graphify/EXTRACTED #community/Ramesh_Intent_Classification