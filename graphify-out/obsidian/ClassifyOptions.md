---
source_file: "server/src/entities/ramesh/intents.ts"
type: "code"
community: "Ramesh Intent Classification"
location: "L42"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Ramesh_Intent_Classification
---

# ClassifyOptions

## Connections
- [[intents.ts]] - `contains` [EXTRACTED]

## Source
**From** `server/src/entities/ramesh/intents.ts` **(starting line 42):**
```typescript
export interface ClassifyOptions {
  knownProducts?: string[];
  knownOutlets?: string[];
  knownShifts?: string[];
  startHour?: number;
}
```

#graphify/code #graphify/EXTRACTED #community/Ramesh_Intent_Classification