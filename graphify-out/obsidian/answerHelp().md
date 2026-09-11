---
source_file: "server/src/entities/ramesh/engine.ts"
type: "code"
community: "Ramesh AI Query Engine"
location: "L758"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Ramesh_AI_Query_Engine
---

# answerHelp()

## Connections
- [[answer()]] - `calls` [EXTRACTED]
- [[engine.ts]] - `contains` [EXTRACTED]
- [[shell()]] - `calls` [EXTRACTED]

## Source
**From** `server/src/entities/ramesh/engine.ts` **(starting line 758):**
```typescript
function answerHelp(c: Ctx): RameshAnswer {
  return shell(c, {
    answer:
      "I answer questions about the sales, production and wastage records imported into this dashboard. Ask me for totals, the best or worst performing product, peak hour, day-vs-day comparisons, wastage reasons, production variance or a trend — and I will show the arithmetic I used.",
    conclusion:
      "I compute every figure from the imported rows, so the same question always gives the same answer. When the data needed is missing I say so instead of estimating, and I cannot answer anything outside this business's data.",
  });
}
```

#graphify/code #graphify/EXTRACTED #community/Ramesh_AI_Query_Engine