---
source_file: "server/src/entities/ramesh/intents.ts"
type: "code"
community: "Ramesh AI Query Engine"
location: "L15"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Ramesh_AI_Query_Engine
---

# RameshSlots

## Connections
- [[Ctx]] - `references` [EXTRACTED]
- [[DatasetType]] - `references` [EXTRACTED]
- [[engine.ts]] - `imports` [EXTRACTED]
- [[intents.ts]] - `contains` [EXTRACTED]

## Source
**From** `server/src/entities/ramesh/intents.ts` **(starting line 15):**
```typescript
export interface RameshSlots {
  from?: string;
  to?: string;
  /** Human label for the resolved range, e.g. "13 Aug 2026" or "the last 7 business days". */
  dateLabel?: string;
  /** Two explicit dates, when the question asks for a date-vs-date comparison. */
  dates?: string[];
  datasetType?: DatasetType;
  /** Every dataset word the question mentioned, in order of first appearance. */
  datasetTypes?: DatasetType[];
  /** Exact product name, matched against the imported product list. */
  product?: string;
  /** Partial product term (matched more than one product) -- becomes a LIKE search. */
  productTerm?: string;
  outlet?: string;
  shift?: string;
  direction?: "highest" | "lowest";
  wantsWhy?: boolean;
  /** True when the question tried to override Ramesh's instructions. */
  injection?: boolean;
}
```

#graphify/code #graphify/EXTRACTED #community/Ramesh_AI_Query_Engine