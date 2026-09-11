---
source_file: "server/src/entities/ramesh/intents.ts"
type: "code"
community: "Ramesh Intent Classification"
location: "L151"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Ramesh_Intent_Classification
---

# resolveYear()

## Connections
- [[explicitDates()]] - `calls` [EXTRACTED]
- [[intents.ts]] - `contains` [EXTRACTED]
- [[makeKey()]] - `calls` [EXTRACTED]

## Source
**From** `server/src/entities/ramesh/intents.ts` **(starting line 151):**
```typescript
function resolveYear(month: number, day: number, year: number | undefined, businessDate: string): string | null {
  if (year !== undefined) {
    const full = year < 100 ? 2000 + year : year;
    return makeKey(full, month, day);
  }
  const thisYear = Number(businessDate.slice(0, 4));
  const candidate = makeKey(thisYear, month, day);
  if (candidate && candidate <= businessDate) return candidate;
  return makeKey(thisYear - 1, month, day) ?? candidate;
}
```

#graphify/code #graphify/EXTRACTED #community/Ramesh_Intent_Classification