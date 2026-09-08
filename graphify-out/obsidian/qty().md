---
source_file: "server/src/entities/ramesh/engine.ts"
type: "code"
community: "Ramesh AI Query Engine"
location: "L46"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Ramesh_AI_Query_Engine
---

# qty()

## Connections
- [[answerCompareDatasets()]] - `calls` [EXTRACTED]
- [[answerTotals()]] - `indirect_call` [INFERRED]
- [[answerVariance()]] - `calls` [EXTRACTED]
- [[answerWastageReason()]] - `calls` [EXTRACTED]
- [[engine.ts]] - `contains` [EXTRACTED]

## Source
**From** `server/src/entities/ramesh/engine.ts` **(starting line 46):**
```typescript
const qty = (n: number): string => NUM.format(n);
const units = (n: number): string => `${NUM.format(n)} units`;
```

#graphify/code #graphify/EXTRACTED #community/Ramesh_AI_Query_Engine