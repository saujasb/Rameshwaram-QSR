---
source_file: "server/src/entities/ramesh/engine.ts"
type: "code"
community: "Ramesh AI Query Engine"
location: "L51"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Ramesh_AI_Query_Engine
---

# sumExpr()

## Connections
- [[answerTotals()]] - `calls` [EXTRACTED]
- [[engine.ts]] - `contains` [EXTRACTED]

## Source
**From** `server/src/entities/ramesh/engine.ts` **(starting line 51):**
```typescript
function sumExpr(values: number[], fmt: (n: number) => string): string {
  if (values.length === 0) return "0";
  if (values.length === 1) return fmt(values[0]);
  if (values.length <= 8) return values.map(fmt).join(" + ");
  const head = values.slice(0, 3).map(fmt).join(" + ");
  return `${head} + … + ${fmt(values[values.length - 1])} (${values.length} daily subtotals)`;
}
```

#graphify/code #graphify/EXTRACTED #community/Ramesh_AI_Query_Engine