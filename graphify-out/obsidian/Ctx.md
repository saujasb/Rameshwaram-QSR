---
source_file: "server/src/entities/ramesh/engine.ts"
type: "code"
community: "Ramesh AI Query Engine"
location: "L147"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Ramesh_AI_Query_Engine
---

# Ctx

## Connections
- [[DatasetCoverage]] - `references` [EXTRACTED]
- [[DatasetFilter]] - `references` [EXTRACTED]
- [[RameshIntent]] - `references` [EXTRACTED]
- [[RameshSlots]] - `references` [EXTRACTED]
- [[engine.ts]] - `contains` [EXTRACTED]

## Source
**From** `server/src/entities/ramesh/engine.ts` **(starting line 147):**
```typescript
interface Ctx {
  question: string;
  intent: RameshIntent;
  slots: RameshSlots;
  base: DatasetFilter;
  coverage: DatasetCoverage[];
  suggestions: string[];
}
```

#graphify/code #graphify/EXTRACTED #community/Ramesh_AI_Query_Engine