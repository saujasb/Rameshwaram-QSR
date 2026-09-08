---
source_file: "server/src/entities/ramesh/engine.ts"
type: "code"
community: "Ramesh AI Query Engine"
location: "L912"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Ramesh_AI_Query_Engine
---

# productFocus()

## Connections
- [[answer()]] - `calls` [EXTRACTED]
- [[engine.ts]] - `contains` [EXTRACTED]

## Source
**From** `server/src/entities/ramesh/engine.ts` **(starting line 912):**
```typescript
function productFocus(slots: RameshSlots): "overproduced" | "wastage" | "revenue" {
  if (slots.datasetType === "production" || slots.datasetTypes?.includes("production")) return "overproduced";
  if (slots.datasetType === "wastage" || slots.datasetTypes?.includes("wastage")) return "wastage";
  return "revenue";
}
```

#graphify/code #graphify/EXTRACTED #community/Ramesh_AI_Query_Engine