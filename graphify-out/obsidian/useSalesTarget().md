---
source_file: "client/src/lib/api/sales.ts"
type: "code"
community: "Sales Analytics Charts"
location: "L65"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Sales_Analytics_Charts
---

# useSalesTarget()

## Connections
- [[SalesTargetEditor.tsx]] - `imports` [EXTRACTED]
- [[apisales.ts]] - `contains` [EXTRACTED]
- [[apiGet()]] - `calls` [EXTRACTED]
- [[useSalesTargetWithEditor()]] - `calls` [EXTRACTED]

## Source
**From** `client/src/lib/api/sales.ts` **(starting line 65):**
```typescript
export function useSalesTarget() {
  return useQuery({
    queryKey: ["sales-target"],
    queryFn: () => apiGet<SalesTargetSetting>("/sales/target"),
  });
}
```

#graphify/code #graphify/EXTRACTED #community/Sales_Analytics_Charts