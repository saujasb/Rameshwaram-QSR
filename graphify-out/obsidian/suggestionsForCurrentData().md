---
source_file: "server/src/entities/ramesh/engine.ts"
type: "code"
community: "Ramesh AI Query Engine"
location: "L919"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Ramesh_AI_Query_Engine
---

# suggestionsForCurrentData()

## Connections
- [[buildSuggestions()]] - `calls` [EXTRACTED]
- [[datasetCoverage()]] - `calls` [EXTRACTED]
- [[engine.ts]] - `contains` [EXTRACTED]
- [[rameshroutes.ts]] - `imports` [EXTRACTED]

## Source
**From** `server/src/entities/ramesh/engine.ts` **(starting line 919):**
```typescript
export function suggestionsForCurrentData(): { suggestions: string[]; hasData: boolean } {
  const coverage = datasetCoverage();
  return { suggestions: buildSuggestions("", coverage), hasData: coverage.some((c) => c.recordCount > 0) };
}
```

#graphify/code #graphify/EXTRACTED #community/Ramesh_AI_Query_Engine