---
source_file: "shared-types/entities.ts"
type: "code"
community: "Action Center UI"
location: "L219"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Action_Center_UI
---

# ActionCenterItem

## Connections
- [[ActionCenterPage.tsx]] - `imports` [EXTRACTED]
- [[apiactionCenter.ts]] - `imports` [EXTRACTED]
- [[entities.ts]] - `contains` [EXTRACTED]
- [[sharedactionCenter.ts]] - `imports` [EXTRACTED]

## Source
**From** `shared-types/entities.ts` **(starting line 219):**
```typescript
export interface ActionCenterItem {
  id: string;
  severity: "critical" | "attention" | "completed";
  title: string;
  detail: string;
  module: string;
  linkPath: string;
  timestamp: string;
}
```

#graphify/code #graphify/EXTRACTED #community/Action_Center_UI