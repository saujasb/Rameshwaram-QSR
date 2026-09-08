---
source_file: "server/src/entities/ramesh/engine.ts"
type: "code"
community: "Ramesh AI Query Engine"
location: "L188"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Ramesh_AI_Query_Engine
---

# missingDataset()

## Connections
- [[answerCompareDates()]] - `calls` [EXTRACTED]
- [[answerRanked()]] - `calls` [EXTRACTED]
- [[answerSeries()]] - `calls` [EXTRACTED]
- [[answerTotals()]] - `calls` [EXTRACTED]
- [[answerVariance()]] - `calls` [EXTRACTED]
- [[answerWastageReason()]] - `calls` [EXTRACTED]
- [[engine.ts]] - `contains` [EXTRACTED]
- [[insufficient()]] - `calls` [EXTRACTED]

## Source
**From** `server/src/entities/ramesh/engine.ts` **(starting line 188):**
```typescript
function missingDataset(c: Ctx, type: DatasetType, why: string): RameshAnswer {
  const label = DATASET_LABELS[type].toLowerCase();
  const have = c.coverage.filter((x) => x.recordCount > 0).map((x) => DATASET_LABELS[x.datasetType].toLowerCase());
  const haveNote = have.length
    ? `So far only ${have.join(" and ")} data has been imported.`
    : "No files have been imported yet.";
  return insufficient(
    c,
    `I have no ${label} records at all, so I can't answer that. ${why}`,
    `${haveNote} Import a ${label} report (PDF or Excel) on the Import screen and ask again — I'll compute it from those rows.`
  );
}
```

#graphify/code #graphify/EXTRACTED #community/Ramesh_AI_Query_Engine