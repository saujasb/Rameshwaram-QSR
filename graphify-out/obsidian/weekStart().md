---
source_file: "server/src/entities/ramesh/intents.ts"
type: "code"
community: "Ramesh Intent Classification"
location: "L197"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Ramesh_Intent_Classification
---

# weekStart()

## Connections
- [[intents.ts]] - `contains` [EXTRACTED]
- [[relativeRange()]] - `calls` [EXTRACTED]
- [[shiftDateKey()]] - `calls` [EXTRACTED]

## Source
**From** `server/src/entities/ramesh/intents.ts` **(starting line 197):**
```typescript
function weekStart(dateKey: string): string {
  const [y, m, d] = dateKey.split("-").map(Number);
  const dow = new Date(y, m - 1, d).getDay(); // 0 = Sunday
  return shiftDateKey(dateKey, -((dow + 6) % 7));
}
```

#graphify/code #graphify/EXTRACTED #community/Ramesh_Intent_Classification