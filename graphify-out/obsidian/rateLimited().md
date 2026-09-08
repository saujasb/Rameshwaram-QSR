---
source_file: "server/src/entities/ramesh/routes.ts"
type: "code"
community: "Ramesh AI Query Engine"
location: "L16"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Ramesh_AI_Query_Engine
---

# rateLimited()

## Connections
- [[rameshroutes.ts]] - `contains` [EXTRACTED]

## Source
**From** `server/src/entities/ramesh/routes.ts` **(starting line 16):**
```typescript
function rateLimited(key: string): { limited: boolean; retryAfterSec: number } {
  const now = Date.now();
  const entry = hits.get(key);
  if (!entry || now >= entry.resetAt) {
    hits.set(key, { count: 1, resetAt: now + WINDOW_MS });
    // Opportunistic sweep so the map can't grow without bound.
    if (hits.size > 500) {
      for (const [k, v] of hits) if (now >= v.resetAt) hits.delete(k);
    }
    return { limited: false, retryAfterSec: 0 };
  }
  entry.count++;
  if (entry.count > MAX_PER_WINDOW) {
    return { limited: true, retryAfterSec: Math.max(1, Math.ceil((entry.resetAt - now) / 1000)) };
  }
  return { limited: false, retryAfterSec: 0 };
}
```

#graphify/code #graphify/EXTRACTED #community/Ramesh_AI_Query_Engine