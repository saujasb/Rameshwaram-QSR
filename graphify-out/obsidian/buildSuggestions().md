---
source_file: "server/src/entities/ramesh/engine.ts"
type: "code"
community: "Ramesh AI Query Engine"
location: "L112"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Ramesh_AI_Query_Engine
---

# buildSuggestions()

## Connections
- [[answer()]] - `calls` [EXTRACTED]
- [[engine.ts]] - `contains` [EXTRACTED]
- [[formatBusinessDateLong()]] - `calls` [EXTRACTED]
- [[suggestionsForCurrentData()]] - `calls` [EXTRACTED]
- [[topProducts()]] - `calls` [EXTRACTED]

## Source
**From** `server/src/entities/ramesh/engine.ts` **(starting line 112):**
```typescript
function buildSuggestions(question: string, coverage: DatasetCoverage[]): string[] {
  const pool: string[] = [];
  const sales = coverage.find((c) => c.datasetType === "sales");
  const production = coverage.find((c) => c.datasetType === "production");
  const wastage = coverage.find((c) => c.datasetType === "wastage");

  if (sales && sales.recordCount > 0 && sales.businessDateTo) {
    const day = formatBusinessDateLong(sales.businessDateTo);
    pool.push(`What were total sales on ${day}?`);
    pool.push(`Which product sold the most on ${day}?`);
    const top = topProducts({ datasetType: "sales", from: sales.businessDateTo, to: sales.businessDateTo }, 1);
    if (top[0]) pool.push(`How much ${top[0].product} did we sell on ${day}?`);
    pool.push(`Which product sold the least on ${day}?`);
    if (sales.businessDateFrom && sales.businessDateFrom !== sales.businessDateTo) {
      pool.push(`How did sales trend from ${formatBusinessDateLong(sales.businessDateFrom)} to ${day}?`);
    }
  }
  if (wastage && wastage.recordCount > 0) pool.push("Which product had the highest wastage?");
  if (production && production.recordCount > 0 && sales && sales.recordCount > 0) {
    pool.push("Compare production and sales.");
  }
  pool.push("What data do you have?");

  const asked = question.trim().toLowerCase().replace(/[?.!]+$/, "");
  const out: string[] = [];
  for (const s of pool) {
    if (s.toLowerCase().replace(/[?.!]+$/, "") === asked) continue;
    if (!out.includes(s)) out.push(s);
    if (out.length === 3) break;
  }
  return out;
}
```

#graphify/code #graphify/EXTRACTED #community/Ramesh_AI_Query_Engine