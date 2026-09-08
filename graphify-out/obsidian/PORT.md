---
source_file: "server/src/index.ts"
type: "code"
community: "Generic CRUD Backend"
location: "L55"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Generic_CRUD_Backend
---

# PORT

## Connections
- [[index.ts]] - `contains` [EXTRACTED]

## Source
**From** `server/src/index.ts` **(starting line 55):**
```typescript
const PORT = Number(process.env.PORT ?? 4300);
app.listen(PORT, () => {
  console.log(`[server] listening on http://localhost:${PORT}`);
});
```

#graphify/code #graphify/EXTRACTED #community/Generic_CRUD_Backend