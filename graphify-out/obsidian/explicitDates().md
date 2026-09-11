---
source_file: "server/src/entities/ramesh/intents.ts"
type: "code"
community: "Ramesh Intent Classification"
location: "L163"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Ramesh_Intent_Classification
---

# explicitDates()

## Connections
- [[classify()]] - `calls` [EXTRACTED]
- [[intents.ts]] - `contains` [EXTRACTED]
- [[isDateKey()]] - `calls` [EXTRACTED]
- [[makeKey()]] - `calls` [EXTRACTED]
- [[resolveYear()]] - `calls` [EXTRACTED]

## Source
**From** `server/src/entities/ramesh/intents.ts` **(starting line 163):**
```typescript
function explicitDates(q: string, businessDate: string): string[] {
  const found: string[] = [];
  const push = (key: string | null) => {
    if (key && isDateKey(key) && !found.includes(key)) found.push(key);
  };

  for (const m of q.matchAll(/\b(\d{4})-(\d{1,2})-(\d{1,2})\b/g)) {
    push(makeKey(Number(m[1]), Number(m[2]), Number(m[3])));
  }
  // 13/08/2026, 13.8.26, 13/08
  for (const m of q.matchAll(/\b(\d{1,2})[/.](\d{1,2})(?:[/.](\d{2,4}))?\b/g)) {
    push(resolveYear(Number(m[2]), Number(m[1]), m[3] ? Number(m[3]) : undefined, businessDate));
  }
  // 13 Aug, 13th August 2026
  for (const m of q.matchAll(new RegExp(`\\b(\\d{1,2})(?:st|nd|rd|th)?\\s+(${MONTH_WORDS})\\.?(?:\\s+(\\d{4}))?\\b`, "gi"))) {
    push(resolveYear(MONTHS[m[2].toLowerCase()], Number(m[1]), m[3] ? Number(m[3]) : undefined, businessDate));
  }
  // August 14, Aug 13th 2026
  for (const m of q.matchAll(new RegExp(`\\b(${MONTH_WORDS})\\.?\\s+(\\d{1,2})(?:st|nd|rd|th)?(?:,?\\s+(\\d{4}))?\\b`, "gi"))) {
    push(resolveYear(MONTHS[m[1].toLowerCase()], Number(m[2]), m[3] ? Number(m[3]) : undefined, businessDate));
  }
  return found;
}
```

#graphify/code #graphify/EXTRACTED #community/Ramesh_Intent_Classification