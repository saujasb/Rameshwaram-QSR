---
source_file: "server/src/entities/datasets/repository.ts"
type: "code"
community: "Ramesh AI Query Engine"
location: "L32"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Ramesh_AI_Query_Engine
---

# findByFingerprint

## Connections
- [[datasetsrepository.ts]] - `contains` [EXTRACTED]

## Source
**From** `server/src/entities/datasets/repository.ts` **(starting line 32):**
```typescript
const findByFingerprint = db.prepare(`SELECT id, quantity, salesValue FROM dataset_records WHERE fingerprint = ?`);
```

#graphify/code #graphify/EXTRACTED #community/Ramesh_AI_Query_Engine