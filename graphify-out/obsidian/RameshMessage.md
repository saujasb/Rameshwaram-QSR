---
source_file: "shared-types/ramesh.ts"
type: "code"
community: "Ramesh Chat Widget"
location: "L119"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Ramesh_Chat_Widget
---

# RameshMessage

## Connections
- [[RameshWidget.tsx]] - `imports` [EXTRACTED]
- [[shared-typesramesh.ts]] - `contains` [EXTRACTED]

## Source
**From** `shared-types/ramesh.ts` **(starting line 119):**
```typescript
export interface RameshMessage {
  id: string;
  role: "user" | "ramesh";
  text: string;
  answer?: RameshAnswer;
  timestamp: string;
}
```

#graphify/code #graphify/EXTRACTED #community/Ramesh_Chat_Widget