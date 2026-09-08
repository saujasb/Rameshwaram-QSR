---
source_file: "server/src/entities/intelligence/reconciliation.ts"
type: "code"
community: "Business Intelligence Engine"
location: "L76"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Business_Intelligence_Engine
---

# missingNames()

## Connections
- [[buildRow()]] - `calls` [EXTRACTED]
- [[reconciliation.ts]] - `contains` [EXTRACTED]

## Source
**From** `server/src/entities/intelligence/reconciliation.ts` **(starting line 76):**
```typescript
function missingNames(facts: FactsByType, needed: DatasetType[]): string[] {
  return needed.filter((t) => !facts[t].present).map((t) => DATASET_LABELS[t].toLowerCase());
}
```

#graphify/code #graphify/EXTRACTED #community/Business_Intelligence_Engine