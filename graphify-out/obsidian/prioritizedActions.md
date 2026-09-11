---
source_file: "server/src/entities/analytics/actions-data.ts"
type: "code"
community: "Veg Indent & Analytics Engine"
location: "L4"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Veg_Indent__Analytics_Engine
---

# prioritizedActions

## Connections
- [[actions-data.ts]] - `contains` [EXTRACTED]
- [[analyticsroutes.ts]] - `imports` [EXTRACTED]

## Source
**From** `server/src/entities/analytics/actions-data.ts` **(starting line 4):**
```typescript
export const prioritizedActions: PrioritizedAction[] = [
  {
    id: "fix-idli-gram-standards",
    severity: "critical",
    title: "Correct the Button Idli / Lemon Idli gram standards in the software",
    detail:
      "Manager-supplied figures (Button Idli 150g/12pcs, Lemon Idli 170g/14pcs) are exactly swapped versus the report's current master data (170g/150g). A one-time item-master fix — high confidence, no judgment call needed.",
    impact: "Fixes 2 lines, every day",
  },
```

#graphify/code #graphify/EXTRACTED #community/Veg_Indent__Analytics_Engine