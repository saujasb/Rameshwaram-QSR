---
source_file: "server/src/entities/ramesh/intents.ts"
type: "code"
community: "Ramesh Intent Classification"
location: "L141"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Ramesh_Intent_Classification
---

# makeKey()

## Connections
- [[explicitDates()]] - `calls` [EXTRACTED]
- [[intents.ts]] - `contains` [EXTRACTED]
- [[monthBounds()]] - `calls` [EXTRACTED]
- [[pad2()]] - `calls` [EXTRACTED]
- [[resolveYear()]] - `calls` [EXTRACTED]

## Source
**From** `server/src/entities/ramesh/intents.ts` **(starting line 141):**
```typescript
function makeKey(year: number, month: number, day: number): string | null {
  if (month < 1 || month > 12 || day < 1 || day > 31) return null;
  const key = `${year}-${pad2(month)}-${pad2(day)}`;
  const [y, m, d] = [year, month, day];
  const probe = new Date(y, m - 1, d);
  if (probe.getMonth() + 1 !== m || probe.getDate() !== d) return null;
  return key;
}
```

#graphify/code #graphify/EXTRACTED #community/Ramesh_Intent_Classification