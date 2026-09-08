---
source_file: "client/src/modules/dashboard/SalesTargetEditor.tsx"
type: "code"
community: "Sales Analytics Charts"
location: "L17"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Sales_Analytics_Charts
---

# save()

## Connections
- [[useSalesTargetWithEditor()]] - `contains` [EXTRACTED]

## Source
**From** `client/src/modules/dashboard/SalesTargetEditor.tsx` **(starting line 17):**
```tsx
  function save() {
    const amount = Number(draft);
    if (!Number.isFinite(amount) || amount < 0) return;
    setTarget.mutate(amount, { onSuccess: () => setEditing(false) });
  }
```

#graphify/code #graphify/EXTRACTED #community/Sales_Analytics_Charts