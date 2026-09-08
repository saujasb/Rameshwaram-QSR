---
source_file: "server/src/entities/ramesh/intents.ts"
type: "code"
community: "Ramesh Intent Classification"
location: "L268"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Ramesh_Intent_Classification
---

# matchProduct()

## Connections
- [[classify()]] - `calls` [EXTRACTED]
- [[intents.ts]] - `contains` [EXTRACTED]
- [[norm()]] - `calls` [EXTRACTED]

## Source
**From** `server/src/entities/ramesh/intents.ts` **(starting line 268):**
```typescript
function matchProduct(q: string, products: string[]): { product?: string; productTerm?: string } {
  const nq = norm(q);
  const byLength = [...products].sort((a, b) => b.length - a.length);
  for (const p of byLength) {
    const np = norm(p);
    if (np.length >= 3 && nq.includes(np)) return { product: p };
  }
  const tokens = nq.replace(/[^a-z0-9 ]/g, " ").split(/\s+/).filter((t) => t.length >= 4 && !STOPWORDS.has(t));
  for (const t of tokens) {
    const hits = products.filter((p) => norm(p).includes(t));
    if (hits.length === 1) return { product: hits[0] };
    if (hits.length > 1) return { productTerm: t };
  }
  return {};
}
```

#graphify/code #graphify/EXTRACTED #community/Ramesh_Intent_Classification