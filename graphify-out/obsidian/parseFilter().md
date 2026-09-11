---
source_file: "server/src/entities/intelligence/routes.ts"
type: "code"
community: "Business Intelligence Engine"
location: "L13"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Business_Intelligence_Engine
---

# parseFilter()

## Connections
- [[intelligenceroutes.ts]] - `contains` [EXTRACTED]

## Source
**From** `server/src/entities/intelligence/routes.ts` **(starting line 13):**
```typescript
function parseFilter(q: Record<string, unknown>): DatasetFilter {
  const str = (v: unknown) => (typeof v === "string" && v.trim() ? v.trim() : undefined);
  const dt = str(q.datasetType);
  return {
    from: str(q.from),
    to: str(q.to),
    datasetType: dt === "sales" || dt === "production" || dt === "wastage" ? (dt as DatasetType) : undefined,
    product: str(q.product),
    outlet: str(q.outlet),
    shift: str(q.shift),
  };
}
```

#graphify/code #graphify/EXTRACTED #community/Business_Intelligence_Engine