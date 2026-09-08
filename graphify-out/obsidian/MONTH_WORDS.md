---
source_file: "server/src/entities/ramesh/intents.ts"
type: "code"
community: "Ramesh Intent Classification"
location: "L135"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Ramesh_Intent_Classification
---

# MONTH_WORDS

## Connections
- [[intents.ts]] - `contains` [EXTRACTED]

## Source
**From** `server/src/entities/ramesh/intents.ts` **(starting line 135):**
```typescript
const MONTH_WORDS = Object.keys(MONTHS).sort((a, b) => b.length - a.length).join("|");

function pad2(n: number): string {
  return n < 10 ? `0${n}` : String(n);
}
```

#graphify/code #graphify/EXTRACTED #community/Ramesh_Intent_Classification