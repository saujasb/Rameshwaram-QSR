---
source_file: "server/src/entities/ramesh/engine.ts"
type: "code"
community: "Ramesh AI Query Engine"
location: "L201"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Ramesh_AI_Query_Engine
---

# noMatch()

## Connections
- [[answerCompareDatasets()]] - `calls` [EXTRACTED]
- [[answerRanked()]] - `calls` [EXTRACTED]
- [[answerTotals()]] - `calls` [EXTRACTED]
- [[answerVariance()]] - `calls` [EXTRACTED]
- [[answerWastageReason()]] - `calls` [EXTRACTED]
- [[engine.ts]] - `contains` [EXTRACTED]
- [[formatBusinessDateLong()]] - `calls` [EXTRACTED]
- [[insufficient()]] - `calls` [EXTRACTED]
- [[latestBusinessDate()]] - `calls` [EXTRACTED]
- [[rangeLabel()]] - `calls` [EXTRACTED]
- [[scopeNote()]] - `calls` [EXTRACTED]

## Source
**From** `server/src/entities/ramesh/engine.ts` **(starting line 201):**
```typescript
function noMatch(c: Ctx, types: DatasetType[], filter: DatasetFilter): RameshAnswer {
  const labels = types.map((t) => DATASET_LABELS[t].toLowerCase()).join("/");
  const where = rangeLabel(filter.from, filter.to);
  const latest = latestBusinessDate(types.length === 1 ? types[0] : undefined);
  const hint = latest
    ? `The most recent business day I hold ${labels} data for is ${formatBusinessDateLong(latest)}.`
    : `No ${labels} records have been imported yet.`;
  return insufficient(
    c,
    `No ${labels} records match ${where}${scopeNote(filter)}, so there is nothing for me to total.`,
    `${hint} Import the report for the day you asked about, or ask about a business day that is already loaded.`,
    filter,
    types.length === 1 ? types[0] : undefined
  );
}
```

#graphify/code #graphify/EXTRACTED #community/Ramesh_AI_Query_Engine