---
source_file: "server/src/shared/actionCenter.ts"
type: "code"
community: "Generic CRUD Backend"
location: "L166"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Generic_CRUD_Backend
---

# actionCenterRouter

## Connections
- [[index.ts]] - `imports` [EXTRACTED]
- [[sharedactionCenter.ts]] - `contains` [EXTRACTED]

## Source
**From** `server/src/shared/actionCenter.ts` **(starting line 166):**
```typescript
export const actionCenterRouter: Router = Router();

actionCenterRouter.get("/", (_req, res) => {
  res.json(buildActionCenter());
});
```

#graphify/code #graphify/EXTRACTED #community/Generic_CRUD_Backend