---
source_file: "server/src/db/client.ts"
type: "code"
community: "Generic CRUD Backend"
location: "L6"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Generic_CRUD_Backend
---

# __dirname

## Connections
- [[dbclient.ts]] - `contains` [EXTRACTED]

## Source
**From** `server/src/db/client.ts` **(starting line 6):**
```typescript
const __dirname = dirname(fileURLToPath(import.meta.url));
const dataDir = process.env.DATA_DIR ?? join(__dirname, "..", "..", "data");
mkdirSync(dataDir, { recursive: true });
```

#graphify/code #graphify/EXTRACTED #community/Generic_CRUD_Backend