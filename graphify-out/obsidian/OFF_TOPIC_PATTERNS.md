---
source_file: "server/src/entities/ramesh/intents.ts"
type: "code"
community: "Ramesh Intent Classification"
location: "L76"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Ramesh_Intent_Classification
---

# OFF_TOPIC_PATTERNS

## Connections
- [[intents.ts]] - `contains` [EXTRACTED]

## Source
**From** `server/src/entities/ramesh/intents.ts` **(starting line 76):**
```typescript
const OFF_TOPIC_PATTERNS: RegExp[] = [
  /\bweather\b|\bforecast\b|\btemperature\s+in\b|\braining\b|\brainfall\b/i,
  /\bprime\s+minister\b|\bpresident\b|\belections?\b|\bpolitics?\b|\bparliament\b/i,
  /\bmovie\b|\bfilm\b|\bsong\b|\bpoem\b|\bjoke\b|\bbedtime\s+story\b/i,
  /\bcricket\b|\bfootball\b|\bworld\s+cup\b|\bipl\b/i,
  /\bbitcoin\b|\bcrypto\b|\bstock\s+(?:price|market)\b|\bnifty\b|\bsensex\b/i,
  /\bcapital\s+of\b|\bpopulation\s+of\b|\btranslate\b/i,
  /\b(?:write|generate|debug|fix|explain)\s+(?:me\s+)?(?:some\s+)?(?:code|a\s+script|python|javascript|typescript|sql\s+query|java)\b/i,
  /\bmeaning\s+of\s+life\b/i,
  /\brecipe\b|\bhow\s+(?:do\s+i|to)\s+(?:cook|make)\s+/i,
];
```

#graphify/code #graphify/EXTRACTED #community/Ramesh_Intent_Classification