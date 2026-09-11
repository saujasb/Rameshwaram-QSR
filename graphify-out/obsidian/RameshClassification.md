---
source_file: "server/src/entities/ramesh/intents.ts"
type: "code"
community: "Ramesh AI Query Engine"
location: "L37"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Ramesh_AI_Query_Engine
---

# RameshClassification

## Connections
- [[RameshIntent]] - `references` [EXTRACTED]
- [[intents.ts]] - `contains` [EXTRACTED]

## Source
**From** `server/src/entities/ramesh/intents.ts` **(starting line 37):**
```typescript
export interface RameshClassification {
  intent: RameshIntent;
  slots: RameshSlots;
}
```

#graphify/code #graphify/EXTRACTED #community/Ramesh_AI_Query_Engine