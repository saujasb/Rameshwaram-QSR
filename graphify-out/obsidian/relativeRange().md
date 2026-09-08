---
source_file: "server/src/entities/ramesh/intents.ts"
type: "code"
community: "Ramesh Intent Classification"
location: "L210"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Ramesh_Intent_Classification
---

# relativeRange()

## Connections
- [[classify()]] - `calls` [EXTRACTED]
- [[intents.ts]] - `contains` [EXTRACTED]
- [[monthBounds()]] - `calls` [EXTRACTED]
- [[shiftDateKey()]] - `calls` [EXTRACTED]
- [[weekStart()]] - `calls` [EXTRACTED]

## Source
**From** `server/src/entities/ramesh/intents.ts` **(starting line 210):**
```typescript
function relativeRange(q: string, bd: string): Range | null {
  const nDays = q.match(/\b(?:last|past|previous|latest|trailing)\s+(\d{1,3})\s*(day|days|d)\b/i);
  if (nDays) {
    const n = Math.min(400, Math.max(1, Number(nDays[1])));
    return { from: shiftDateKey(bd, -(n - 1)), to: bd, label: `the last ${n} business days` };
  }
  const nWeeks = q.match(/\b(?:last|past|previous)\s+(\d{1,2})\s*weeks?\b/i);
  if (nWeeks) {
    const n = Math.min(52, Math.max(1, Number(nWeeks[1])));
    return { from: shiftDateKey(bd, -(n * 7 - 1)), to: bd, label: `the last ${n * 7} business days` };
  }
  if (/\bday\s+before\s+yesterday\b/i.test(q)) {
    const d = shiftDateKey(bd, -2);
    return { from: d, to: d, label: "the day before yesterday" };
  }
  if (/\byesterday'?s?\b/i.test(q)) {
    const d = shiftDateKey(bd, -1);
    return { from: d, to: d, label: "yesterday" };
  }
  if (/\b(today|today'?s|so\s+far\s+today|tonight|current\s+business\s+day)\b/i.test(q)) {
    return { from: bd, to: bd, label: "today" };
  }
  if (/\bthis\s+week\b/i.test(q)) {
    return { from: weekStart(bd), to: bd, label: "this week so far" };
  }
  if (/\b(last|past|previous)\s+week\b/i.test(q)) {
    return { from: shiftDateKey(bd, -6), to: bd, label: "the last 7 business days" };
  }
  if (/\bthis\s+month\b/i.test(q)) {
    return { from: monthBounds(bd, 0).from, to: bd, label: "this month so far" };
  }
  if (/\b(last|past|previous)\s+month\b/i.test(q)) {
    const b = monthBounds(bd, 1);
    return { from: b.from, to: b.to, label: "last month" };
  }
  if (/\b(last|past)\s+(?:fortnight|two\s+weeks)\b/i.test(q)) {
    return { from: shiftDateKey(bd, -13), to: bd, label: "the last 14 business days" };
  }
  return null;
}
```

#graphify/code #graphify/EXTRACTED #community/Ramesh_Intent_Classification