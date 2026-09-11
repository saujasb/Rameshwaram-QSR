---
source_file: "server/src/entities/ramesh/intents.ts"
type: "code"
community: "Ramesh Intent Classification"
location: "L253"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Ramesh_Intent_Classification
---

# norm()

## Connections
- [[intents.ts]] - `contains` [EXTRACTED]
- [[matchDimension()]] - `calls` [EXTRACTED]
- [[matchProduct()]] - `calls` [EXTRACTED]

## Source
**From** `server/src/entities/ramesh/intents.ts` **(starting line 253):**
```typescript
function norm(s: string): string {
  return s.trim().toLowerCase().replace(/\s+/g, " ");
}
```

#graphify/code #graphify/EXTRACTED #community/Ramesh_Intent_Classification