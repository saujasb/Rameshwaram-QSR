---
source_file: "shared-types/ramesh.ts"
type: "code"
community: "Ramesh AI Query Engine"
location: "L46"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Ramesh_AI_Query_Engine
---

# RameshQuery

## Connections
- [[apiramesh.ts]] - `imports` [EXTRACTED]
- [[engine.ts]] - `imports` [EXTRACTED]
- [[rameshroutes.ts]] - `imports` [EXTRACTED]
- [[shared-typesramesh.ts]] - `contains` [EXTRACTED]

## Source
**From** `shared-types/ramesh.ts` **(starting line 46):**
```typescript
export interface RameshQuery {
  question: string;
  /** Dashboard filter context, so Ramesh answers within what the user is looking at. */
  context?: {
    from?: string;
    to?: string;
    product?: string;
    outlet?: string;
    shift?: string;
  };
}
```

#graphify/code #graphify/EXTRACTED #community/Ramesh_AI_Query_Engine