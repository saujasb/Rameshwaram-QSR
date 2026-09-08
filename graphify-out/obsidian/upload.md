---
source_file: "server/src/entities/datasets/routes.ts"
type: "code"
community: "Ramesh AI Query Engine"
location: "L26"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Ramesh_AI_Query_Engine
---

# upload

## Connections
- [[datasetsroutes.ts]] - `contains` [EXTRACTED]

## Source
**From** `server/src/entities/datasets/routes.ts` **(starting line 26):**
```typescript
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_UPLOAD_BYTES, files: 6 },
});
```

#graphify/code #graphify/EXTRACTED #community/Ramesh_AI_Query_Engine