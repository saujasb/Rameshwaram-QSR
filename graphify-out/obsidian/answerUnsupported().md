---
source_file: "server/src/entities/ramesh/engine.ts"
type: "code"
community: "Ramesh AI Query Engine"
location: "L767"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Ramesh_AI_Query_Engine
---

# answerUnsupported()

## Connections
- [[answer()]] - `calls` [EXTRACTED]
- [[engine.ts]] - `contains` [EXTRACTED]
- [[shell()]] - `calls` [EXTRACTED]

## Source
**From** `server/src/entities/ramesh/engine.ts` **(starting line 767):**
```typescript
function answerUnsupported(c: Ctx): RameshAnswer {
  return shell(c, {
    answer:
      "I could not map that to a calculation I can run over the imported records. I work from sales, production and wastage rows, so try naming a metric (total, highest, lowest, trend, variance, wastage reason) and a business day or product.",
    conclusion: "Ask one of the questions below and I will answer it from the data that is actually loaded.",
  });
}
```

#graphify/code #graphify/EXTRACTED #community/Ramesh_AI_Query_Engine