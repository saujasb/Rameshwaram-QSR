---
source_file: "server/src/entities/ramesh/engine.ts"
type: "code"
community: "Ramesh AI Query Engine"
location: "L45"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Ramesh_AI_Query_Engine
---

# money()

## Connections
- [[answerTotals()]] - `indirect_call` [INFERRED]
- [[engine.ts]] - `contains` [EXTRACTED]

## Source
**From** `server/src/entities/ramesh/engine.ts` **(starting line 45):**
```typescript
const money = (n: number): string => `₹${INR.format(Math.round(n))}`;
```

#graphify/code #graphify/EXTRACTED #community/Ramesh_AI_Query_Engine