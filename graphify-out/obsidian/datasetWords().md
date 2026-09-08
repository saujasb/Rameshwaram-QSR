---
source_file: "server/src/entities/ramesh/intents.ts"
type: "code"
community: "Ramesh Intent Classification"
location: "L293"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Ramesh_Intent_Classification
---

# datasetWords()

## Connections
- [[classify()]] - `calls` [EXTRACTED]
- [[intents.ts]] - `contains` [EXTRACTED]

## Source
**From** `server/src/entities/ramesh/intents.ts` **(starting line 293):**
```typescript
function datasetWords(q: string): DatasetType[] {
  const hits: { type: DatasetType; at: number }[] = [];
  const push = (type: DatasetType, re: RegExp) => {
    const m = re.exec(q);
    if (m) hits.push({ type, at: m.index });
  };
  push("sales", SALES_RE);
  push("production", PRODUCTION_RE);
  push("wastage", WASTAGE_RE);
  return hits.sort((a, b) => a.at - b.at).map((h) => h.type);
}
```

#graphify/code #graphify/EXTRACTED #community/Ramesh_Intent_Classification