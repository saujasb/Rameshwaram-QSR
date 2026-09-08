---
source_file: "server/src/entities/ramesh/intents.ts"
type: "code"
community: "Ramesh Intent Classification"
location: "L56"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Ramesh_Intent_Classification
---

# INJECTION_PATTERNS

## Connections
- [[intents.ts]] - `contains` [EXTRACTED]

## Source
**From** `server/src/entities/ramesh/intents.ts` **(starting line 56):**
```typescript
const INJECTION_PATTERNS: RegExp[] = [
  /ignore\s+(?:all\s+|any\s+|the\s+)?(?:previous|prior|above|earlier|preceding)?\s*instructions?/i,
  /ignore\s+everything\s+(?:above|before)/i,
  /system\s*prompt/i,
  /\bdisregard\b/i,
  /you\s+are\s+now\b/i,
  /reveal\s+your\b/i,
  /show\s+me\s+your\s+(?:prompt|instructions|rules)/i,
  /\bjailbreak\b/i,
  /\bact\s+as\b/i,
  /new\s+instructions?/i,
  /pretend\s+(?:to\s+be|that|you)/i,
  /forget\s+(?:everything|all\s+|your\s+)/i,
  /developer\s+mode/i,
  /prompt\s+injection/i,
```

#graphify/code #graphify/EXTRACTED #community/Ramesh_Intent_Classification