---
source_file: "server/src/entities/datasets/routes.ts"
type: "code"
community: "Ramesh AI Query Engine"
location: "L35"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Ramesh_AI_Query_Engine
---

# parseFilter()

## Connections
- [[datasetsroutes.ts]] - `contains` [EXTRACTED]

## Source
**From** `server/src/entities/datasets/routes.ts` **(starting line 35):**
```typescript
function parseFilter(q: Record<string, unknown>): DatasetFilter {
  const str = (v: unknown) => (typeof v === "string" && v.trim() ? v.trim() : undefined);
  const num = (v: unknown) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : undefined;
  };
  const dt = str(q.datasetType);
  return {
    from: str(q.from),
    to: str(q.to),
    datasetType: dt === "sales" || dt === "production" || dt === "wastage" ? (dt as DatasetType) : undefined,
    product: str(q.product),
    outlet: str(q.outlet),
    shift: str(q.shift),
    search: str(q.search),
    page: num(q.page),
    pageSize: num(q.pageSize),
  };
}
```

#graphify/code #graphify/EXTRACTED #community/Ramesh_AI_Query_Engine