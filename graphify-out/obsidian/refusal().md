---
source_file: "server/src/entities/ramesh/intents.ts"
type: "code"
community: "Ramesh Intent Classification"
location: "L305"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Ramesh_Intent_Classification
---

# refusal()

## Connections
- [[classify()]] - `calls` [EXTRACTED]
- [[intents.ts]] - `contains` [EXTRACTED]

## Source
**From** `server/src/entities/ramesh/intents.ts` **(starting line 305):**
```typescript
function refusal(injection: boolean): RameshClassification {
  return { intent: "off_topic", slots: { injection } };
}
```

#graphify/code #graphify/EXTRACTED #community/Ramesh_Intent_Classification