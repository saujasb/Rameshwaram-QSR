---
source_file: "server/src/entities/analytics/routes.ts"
type: "code"
community: "Veg Indent & Analytics Engine"
location: "L5"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Veg_Indent__Analytics_Engine
---

# analyticsRouter

## Connections
- [[analyticsroutes.ts]] - `contains` [EXTRACTED]
- [[index.ts]] - `imports` [EXTRACTED]

## Source
**From** `server/src/entities/analytics/routes.ts` **(starting line 5):**
```typescript
export const analyticsRouter: Router = Router();

analyticsRouter.get("/snapshot", (_req, res) => {
  res.json(analyticsSnapshot);
});
```

#graphify/code #graphify/EXTRACTED #community/Veg_Indent__Analytics_Engine