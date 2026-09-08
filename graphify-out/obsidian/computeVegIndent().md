---
source_file: "client/src/modules/sales-analytics/vegIndentCompute.ts"
type: "code"
community: "Veg Indent & Analytics Engine"
location: "L9"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Veg_Indent__Analytics_Engine
---

# computeVegIndent()

## Connections
- [[VegIndentPage()]] - `indirect_call` [INFERRED]
- [[VegIndentPage.tsx]] - `imports` [EXTRACTED]
- [[vegIndentCompute.ts]] - `contains` [EXTRACTED]

## Source
**From** `client/src/modules/sales-analytics/vegIndentCompute.ts` **(starting line 9):**
```typescript
export function computeVegIndent(v: VegIndentItem): VegIndentComputed {
  let diff: number | null = null;
  let pct: number | null = null;
  let status: string;

  if (v.kind === "full") {
    if (v.orderQty == null) {
      status = "NO ORDER";
    } else if (v.requirement == null) {
      status = "SEE NOTE";
    } else {
      diff = v.orderQty - v.requirement;
      pct = v.requirement !== 0 ? diff / v.requirement : 0;
      status = Math.abs(pct) <= 0.01 ? "ON TARGET" : pct > 0 ? "OVER-ORDERED" : "UNDER-ORDERED";
    }
  } else if (v.kind === "blank") {
    status = v.orderQty ? "ORDERED, NO REQMT" : "NO REQMT STATED";
  } else if (v.kind === "none") {
    status = "NOT TRACKED";
  } else {
    status = "SEE NOTE";
  }

  return { ...v, diff, pct, status };
}
```

#graphify/code #graphify/EXTRACTED #community/Veg_Indent__Analytics_Engine