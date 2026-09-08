---
source_file: "server/src/index.ts"
type: "code"
community: "Generic CRUD Backend"
location: "L24"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Generic_CRUD_Backend
---

# allowedOrigins

## Connections
- [[index.ts]] - `contains` [EXTRACTED]

## Source
**From** `server/src/index.ts` **(starting line 24):**
```typescript
const allowedOrigins = process.env.CLIENT_ORIGIN?.split(",").map((o) => o.trim());

const app = express();
app.use(cors({ origin: allowedOrigins ?? true }));
```

#graphify/code #graphify/EXTRACTED #community/Generic_CRUD_Backend