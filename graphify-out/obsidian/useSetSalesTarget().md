---
source_file: "client/src/lib/api/sales.ts"
type: "code"
community: "Sales Analytics Charts"
location: "L72"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Sales_Analytics_Charts
---

# useSetSalesTarget()

## Connections
- [[SalesTargetEditor.tsx]] - `imports` [EXTRACTED]
- [[apisales.ts]] - `contains` [EXTRACTED]
- [[apiPut()]] - `calls` [EXTRACTED]
- [[useSalesTargetWithEditor()]] - `calls` [EXTRACTED]

## Source
**From** `client/src/lib/api/sales.ts` **(starting line 72):**
```typescript
export function useSetSalesTarget() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (amount: number) => apiPut<SalesTargetSetting>("/sales/target", { amount }),
    onSuccess: (data) => qc.setQueryData(["sales-target"], data),
  });
}
```

#graphify/code #graphify/EXTRACTED #community/Sales_Analytics_Charts